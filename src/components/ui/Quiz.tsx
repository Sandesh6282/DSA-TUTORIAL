"use client";
import React, { useState } from "react";
import { QuizQuestion } from "@/lib/topics";
import { CheckCircle2, XCircle, Award, RotateCcw, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizProps {
  topic: string;
  topicId?: string;
  questions?: QuizQuestion[];
  passingScore?: number;
  onQuizCompleted?: (score: number, total: number, passed: boolean) => void;
}

export const Quiz: React.FC<QuizProps> = ({
  topic,
  questions = [
    {
      id: "default-1",
      question: "What is the time complexity of accessing an element in an array?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
      correctIndex: 1,
      explanation: "Arrays are contiguous in memory, so Base + (Index * Size) allows instant O(1) random access."
    },
    {
      id: "default-2",
      question: "Which data structure dynamically allocates memory nodes linked by pointers?",
      options: ["Array", "Linked List", "Stack", "Queue"],
      correctIndex: 1,
      explanation: "Linked lists allocate individual nodes dynamically on the heap anywhere in memory."
    }
  ],
  passingScore = 1,
  onQuizCompleted
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<boolean>(false);
  const [answersRecord, setAnswersRecord] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQ = questions[currentIdx] || questions[0];
  const isLastQuestion = currentIdx === questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (submittedAnswer) return; // Locked once confirmed
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setSubmittedAnswer(true);

    const updatedRecords = [...answersRecord, selectedOption];
    setAnswersRecord(updatedRecords);

    // If it's the last question and user confirmed
    if (isLastQuestion) {
      const passed = newScore >= passingScore;
      if (onQuizCompleted) {
        onQuizCompleted(newScore, questions.length, passed);
      }
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setSubmittedAnswer(false);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setSubmittedAnswer(false);
    setAnswersRecord([]);
    setScore(0);
    setShowResult(false);
  };

  const passed = score >= passingScore;

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl text-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold">Knowledge Check: {topic}</h2>
        </div>

        {!showResult && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-800 rounded-full text-gray-400">
            Question {currentIdx + 1} of {questions.length}
          </span>
        )}
      </div>

      {showResult ? (
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            {passed ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Award className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <XCircle className="w-8 h-8" />
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold mb-2">
            {passed ? "Topic Mastery Achieved! 🎉" : "Keep Practicing! 💪"}
          </h3>

          <p className="text-gray-300 mb-4">
            You scored <strong className="text-white text-lg">{score}</strong> out of{" "}
            <strong className="text-white text-lg">{questions.length}</strong>
            {" "}(Passing requirement: {passingScore}/{questions.length})
          </p>

          {passed ? (
            <p className="text-sm text-emerald-400 mb-6 bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/60 max-w-md mx-auto">
              ✓ Excellent job! This topic is marked completed and dependent roadmap topics have unlocked.
            </p>
          ) : (
            <p className="text-sm text-amber-400 mb-6 bg-amber-950/40 p-3 rounded-lg border border-amber-800/60 max-w-md mx-auto">
              Review the lesson materials and code examples above, then give it another try to unlock the next topic.
            </p>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleRetryQuiz}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-5 py-2 rounded-lg flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Quiz Again
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-lg font-medium text-gray-100 mb-4">{currentQ.question}</p>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectAnswer = index === currentQ.correctIndex;

              let buttonStyle = "bg-gray-800/80 hover:bg-gray-700 border-gray-700 text-gray-200";

              if (submittedAnswer) {
                if (isCorrectAnswer) {
                  buttonStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = "bg-red-950/80 border-red-500 text-red-200";
                } else {
                  buttonStyle = "bg-gray-800/40 border-gray-800 text-gray-500 opacity-60";
                }
              } else if (isSelected) {
                buttonStyle = "bg-blue-600 border-blue-400 text-white font-semibold shadow-lg shadow-blue-500/20";
              }

              return (
                <button
                  key={index}
                  disabled={submittedAnswer}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${buttonStyle}`}
                  onClick={() => handleSelectOption(index)}
                >
                  <span className="flex items-center">
                    <span className="w-6 h-6 rounded-full border border-current text-xs flex items-center justify-center mr-3 font-mono">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>

                  {submittedAnswer && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {submittedAnswer && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal */}
          {submittedAnswer && (
            <div
              className={`p-4 rounded-xl mb-6 text-sm border ${
                selectedOption === currentQ.correctIndex
                  ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-200"
                  : "bg-red-950/30 border-red-800/80 text-red-200"
              }`}
            >
              <strong className="block mb-1">
                {selectedOption === currentQ.correctIndex ? "Correct Answer! ✓" : "Incorrect! ✗"}
              </strong>
              <p className="text-gray-300">{currentQ.explanation}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {!submittedAnswer ? (
              <Button
                disabled={selectedOption === null}
                onClick={handleConfirmAnswer}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2 rounded-lg flex items-center"
              >
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;