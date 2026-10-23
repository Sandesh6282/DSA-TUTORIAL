"use client";
import React from "react";
import { CheckCircle2, Clock, Trophy, Flame } from "lucide-react";

interface ProgressTrackerProps {
  topic: string;
  isCompleted?: boolean;
  score?: number;
  total?: number;
  overallCompleted?: number;
  totalTopics?: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  topic,
  isCompleted = false,
  score,
  total,
  overallCompleted = 1,
  totalTopics = 14
}) => {
  const percent = Math.round((overallCompleted / Math.max(1, totalTopics)) * 100);

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl text-white shadow-xl my-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold">Topic Progress: {topic}</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {isCompleted
              ? "✓ Topic completed! Quiz requirement fulfilled."
              : "Complete the quiz above to mark this topic as completed and unlock next modules."}
          </p>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          {/* Status badge */}
          <div>
            <span className="block text-xs text-gray-400 mb-0.5">Status</span>
            {isCompleted ? (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                <Clock className="w-3.5 h-3.5 mr-1" /> In Progress
              </span>
            )}
          </div>

          {/* Quiz Score if attempted */}
          {score !== undefined && total !== undefined && (
            <div>
              <span className="block text-xs text-gray-400 mb-0.5">Quiz Score</span>
              <span className="font-bold text-white">
                {score} / {total}
              </span>
            </div>
          )}

          {/* Overall Curriculum progress */}
          <div>
            <span className="block text-xs text-gray-400 mb-0.5 flex items-center">
              <Flame className="w-3 h-3 text-orange-400 mr-1" /> Roadmap
            </span>
            <span className="font-bold text-blue-400">
              {overallCompleted} of {totalTopics} ({percent}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
