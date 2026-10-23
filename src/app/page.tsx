"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, BookOpen, PlayCircle, Lock, ShieldCheck, GraduationCap, ArrowRight, Sparkles, X } from "lucide-react";
import { loadStudentProgress, StudentProgress } from "@/lib/studentProgress";
import { DEFAULT_TOPICS } from "@/lib/topics";

export default function HomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isRecruiterAuth, setIsRecruiterAuth] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    // Load student progress from localStorage
    const saved = loadStudentProgress();
    setProgress(saved);

    // Check if current session has recruiter privileges
    fetch("/api/recruiter/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsRecruiterAuth(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleRecruiterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/recruiter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Authentication failed.");
      } else {
        setIsRecruiterAuth(true);
        setShowLoginModal(false);
        router.push("/recruiter");
      }
    } catch {
      setLoginError("Could not reach authentication service.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const completedCount = progress?.completedTopics.length || 0;
  const totalTopics = DEFAULT_TOPICS.length;
  const percentComplete = Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white p-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Title */}
      <motion.div
        className="text-center z-10 max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI-Powered Learning Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
          Welcome to DSA AI Tutor
        </h1>

        <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your personal AI-powered Data Structures & Algorithms learning assistant. Master core structures with in-browser code execution, interactive quizzes, and 24/7 AI tutoring.
        </p>
      </motion.div>

      {/* Mode Selection Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 mb-10"
      >
        {/* Card A: Learning Mode */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
          <Card className="h-full p-6 bg-gradient-to-b from-gray-900 to-gray-900/90 border border-blue-500/30 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/60 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Student Mode
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Learning Mode</h2>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Step-by-step sequential DSA curriculum starting with Arrays. Solve coding problems, pass knowledge checks, and unlock advanced algorithms at your own pace.
              </p>

              {/* Progress Summary if student has progress */}
              {completedCount > 0 && (
                <div className="mb-4 p-3 bg-gray-800/80 rounded-xl border border-gray-700/60 text-xs">
                  <div className="flex justify-between text-gray-300 mb-1 font-medium">
                    <span>Curriculum Progress</span>
                    <span className="text-blue-400 font-bold">{percentComplete}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentComplete}%` }} />
                  </div>
                  <div className="mt-1 text-[11px] text-gray-400">
                    {completedCount} of {totalTopics} topics mastered
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => router.push("/topics")}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center group"
            >
              <span>{completedCount > 0 ? "Continue Learning" : "Start Learning Mode"}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </motion.div>

        {/* Card B: Recruiter Mode */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
          <Card className="h-full p-6 bg-gradient-to-b from-gray-900 to-gray-900/90 border border-purple-500/30 rounded-2xl shadow-xl flex flex-col justify-between hover:border-purple-500/60 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 flex items-center">
                  <Lock className="w-3 h-3 mr-1" /> Restricted
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Recruiter Mode</h2>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Instructor & Hiring Portal. Full unrestricted access to all 14 DSA topics. Reorder the curriculum, toggle topics, customize quiz questions, and configure unlock prerequisites.
              </p>

              <div className="mb-4 p-3 bg-purple-950/20 rounded-xl border border-purple-900/40 text-xs text-purple-200">
                <span className="font-semibold block mb-0.5">Recruiter Privileges:</span>
                • Unrestricted access to all lessons & solutions<br />
                • Live curriculum editor & quiz question manager<br />
                • Student preview mode & instant reset
              </div>
            </div>

            {isRecruiterAuth ? (
              <Button
                onClick={() => router.push("/recruiter")}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center group"
              >
                <span>Enter Recruiter Portal</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-xl border border-purple-500/30 hover:border-purple-500/60 shadow flex items-center justify-center group"
              >
                <Lock className="w-4 h-4 mr-2 text-purple-400" />
                <span>Recruiter Access</span>
              </Button>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Feature Icons Row (Preserved from original design) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center space-x-6 z-10"
      >
        <motion.div whileHover={{ scale: 1.15, rotate: 8 }} className="p-3.5 bg-yellow-500/20 border border-yellow-500/40 rounded-full shadow-lg text-yellow-400" title="Gamified Progress">
          <Trophy className="w-6 h-6" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.15, rotate: -8 }} className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full shadow-lg text-emerald-400" title="Curated Lessons">
          <BookOpen className="w-6 h-6" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.15, rotate: 8 }} className="p-3.5 bg-red-500/20 border border-red-500/40 rounded-full shadow-lg text-red-400" title="Interactive Editor">
          <PlayCircle className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Recruiter Login Dialog Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-purple-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Recruiter Authentication</h3>
                  <p className="text-xs text-gray-400">Restricted access for hiring & curriculum managers</p>
                </div>
              </div>

              <form onSubmit={handleRecruiterLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Recruiter Access Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter recruiter password..."
                    autoFocus
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Default: <code className="text-purple-300">Recruiter2026!</code> (configurable via RECRUITER_ACCESS_PASSWORD)
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
                    {loginError}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setLoginError("");
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-2 rounded-xl text-sm"
                  >
                    {isLoggingIn ? "Verifying..." : "Authenticate"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
