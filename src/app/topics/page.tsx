"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowLeft,
  Shield,
  Layers,
  Award,
  AlertCircle,
  X
} from "lucide-react";
import { loadStudentProgress, resetStudentProgress, isTopicUnlocked, isTopicCompleted, StudentProgress } from "@/lib/studentProgress";
import { TopicConfig, DEFAULT_TOPICS } from "@/lib/topics";

export default function TopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<TopicConfig[]>(DEFAULT_TOPICS);
  const [progress, setProgress] = useState<StudentProgress>(loadStudentProgress());
  const [filter, setFilter] = useState<"all" | "available" | "completed" | "locked">("all");
  const [lockedModalTopic, setLockedModalTopic] = useState<{ topic: TopicConfig; missing: string[] } | null>(null);
  const [isRecruiter, setIsRecruiter] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Load custom recruiter curriculum from API if available
  useEffect(() => {
    fetch("/api/recruiter/config")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.topics) && data.topics.length > 0) {
          setTopics(data.topics.filter((t: TopicConfig) => t.enabled));
        }
      })
      .catch(() => {});

    // Check recruiter session
    fetch("/api/recruiter/session")
      .then((res) => res.json())
      .then((data) => {
        setIsRecruiter(!!data.authenticated);
      })
      .catch(() => {});

    setProgress(loadStudentProgress());
  }, []);

  const handleTopicClick = (topic: TopicConfig) => {
    // If recruiter, allow opening any topic regardless of progression
    if (isRecruiter) {
      router.push(`/topics/${topic.id}`);
      return;
    }

    const { unlocked, missingPrereqs } = isTopicUnlocked(topic.id, topics, progress);
    if (!unlocked) {
      const missingNames = missingPrereqs.map((id) => {
        const found = topics.find((t) => t.id === id);
        return found ? found.name : id;
      });
      setLockedModalTopic({ topic, missing: missingNames });
      return;
    }

    router.push(`/topics/${topic.id}`);
  };

  const handleResetProgress = () => {
    const fresh = resetStudentProgress();
    setProgress(fresh);
    setShowResetConfirm(false);
  };

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    const isComp = isTopicCompleted(t.id, progress);
    const { unlocked } = isTopicUnlocked(t.id, topics, progress);

    if (filter === "completed") return isComp;
    if (filter === "available") return (unlocked || isRecruiter) && !isComp;
    if (filter === "locked") return !unlocked && !isRecruiter;
    return true;
  });

  const completedCount = topics.filter((t) => isTopicCompleted(t.id, progress)).length;
  const percentComplete = Math.round((completedCount / Math.max(1, topics.length)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white p-4 sm:p-8">
      {/* Top Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Mode Selection
        </Link>

        {isRecruiter && (
          <div className="flex items-center space-x-3 bg-purple-950/60 border border-purple-800/80 px-4 py-1.5 rounded-full text-xs text-purple-300">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Recruiter Preview Mode (All topics unlocked)</span>
            <Link
              href="/recruiter"
              className="font-bold underline text-purple-200 hover:text-white ml-2"
            >
              Curriculum Dashboard →
            </Link>
          </div>
        )}

        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-gray-500 hover:text-gray-300 flex items-center transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Student Progress
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title and Progress Card */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>DSA Structured Roadmap</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">DSA Curriculum</h1>
              <p className="text-gray-400 text-sm mt-1 max-w-xl">
                Master core data structures and algorithms in order. Pass each topic&apos;s knowledge check to unlock advanced modules.
              </p>
            </div>

            {/* Overall Progress Gauge */}
            <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl min-w-[220px]">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-2">
                <span>Curriculum Mastery</span>
                <span className="text-blue-400 font-bold">{percentComplete}%</span>
              </div>
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-500 flex justify-between">
                <span>{completedCount} Completed</span>
                <span>{topics.length - completedCount} Remaining</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/80">
            <span className="text-xs text-gray-400 mr-2 font-medium">Filter:</span>
            {[
              { id: "all", label: `All (${topics.length})` },
              { id: "available", label: "Available / In Progress" },
              { id: "completed", label: `Completed (${completedCount})` },
              { id: "locked", label: `Locked (${Math.max(0, topics.length - completedCount - 1)})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTopics.map((topic, index) => {
            const isComp = isTopicCompleted(topic.id, progress);
            const { unlocked } = isTopicUnlocked(topic.id, topics, progress);
            const effectiveUnlocked = unlocked || isRecruiter;
            const details = progress.topicDetails[topic.id];

            return (
              <motion.div
                key={topic.id}
                whileHover={effectiveUnlocked ? { scale: 1.02, y: -2 } : {}}
                whileTap={effectiveUnlocked ? { scale: 0.98 } : {}}
                onClick={() => handleTopicClick(topic)}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[190px] shadow-lg ${
                  isComp
                    ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400/80"
                    : effectiveUnlocked
                    ? "bg-gray-900/90 border-blue-500/40 hover:border-blue-400 hover:shadow-blue-500/10"
                    : "bg-gray-950/60 border-gray-800/80 opacity-60 hover:opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 font-mono">
                      #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>

                    {/* Status Badge */}
                    {isComp ? (
                      <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                      </span>
                    ) : effectiveUnlocked ? (
                      <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                        <Play className="w-3 h-3 mr-1 fill-current" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                        <Lock className="w-3 h-3 mr-1" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {topic.name}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-500">
                  {isComp ? (
                    <span className="text-emerald-400 font-medium flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1" />
                      Score: {details?.quizScore ?? 1}/{details?.quizTotal ?? 1}
                    </span>
                  ) : effectiveUnlocked ? (
                    <span className="text-blue-400 font-medium group-hover:underline">
                      Enter Lesson →
                    </span>
                  ) : (
                    <span className="text-gray-500 italic text-[11px]">
                      Requires: {topic.prerequisites.join(", ") || "Prior topic"}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Locked Topic Informational Modal */}
      <AnimatePresence>
        {lockedModalTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setLockedModalTopic(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{lockedModalTopic.topic.name} is Locked</h3>
                  <p className="text-xs text-gray-400">Prerequisite completion required</p>
                </div>
              </div>

              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-sm mb-6">
                <p className="text-gray-300 mb-2">
                  To unlock <strong className="text-white">{lockedModalTopic.topic.name}</strong>, you must first complete the following prerequisite module(s):
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-amber-300 font-semibold text-xs">
                  {lockedModalTopic.missing.map((reqName) => (
                    <li key={reqName}>{reqName} (pass topic quiz)</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setLockedModalTopic(null)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-2 rounded-xl text-sm font-medium"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Progress Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Reset Student Progress?</h3>
                  <p className="text-xs text-gray-400">This action will reset your roadmap</p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-6">
                All quiz scores and completed topic checkmarks stored in your browser will be reset back to the beginning with only Arrays unlocked.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2 rounded-xl text-sm"
                >
                  Reset Progress
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
