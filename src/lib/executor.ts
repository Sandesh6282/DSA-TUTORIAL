import { getLanguageConfig, LanguageConfig } from "./languages";

export interface ExecutionResult {
  status:
    | "SUCCESS"
    | "COMPILE_ERROR"
    | "RUNTIME_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "ERROR"
    | "CONFIG_ERROR";
  stdout: string;
  stderr: string;
  compileOutput?: string;
  executionTime?: string;
  memory?: string;
  exitCode?: number;
  provider: "Judge0" | "Piston";
  message?: string;
}

function decodeBase64(str: string | null | undefined): string {
  if (!str) return "";
  try {
    return Buffer.from(str, "base64").toString("utf8");
  } catch {
    return str;
  }
}

export async function executeCode(
  sourceCode: string,
  languageKey: string,
  stdin: string = ""
): Promise<ExecutionResult> {
  const langConfig = getLanguageConfig(languageKey);

  if (!langConfig || !langConfig.supported) {
    return {
      status: "ERROR",
      stdout: "",
      stderr: `Language '${languageKey}' is not supported.`,
      provider: "Judge0",
      message: "Unsupported language selection."
    };
  }

  // Safety limits: max 64KB code, 16KB stdin
  if (sourceCode.length > 65536) {
    return {
      status: "ERROR",
      stdout: "",
      stderr: "Source code exceeds the maximum allowed length of 64KB.",
      provider: "Judge0"
    };
  }

  if (stdin.length > 16384) {
    return {
      status: "ERROR",
      stdout: "",
      stderr: "Standard input exceeds maximum allowed length of 16KB.",
      provider: "Judge0"
    };
  }

  // Judge0 endpoint: use configured environment URL or official public Judge0 CE
  const judge0Url = process.env.JUDGE0_API_URL?.trim() || "https://ce.judge0.com";
  const judge0Key = process.env.JUDGE0_API_KEY?.trim();
  const judge0Host = process.env.JUDGE0_API_HOST?.trim();

  try {
    const judge0Result = await executeWithJudge0(
      sourceCode,
      langConfig,
      stdin,
      judge0Url,
      judge0Key,
      judge0Host
    );
    return judge0Result;
  } catch (err: unknown) {
    const errorMsg = (err as Error)?.message || "Judge0 execution failed";
    return {
      status: "ERROR",
      stdout: "",
      stderr: `Code execution failed: ${errorMsg}\n\nPlease check your internet connection or verify your JUDGE0_API_URL and credentials in .env.local.`,
      provider: "Judge0",
      message: "Execution provider unavailable."
    };
  }
}

/**
 * Judge0 execution using base64_encoded=true for safe UTF-8 and binary handling
 */
async function executeWithJudge0(
  sourceCode: string,
  langConfig: LanguageConfig,
  stdin: string,
  baseUrl: string,
  apiKey?: string,
  apiHost?: string
): Promise<ExecutionResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (apiKey) {
    headers["X-RapidAPI-Key"] = apiKey;
  }
  if (apiHost) {
    headers["X-RapidAPI-Host"] = apiHost;
  }

  const b64Source = Buffer.from(sourceCode, "utf8").toString("base64");
  const b64Stdin = stdin ? Buffer.from(stdin, "utf8").toString("base64") : "";

  // 1. Submit code to Judge0 with base64_encoded=true and wait=true
  const submitUrl = `${baseUrl.replace(/\/$/, "")}/submissions?base64_encoded=true&wait=true`;
  const submitRes = await fetch(submitUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source_code: b64Source,
      language_id: langConfig.judge0Id,
      stdin: b64Stdin,
      cpu_time_limit: 5.0,
      memory_limit: 128000
    })
  });

  if (!submitRes.ok) {
    throw new Error(`Judge0 service returned HTTP ${submitRes.status}`);
  }

  const data = await submitRes.json();
  const statusId = data.status?.id;

  // If already finished in synchronous wait:
  if (statusId && statusId !== 1 && statusId !== 2) {
    return parseJudge0Response(data);
  }

  // 2. Fallback: asynchronous polling workflow
  const token = data.token;
  if (!token) {
    throw new Error("Judge0 did not return an execution result or submission token");
  }

  const pollUrl = `${baseUrl.replace(/\/$/, "")}/submissions/${token}?base64_encoded=true`;
  const maxAttempts = 12; // Poll up to ~6 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, 500));

    const pollRes = await fetch(pollUrl, { headers });
    if (!pollRes.ok) continue;

    const pollData = await pollRes.json();
    const pollStatusId = pollData.status?.id;

    if (pollStatusId === 1 || pollStatusId === 2) {
      continue;
    }

    return parseJudge0Response(pollData);
  }

  return {
    status: "TIME_LIMIT_EXCEEDED",
    stdout: "",
    stderr: "Execution polling timed out waiting for worker.",
    provider: "Judge0"
  };
}

interface Judge0Payload {
  status?: { id: number; description?: string };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string | null;
  memory?: number | null;
  exit_code?: number | null;
  message?: string | null;
}

function parseJudge0Response(data: Judge0Payload): ExecutionResult {
  const statusId = data.status?.id;

  let status: ExecutionResult["status"] = "SUCCESS";
  if (statusId === 5) status = "TIME_LIMIT_EXCEEDED";
  else if (statusId === 6) status = "COMPILE_ERROR";
  else if (statusId && statusId >= 7 && statusId <= 12) status = "RUNTIME_ERROR";
  else if (statusId && statusId > 3) status = "ERROR";

  const stdout = decodeBase64(data.stdout);
  const stderr = decodeBase64(data.stderr);
  const compileOutput = decodeBase64(data.compile_output);
  const message = decodeBase64(data.message) || data.status?.description;

  return {
    status,
    stdout,
    stderr,
    compileOutput: compileOutput || undefined,
    executionTime: data.time ? `${data.time}s` : undefined,
    memory: data.memory ? `${(data.memory / 1024).toFixed(1)} MB` : undefined,
    exitCode: data.exit_code ?? 0,
    provider: "Judge0",
    message
  };
}
