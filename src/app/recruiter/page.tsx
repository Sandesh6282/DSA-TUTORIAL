"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  Save,
  RotateCcw,
  Eye,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ListOrdered,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicConfig, DEFAULT_TOPICS, QuizQuestion } from "@/lib/topics";

export default function RecruiterDashboard() {
  const router = useRouter();
  const [topics, setTopics] = useState<TopicConfig[]>([]);
  const [originalTopics, setOriginalTopics] = useState<TopicConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Check auth and fetch config
  useEffect(() => {
    fetch("/api/recruiter/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/recruiter/login");
        } else {
          loadConfig();
        }
      })
      .catch(() => {
        router.replace("/recruiter/login");
      });
  }, [router]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/recruiter/config");
      const data = await res.json();
      if (Array.isArray(data.topics)) {
        setTopics(data.topics);
        setOriginalTopics(JSON.parse(JSON.stringify(data.topics)));
      } else {
        setTopics(DEFAULT_TOPICS);
        setOriginalTopics(DEFAULT_TOPICS);
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to load curriculum configuration." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/recruiter/logout", { method: "POST" });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const handleMoveTopic = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;

    const reordered = [...topics];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update orders
    const updated = reordered.map((t, idx) => ({ ...t, order: idx + 1 }));
    setTopics(updated);
  };

  const handleToggleEnabled = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleTogglePrerequisite = (topicId: string, prereqId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const exists = t.prerequisites.includes(prereqId);
        const updated = exists
          ? t.prerequisites.filter((id) => id !== prereqId)
          : [...t.prerequisites, prereqId];
        return { ...t, prerequisites: updated };
      })
    );
  };

  const handleUpdateQuestion = (
    topicId: string,
    questionIdx: number,
    field: keyof QuizQuestion,
    val: unknown
  ) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newQuizzes = [...t.quizzes];
        newQuizzes[questionIdx] = {
          ...newQuizzes[questionIdx],
          [field]: val
        };
        return { ...t, quizzes: newQuizzes };
      })
    );
  };

  const handleUpdateOption = (
    topicId: string,
    qIdx: number,
    optIdx: number,
    val: string
  ) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newQuizzes = [...t.quizzes];
        const newOptions = [...newQuizzes[qIdx].options];
        newOptions[optIdx] = val;
        newQuizzes[qIdx] = { ...newQuizzes[qIdx], options: newOptions };
        return { ...t, quizzes: newQuizzes };
      })
    );
  };

  const handleAddQuestion = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newQ: QuizQuestion = {
          id: `custom-${Date.now()}`,
          question: "New Multiple Choice Question",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          explanation: "Explanation of why this answer is correct."
        };
        return { ...t, quizzes: [...t.quizzes, newQ] };
      })
    );
  };

  const handleDeleteQuestion = (topicId: string, qIdx: number) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newQuizzes = t.quizzes.filter((_, idx) => idx !== qIdx);
        return { ...t, quizzes: newQuizzes };
      })
    );
  };

  const handlePassingScoreChange = (topicId: string, score: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, passingScore: Math.max(1, score) } : t))
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/recruiter/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics })
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: "error", text: data.error || "Failed to save configuration." });
      } else {
        setStatusMessage({ type: "success", text: "Curriculum configuration saved successfully!" });
        setOriginalTopics(JSON.parse(JSON.stringify(topics)));
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error saving settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    setTopics(JSON.parse(JSON.stringify(originalTopics)));
    setStatusMessage({ type: "success", text: "Unsaved modifications reverted." });
  };

  const handleResetToDefault = async () => {
    try {
      const res = await fetch("/api/recruiter/config/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTopics(data.topics);
        setOriginalTopics(JSON.parse(JSON.stringify(data.topics)));
        setShowResetConfirm(false);
        setStatusMessage({ type: "success", text: "Curriculum reset to default settings." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Could not reset configuration." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="flex items-center space-x-3 text-purple-400">
          <svg className="animate-spin h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="font-semibold text-lg">Loading recruiter portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white p-4 sm:p-8">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-600/20 border border-purple-500/40 rounded-xl text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Recruiter Curriculum Management</h1>
            <p className="text-xs text-gray-400">
              Customize topic ordering, unlock prerequisites, quiz banks, and student progression
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/topics"
            className="inline-flex items-center text-xs font-semibold px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4 mr-1.5 text-blue-400" />
            Preview Student Experience
          </Link>

          <Button
            onClick={handleLogout}
            className="inline-flex items-center text-xs font-semibold px-4 py-2 bg-gray-800 hover:bg-red-950/60 hover:text-red-300 text-gray-400 border border-gray-700 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Actions & Status Ribbon */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md bg-opacity-95">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {topics.filter((t) => t.enabled).length} of {topics.length} Topics Active
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors flex items-center"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Defaults
            </button>

            <button
              onClick={handleCancelChanges}
              className="px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors"
            >
              Cancel
            </button>

            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg shadow-purple-500/20 flex items-center"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>

        {/* Status Notification */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl text-sm flex items-center justify-between border ${
                statusMessage.type === "success"
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  : "bg-red-950/40 border-red-500/50 text-red-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topics List Table/Cards */}
        <div className="space-y-4 mb-12">
          {topics.map((topic, index) => {
            const isExpanded = expandedTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className={`bg-gray-900 border rounded-2xl transition-all shadow-md overflow-hidden ${
                  topic.enabled ? "border-gray-800" : "border-gray-800/40 opacity-70 bg-gray-950/60"
                }`}
              >
                {/* Topic Header Row */}
                <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col space-y-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveTopic(index, "up")}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-20 hover:bg-gray-800 rounded"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === topics.length - 1}
                        onClick={() => handleMoveTopic(index, "down")}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-20 hover:bg-gray-800 rounded"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-bold text-gray-500">
                      #{index + 1}
                    </span>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-lg text-white">{topic.name}</h3>
                        {!topic.enabled && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                            Disabled
                          </span>
                        )}
                        {topic.initialUnlocked && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            Initially Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{topic.summary}</p>
                    </div>
                  </div>

                  {/* Actions & Expansion */}
                  <div className="flex items-center space-x-4">
                    {/* Enable Toggle */}
                    <button
                      onClick={() => handleToggleEnabled(topic.id)}
                      className={`flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        topic.enabled
                          ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                          : "bg-gray-800 border-gray-700 text-gray-400"
                      }`}
                    >
                      {topic.enabled ? (
                        <>
                          <ToggleRight className="w-4 h-4 mr-1 text-emerald-400" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-1 text-gray-500" />
                          Disabled
                        </>
                      )}
                    </button>

                    {/* Expand Questions/Prerequisites Editor */}
                    <button
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-medium text-gray-200 flex items-center transition-colors"
                    >
                      <ListOrdered className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                      Configure ({topic.quizzes.length} Qs)
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 ml-1.5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Configuration Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-800 bg-gray-950/80 p-5 sm:p-6"
                    >
                      {/* Prerequisites Configuration */}
                      <div className="mb-6 pb-6 border-b border-gray-800">
                        <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                          Prerequisites required to unlock {topic.name}:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {topics
                            .filter((t) => t.id !== topic.id)
                            .map((candidate) => {
                              const isChecked = topic.prerequisites.includes(candidate.id);
                              return (
                                <button
                                  key={candidate.id}
                                  type="button"
                                  onClick={() => handleTogglePrerequisite(topic.id, candidate.id)}
                                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                                    isChecked
                                      ? "bg-purple-900/60 border-purple-500 text-purple-200"
                                      : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300"
                                  }`}
                                >
                                  {isChecked ? "✓ " : "+ "}
                                  {candidate.name}
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Passing Score Configuration */}
                      <div className="mb-6 pb-6 border-b border-gray-800 flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-0.5">
                            Quiz Passing Score Threshold:
                          </label>
                          <p className="text-xs text-gray-400">
                            Minimum correct answers required to complete this topic and unlock dependencies
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min={1}
                            max={Math.max(1, topic.quizzes.length)}
                            value={topic.passingScore}
                            onChange={(e) =>
                              handlePassingScoreChange(topic.id, parseInt(e.target.value) || 1)
                            }
                            className="w-16 bg-gray-900 border border-gray-700 text-center text-sm font-bold rounded-lg py-1 text-white"
                          />
                          <span className="text-xs text-gray-400">of {topic.quizzes.length} Qs</span>
                        </div>
                      </div>

                      {/* Quiz Questions List */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center">
                            <HelpCircle className="w-4 h-4 mr-1 text-purple-400" />
                            Quiz Question Bank ({topic.quizzes.length})
                          </label>

                          <button
                            onClick={() => handleAddQuestion(topic.id)}
                            className="text-xs font-semibold px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 rounded-lg flex items-center transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Add Question
                          </button>
                        </div>

                        <div className="space-y-4">
                          {topic.quizzes.map((q, qIdx) => (
                            <div
                              key={q.id || qIdx}
                              className="p-4 bg-gray-900 rounded-xl border border-gray-800 space-y-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-bold text-gray-400">
                                  Question #{qIdx + 1}
                                </span>
                                <button
                                  onClick={() => handleDeleteQuestion(topic.id, qIdx)}
                                  className="text-xs text-red-400 hover:text-red-300 p-1 flex items-center"
                                  title="Delete question"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                                </button>
                              </div>

                              {/* Question prompt */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                  Question Text:
                                </label>
                                <input
                                  type="text"
                                  value={q.question}
                                  onChange={(e) =>
                                    handleUpdateQuestion(topic.id, qIdx, "question", e.target.value)
                                  }
                                  className="w-full bg-gray-950 border border-gray-700 text-xs sm:text-sm rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                              </div>

                              {/* Options */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                  Answer Choices (Select radio button for the correct answer):
                                </label>
                                <div className="space-y-2">
                                  {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-center space-x-2">
                                      <input
                                        type="radio"
                                        name={`correct_${topic.id}_${qIdx}`}
                                        checked={q.correctIndex === optIdx}
                                        onChange={() =>
                                          handleUpdateQuestion(topic.id, qIdx, "correctIndex", optIdx)
                                        }
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700"
                                        title="Mark as correct answer"
                                      />
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) =>
                                          handleUpdateOption(topic.id, qIdx, optIdx, e.target.value)
                                        }
                                        className={`flex-1 bg-gray-950 border text-xs rounded-lg p-2 text-white ${
                                          q.correctIndex === optIdx
                                            ? "border-emerald-500 text-emerald-200"
                                            : "border-gray-700"
                                        }`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Explanation */}
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                                  Explanation (shown to student after answering):
                                </label>
                                <input
                                  type="text"
                                  value={q.explanation}
                                  onChange={(e) =>
                                    handleUpdateQuestion(topic.id, qIdx, "explanation", e.target.value)
                                  }
                                  className="w-full bg-gray-950 border border-gray-700 text-xs rounded-lg p-2 text-gray-300"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">Reset Curriculum to Defaults?</h3>
              <p className="text-sm text-gray-300 mb-6">
                All custom question additions, topic reorderings, and prerequisite configurations will be restored to the built-in 14-topic default curriculum.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2 rounded-xl text-sm"
                >
                  Reset Defaults
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
