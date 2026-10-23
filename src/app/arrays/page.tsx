"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArraysPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/topics/arrays");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="flex items-center space-x-3 text-blue-400">
        <svg className="animate-spin h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Navigating to Arrays Lesson...</span>
      </div>
    </div>
  );
}
