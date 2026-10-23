import fs from "fs";
import path from "path";
import { TopicConfig, DEFAULT_TOPICS } from "./topics";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "recruiter_topics.json");

// In-memory cache for fast access across route handler requests
let memoryCache: TopicConfig[] | null = null;

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not create data directory, using memory store:", err);
  }
}

export function getRecruiterTopics(): TopicConfig[] {
  if (memoryCache) {
    return memoryCache;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read recruiter settings file, falling back to defaults:", err);
  }

  // Fallback to default curriculum
  memoryCache = DEFAULT_TOPICS;
  return DEFAULT_TOPICS;
}

export function saveRecruiterTopics(topics: TopicConfig[]): { success: boolean; error?: string } {
  const validation = validateTopicConfig(topics);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  ensureDataDir();

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(topics, null, 2), "utf-8");
    memoryCache = topics;
    return { success: true };
  } catch (err) {
    console.error("Failed to persist recruiter settings to disk:", err);
    // Keep in memory cache even if filesystem write fails (e.g. read-only serverless environment)
    memoryCache = topics;
    return { success: true };
  }
}

export function resetRecruiterTopicsToDefault(): TopicConfig[] {
  ensureDataDir();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      fs.unlinkSync(SETTINGS_FILE);
    }
  } catch (err) {
    console.warn("Could not remove settings file:", err);
  }
  memoryCache = DEFAULT_TOPICS;
  return DEFAULT_TOPICS;
}

/**
 * Validates recruiter payload
 */
export function validateTopicConfig(topics: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(topics) || topics.length === 0) {
    return { valid: false, error: "Configuration must be a non-empty array of topics." };
  }

  const enabledCount = topics.filter((t) => t.enabled).length;
  if (enabledCount === 0) {
    return { valid: false, error: "At least one topic must remain enabled." };
  }

  const idSet = new Set<string>();

  for (let i = 0; i < topics.length; i++) {
    const t = topics[i];
    if (!t.id || typeof t.id !== "string") {
      return { valid: false, error: `Topic at index ${i} is missing a valid id.` };
    }
    if (idSet.has(t.id)) {
      return { valid: false, error: `Duplicate topic id found: '${t.id}'.` };
    }
    idSet.add(t.id);

    if (!t.name || typeof t.name !== "string") {
      return { valid: false, error: `Topic '${t.id}' must have a name.` };
    }

    if (!Array.isArray(t.prerequisites)) {
      return { valid: false, error: `Topic '${t.id}' prerequisites must be an array.` };
    }

    if (t.prerequisites.includes(t.id)) {
      return { valid: false, error: `Topic '${t.id}' cannot have itself as a prerequisite.` };
    }

    if (!Array.isArray(t.quizzes)) {
      return { valid: false, error: `Topic '${t.id}' quizzes must be an array.` };
    }

    for (let qIdx = 0; qIdx < t.quizzes.length; qIdx++) {
      const q = t.quizzes[qIdx];
      if (!q.question || typeof q.question !== "string") {
        return { valid: false, error: `Question #${qIdx + 1} in '${t.name}' is missing question text.` };
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return { valid: false, error: `Question #${qIdx + 1} in '${t.name}' must have at least 2 options.` };
      }
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        return { valid: false, error: `Question #${qIdx + 1} in '${t.name}' has invalid correct answer index.` };
      }
    }
  }

  return { valid: true };
}
