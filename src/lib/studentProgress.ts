import { TopicConfig, DEFAULT_TOPICS } from "./topics";

export interface TopicProgressDetail {
  quizPassed: boolean;
  quizScore: number;
  quizTotal: number;
  lastAttemptAt?: string;
  completedAt?: string;
}

export interface StudentProgress {
  completedTopics: string[]; // list of completed topic IDs
  topicDetails: Record<string, TopicProgressDetail>;
  codeDrafts: Record<string, string>; // key: `${topicId}_${languageKey}`
  lastActiveTopicId?: string;
}

const STORAGE_KEY = "dsa_tutor_student_progress_v2";

export const INITIAL_PROGRESS: StudentProgress = {
  completedTopics: [],
  topicDetails: {},
  codeDrafts: {},
  lastActiveTopicId: "arrays"
};

export function loadStudentProgress(): StudentProgress {
  if (typeof window === "undefined") {
    return INITIAL_PROGRESS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy unlockedTopics migration
      const legacyUnlocked = localStorage.getItem("unlockedTopics");
      if (legacyUnlocked) {
        try {
          const parsedLegacy = JSON.parse(legacyUnlocked);
          if (Array.isArray(parsedLegacy)) {
            const completed = parsedLegacy
              .filter((t: { unlocked: boolean; path: string }) => t.unlocked && t.path !== "/arrays")
              .map((t: { path: string }) => t.path.replace(/^\//, ""));
            return {
              ...INITIAL_PROGRESS,
              completedTopics: completed
            };
          }
        } catch {
          // ignore legacy parse errors
        }
      }
      return INITIAL_PROGRESS;
    }

    const data = JSON.parse(raw);
    return {
      completedTopics: Array.isArray(data.completedTopics) ? data.completedTopics : [],
      topicDetails: typeof data.topicDetails === "object" && data.topicDetails !== null ? data.topicDetails : {},
      codeDrafts: typeof data.codeDrafts === "object" && data.codeDrafts !== null ? data.codeDrafts : {},
      lastActiveTopicId: data.lastActiveTopicId || "arrays"
    };
  } catch (err) {
    console.error("Failed to load student progress from localStorage:", err);
    return INITIAL_PROGRESS;
  }
}

export function saveStudentProgress(progress: StudentProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error("Failed to save student progress to localStorage:", err);
  }
}

export function isTopicUnlocked(
  topicId: string,
  topics: TopicConfig[],
  progress: StudentProgress
): { unlocked: boolean; missingPrereqs: string[] } {
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) {
    return { unlocked: false, missingPrereqs: [] };
  }

  // Topic marked as initially unlocked (e.g. Arrays)
  if (topic.initialUnlocked || topic.prerequisites.length === 0) {
    return { unlocked: true, missingPrereqs: [] };
  }

  // Check all prerequisites
  const missingPrereqs = topic.prerequisites.filter(
    (prereqId) => !progress.completedTopics.includes(prereqId)
  );

  return {
    unlocked: missingPrereqs.length === 0,
    missingPrereqs
  };
}

export function isTopicCompleted(topicId: string, progress: StudentProgress): boolean {
  return progress.completedTopics.includes(topicId);
}

export function recordQuizCompletion(
  topicId: string,
  score: number,
  total: number,
  passingScore: number,
  progress: StudentProgress
): { updatedProgress: StudentProgress; passed: boolean; newlyUnlocked: string[] } {
  const passed = score >= passingScore;
  const currentDetails = progress.topicDetails[topicId] || {
    quizPassed: false,
    quizScore: 0,
    quizTotal: total
  };

  const isNewlyPassed = passed && !progress.completedTopics.includes(topicId);
  const updatedCompleted = isNewlyPassed
    ? [...progress.completedTopics, topicId]
    : progress.completedTopics;

  const updatedProgress: StudentProgress = {
    ...progress,
    completedTopics: updatedCompleted,
    topicDetails: {
      ...progress.topicDetails,
      [topicId]: {
        ...currentDetails,
        quizPassed: currentDetails.quizPassed || passed,
        quizScore: Math.max(currentDetails.quizScore, score),
        quizTotal: total,
        lastAttemptAt: new Date().toISOString(),
        completedAt: isNewlyPassed ? new Date().toISOString() : currentDetails.completedAt
      }
    }
  };

  saveStudentProgress(updatedProgress);

  // Check what newly became unlocked
  const newlyUnlocked: string[] = [];
  if (isNewlyPassed) {
    DEFAULT_TOPICS.forEach((t) => {
      if (!isTopicCompleted(t.id, progress) && t.prerequisites.includes(topicId)) {
        const check = isTopicUnlocked(t.id, DEFAULT_TOPICS, updatedProgress);
        if (check.unlocked) {
          newlyUnlocked.push(t.name);
        }
      }
    });
  }

  return { updatedProgress, passed, newlyUnlocked };
}

export function saveCodeDraft(
  topicId: string,
  langKey: string,
  code: string,
  progress: StudentProgress
): StudentProgress {
  const draftKey = `${topicId}_${langKey}`;
  const updated: StudentProgress = {
    ...progress,
    codeDrafts: {
      ...progress.codeDrafts,
      [draftKey]: code
    }
  };
  saveStudentProgress(updated);
  return updated;
}

export function getCodeDraft(
  topicId: string,
  langKey: string,
  progress: StudentProgress,
  fallbackCode: string
): string {
  const draftKey = `${topicId}_${langKey}`;
  return progress.codeDrafts[draftKey] ?? fallbackCode;
}

export function resetStudentProgress(): StudentProgress {
  const fresh: StudentProgress = {
    ...INITIAL_PROGRESS
  };
  saveStudentProgress(fresh);
  return fresh;
}
