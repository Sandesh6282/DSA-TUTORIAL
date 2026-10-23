"use client";
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, getLanguageConfig, LanguageConfig } from "@/lib/languages";
import { ExecutionResult } from "@/lib/executor";
import { Play, RotateCcw, Trash2, Terminal, Clock, Cpu, CheckCircle2, AlertTriangle, XCircle, Code2 } from "lucide-react";

interface CodeEditorProps {
  topicId?: string;
  initialCode?: string;
  topicStarterCodes?: Record<string, string>;
  onCodeChange?: (lang: string, code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  topicStarterCodes,
  onCodeChange
}) => {
  const [selectedLangKey, setSelectedLangKey] = useState<string>("cpp");
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  const [stdin, setStdin] = useState<string>("");
  const [showStdin, setShowStdin] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const currentLangConfig: LanguageConfig = getLanguageConfig(selectedLangKey);

  // Initialize starter code or drafts
  useEffect(() => {
    setCodeDrafts((prev) => {
      if (!prev[selectedLangKey]) {
        const defaultForLang =
          (topicStarterCodes && topicStarterCodes[selectedLangKey]) ||
          (selectedLangKey === "cpp" && initialCode ? initialCode : currentLangConfig.defaultCode);
        return {
          ...prev,
          [selectedLangKey]: defaultForLang
        };
      }
      return prev;
    });
  }, [selectedLangKey, initialCode, topicStarterCodes, currentLangConfig.defaultCode]);

  const currentCode =
    codeDrafts[selectedLangKey] ??
    ((topicStarterCodes && topicStarterCodes[selectedLangKey]) ||
      (selectedLangKey === "cpp" && initialCode ? initialCode : currentLangConfig.defaultCode));

  const handleLanguageChange = (newLangKey: string) => {
    setSelectedLangKey(newLangKey);
    const newLangConfig = getLanguageConfig(newLangKey);
    if (!codeDrafts[newLangKey]) {
      const defaultCode =
        (topicStarterCodes && topicStarterCodes[newLangKey]) || newLangConfig.defaultCode;
      setCodeDrafts((prev) => ({
        ...prev,
        [newLangKey]: defaultCode
      }));
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const updated = value || "";
    setCodeDrafts((prev) => ({
      ...prev,
      [selectedLangKey]: updated
    }));
    if (onCodeChange) {
      onCodeChange(selectedLangKey, updated);
    }
  };

  const handleResetCode = () => {
    if (window.confirm("Reset this editor code back to the default starter template?")) {
      const starter =
        (topicStarterCodes && topicStarterCodes[selectedLangKey]) || currentLangConfig.defaultCode;
      setCodeDrafts((prev) => ({
        ...prev,
        [selectedLangKey]: starter
      }));
      setResult(null);
    }
  };

  const handleRunCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: currentCode,
          language: selectedLangKey,
          stdin: stdin
        })
      });

      const data: ExecutionResult = await response.json();
      setResult(data);
    } catch (err: unknown) {
      setResult({
        status: "ERROR",
        stdout: "",
        stderr: (err as Error)?.message || "Failed to communicate with code execution service.",
        provider: "Judge0"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-6">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-blue-400 font-semibold text-sm">
            <Code2 className="w-4 h-4 mr-2" />
            Interactive Code Lab
          </div>

          {/* Language Selector */}
          <select
            value={selectedLangKey}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-800 text-gray-200 text-xs sm:text-sm font-medium border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.key} value={lang.key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {/* Stdin Toggle */}
          <button
            onClick={() => setShowStdin(!showStdin)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center ${
              showStdin
                ? "bg-purple-900/40 border-purple-500 text-purple-200"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 mr-1" />
            Stdin {showStdin ? "▲" : "▼"}
          </button>

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            title="Reset to starter template"
            className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code Button */}
          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className={`flex items-center font-semibold text-sm px-4 py-1.5 rounded-lg shadow transition-all ${
              isRunning
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white"
            }`}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1.5 fill-current" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Standard Input Drawer */}
      {showStdin && (
        <div className="bg-gray-950/80 px-4 py-3 border-b border-gray-800">
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Standard Input (stdin for programs using input(), cin, Scanner):
          </label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Type standard input lines here..."
            rows={2}
            className="w-full bg-gray-900 text-gray-200 text-xs font-mono p-2 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Monaco Editor */}
      <div className="h-[360px] w-full">
        <Editor
          height="100%"
          language={currentLangConfig.monacoLang}
          theme="vs-dark"
          value={currentCode}
          onChange={handleEditorChange}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on"
          }}
        />
      </div>

      {/* Output Console Panel */}
      <div className="bg-gray-950 border-t border-gray-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Terminal Output</span>
            {result && (
              <span
                className={`ml-2 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center ${
                  result.status === "SUCCESS"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : result.status === "COMPILE_ERROR"
                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                    : "bg-red-950 text-red-400 border border-red-800"
                }`}
              >
                {result.status === "SUCCESS" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {result.status === "COMPILE_ERROR" && <AlertTriangle className="w-3 h-3 mr-1" />}
                {result.status !== "SUCCESS" && result.status !== "COMPILE_ERROR" && (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {result.status}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-400">
            {result?.executionTime && (
              <span className="flex items-center text-gray-400">
                <Clock className="w-3 h-3 mr-1" /> {result.executionTime}
              </span>
            )}
            {result?.memory && (
              <span className="flex items-center text-gray-400">
                <Cpu className="w-3 h-3 mr-1" /> {result.memory}
              </span>
            )}
            {result && (
              <button
                onClick={() => setResult(null)}
                title="Clear output"
                className="text-gray-500 hover:text-gray-300 p-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Output text box */}
        <div className="bg-black/70 rounded-xl p-3 font-mono text-xs text-gray-200 min-h-[90px] max-h-[220px] overflow-y-auto border border-gray-800/80">
          {!result && !isRunning && (
            <p className="text-gray-600 italic">Click &apos;Run Code&apos; above to compile and execute your program.</p>
          )}

          {isRunning && (
            <div className="flex items-center text-blue-400">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Submitting code to container environment and executing...</span>
            </div>
          )}

          {result && (
            <div className="space-y-2">
              {result.compileOutput && (
                <div>
                  <span className="text-amber-400 font-bold block mb-1">Compilation Output:</span>
                  <pre className="text-amber-300/90 whitespace-pre-wrap">{result.compileOutput}</pre>
                </div>
              )}

              {result.stdout && (
                <div>
                  <pre className="text-emerald-300 whitespace-pre-wrap">{result.stdout}</pre>
                </div>
              )}

              {result.stderr && (
                <div>
                  <span className="text-red-400 font-bold block mb-1">Standard Error / Stack Trace:</span>
                  <pre className="text-red-300 whitespace-pre-wrap">{result.stderr}</pre>
                </div>
              )}

              {!result.stdout && !result.stderr && !result.compileOutput && (
                <p className="text-gray-500 italic">Program finished with exit code {result.exitCode ?? 0} and no output.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
