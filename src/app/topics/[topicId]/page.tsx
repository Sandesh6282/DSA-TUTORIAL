"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Lock, Sparkles, AlertTriangle } from "lucide-react";
import CodeEditor from "@/components/ui/CodeEditor";
import Quiz from "@/components/ui/Quiz";
import Chatbot from "@/components/ui/Chatbot";
import ProgressTracker from "@/components/ui/ProgressTracker";
import {
  loadStudentProgress,
  isTopicUnlocked,
  isTopicCompleted,
  recordQuizCompletion,
  StudentProgress
} from "@/lib/studentProgress";
import { DEFAULT_TOPICS, TopicConfig, getTopicById } from "@/lib/topics";

export default function TopicLessonPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = use(params);
  const topicId = resolvedParams.topicId;

  const [topic, setTopic] = useState<TopicConfig | undefined>(undefined);
  const [topicsList, setTopicsList] = useState<TopicConfig[]>(DEFAULT_TOPICS);
  const [progress, setProgress] = useState<StudentProgress>(loadStudentProgress());
  const [isRecruiter, setIsRecruiter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newlyUnlockedTopics, setNewlyUnlockedTopics] = useState<string[]>([]);

  useEffect(() => {
    // 1. Load active curriculum from server
    fetch("/api/recruiter/config")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.topics) && data.topics.length > 0) {
          setTopicsList(data.topics);
          const found = data.topics.find((t: TopicConfig) => t.id === topicId);
          setTopic(found || getTopicById(topicId));
        } else {
          setTopic(getTopicById(topicId));
        }
      })
      .catch(() => {
        setTopic(getTopicById(topicId));
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 2. Check recruiter auth
    fetch("/api/recruiter/session")
      .then((res) => res.json())
      .then((data) => {
        setIsRecruiter(!!data.authenticated);
      })
      .catch(() => {});

    // 3. Load student progress
    setProgress(loadStudentProgress());
  }, [topicId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="flex items-center space-x-3 text-blue-400">
          <svg className="animate-spin h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="font-semibold text-lg">Loading lesson...</span>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-xl">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Topic Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">
            The topic identifier &apos;{topicId}&apos; does not exist in the curriculum roadmap.
          </p>
          <Link
            href="/topics"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors"
          >
            ← Return to Roadmap
          </Link>
        </div>
      </div>
    );
  }

  // Check locking state
  const { unlocked, missingPrereqs } = isTopicUnlocked(topic.id, topicsList, progress);
  const canAccess = unlocked || isRecruiter;

  if (!canAccess) {
    const missingNames = missingPrereqs.map((id) => {
      const found = topicsList.find((t) => t.id === id);
      return found ? found.name : id;
    });

    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-lg text-center bg-gray-900 p-8 rounded-3xl border border-amber-500/40 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold mb-2">{topic.name} is Locked</h2>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            In Learning Mode, topics must be completed in order. Direct URL navigation cannot bypass prerequisites.
          </p>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-left mb-6 text-xs">
            <span className="font-semibold text-gray-400 block mb-2">Prerequisites required:</span>
            <ul className="list-disc list-inside space-y-1 text-amber-300 font-medium">
              {missingNames.map((name) => (
                <li key={name}>{name} (pass topic quiz)</li>
              ))}
            </ul>
          </div>

          <Link
            href="/topics"
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            ← View Available Topics
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = isTopicCompleted(topic.id, progress);
  const detail = progress.topicDetails[topic.id];

  const handleQuizCompleted = (score: number, total: number) => {
    const result = recordQuizCompletion(topic.id, score, total, topic.passingScore, progress);
    setProgress(result.updatedProgress);

    if (result.newlyUnlocked.length > 0) {
      setNewlyUnlockedTopics(result.newlyUnlocked);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      {/* Navigation Top Bar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <Link
          href="/topics"
          className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Topics Roadmap
        </Link>

        {isRecruiter && (
          <span className="text-xs bg-purple-950 border border-purple-800 text-purple-300 px-3 py-1 rounded-full font-semibold">
            Recruiter Mode Active
          </span>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Celebration Notification when newly unlocked */}
        <AnimatePresence>
          {newlyUnlockedTopics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-gray-900 border border-emerald-500/50 shadow-2xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Congratulations! Topics Unlocked!</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    You mastered {topic.name}! You can now access: <strong>{newlyUnlockedTopics.join(", ")}</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNewlyUnlockedTopics([])}
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded-lg bg-gray-800"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Interactive DSA Masterclass</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            {topic.name}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed">
            {topic.summary}
          </p>
        </motion.div>

        {/* Concept Deep Dive Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gray-800/90 border border-gray-700/80 p-6 sm:p-8 rounded-2xl shadow-xl mb-8 leading-relaxed"
        >
          <h2 className="text-xl font-bold text-white mb-3 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2.5"></span>
            Understanding {topic.name}
          </h2>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            {topic.explanation}
          </p>

          {/* Core Operations & Complexity Table */}
          {topic.operations && topic.operations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-700/60">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
                Core Operations &amp; Complexity
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th className="py-2 pr-4 font-semibold">Operation</th>
                      <th className="py-2 px-4 font-semibold">Time Complexity</th>
                      <th className="py-2 px-4 font-semibold">Space</th>
                      <th className="py-2 pl-4 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-200">
                    {topic.operations.map((op, i) => (
                      <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                        <td className="py-2.5 pr-4 font-medium text-white">{op.name}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">{op.timeComplexity}</td>
                        <td className="py-2.5 px-4 font-mono text-gray-400">{op.spaceComplexity}</td>
                        <td className="py-2.5 pl-4 text-gray-300 text-xs">{op.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Interactive Multi-Language Code Editor */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white">Hands-on Code Laboratory</h2>
              <p className="text-xs text-gray-400">
                Write, modify, and execute {topic.name} algorithms directly in your browser with real online compilation.
              </p>
            </div>
          </div>

          <CodeEditor
            topicId={topic.id}
            topicStarterCodes={topic.starterCode}
          />
        </section>

        {/* Knowledge Quiz Section */}
        <section className="mt-10">
          <Quiz
            topic={topic.name}
            topicId={topic.id}
            questions={topic.quizzes}
            passingScore={topic.passingScore}
            onQuizCompleted={handleQuizCompleted}
          />
        </section>

        {/* AI Tutor Chatbot Section */}
        <section className="mt-10">
          <div className="mb-4 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">Need Guidance? Ask the AI DSA Tutor!</h2>
            <p className="text-xs text-gray-400">
              Powered by Google Gemini. Ask for conceptual clarifications, code debugging, or edge case analysis for {topic.name}.
            </p>
          </div>
          <Chatbot topic={topic.name} />
        </section>

        {/* Progress Tracker Section */}
        <section className="mt-10 mb-12">
          <ProgressTracker
            topic={topic.name}
            isCompleted={isCompleted}
            score={detail?.quizScore}
            total={detail?.quizTotal ?? topic.quizzes.length}
            overallCompleted={progress.completedTopics.length}
            totalTopics={topicsList.length}
          />
        </section>
      </div>
    </div>
  );
}
