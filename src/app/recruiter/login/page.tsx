"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recruiter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed.");
      } else {
        router.push("/recruiter");
      }
    } catch {
      setError("Unable to communicate with authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/40 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-900 border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-2xl text-purple-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Recruiter Portal</h1>
              <p className="text-xs text-gray-400">Restricted Instructor & Hiring Dashboard</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center">
                <KeyRound className="w-3.5 h-3.5 mr-1 text-purple-400" />
                Recruiter Access Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access password..."
                autoFocus
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <p className="text-[11px] text-gray-500 mt-1.5">
                Default: <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded">Recruiter2026!</code> (configurable via RECRUITER_ACCESS_PASSWORD)
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all"
            >
              {loading ? "Authenticating..." : "Sign In to Recruiter Portal"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
