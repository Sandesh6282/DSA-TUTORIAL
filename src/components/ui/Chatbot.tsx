"use client";
import React, { useState } from "react";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatbotProps {
  topic: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ topic }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userQuestion = input.trim();
    const userMessage = { sender: "You", text: userQuestion };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const botResponse = await getBotResponse(userQuestion, topic);
      setMessages((prev) => [...prev, { sender: "AI Tutor", text: botResponse }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "AI Tutor", text: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getBotResponse = async (question: string, topic: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, topic }),
      });

      const data = await response.json();
      return (
        data.reply ||
        data.error ||
        "I'm here to help! Can you rephrase your question?"
      );
    } catch (error) {
      console.error("Error with chat API:", error);
      return "Sorry, there was an issue getting an answer.";
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-center mb-3">Chat with AI Tutor</h2>
      <div className="h-96 overflow-y-auto border border-gray-700 p-3 rounded-md">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">Ask me anything about {topic}!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 ${
                msg.sender === "You" ? "text-blue-400" : "text-green-400"
              }`}
            >
              <strong>{msg.sender}:</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
            </div>
          ))
        )}
        {loading && <p className="text-gray-400 text-center">Thinking...</p>}
      </div>
      <div className="flex items-center mt-3">
        <Input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-md"
        />
        <Button onClick={handleSend} className="ml-2" disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

// Function to format AI responses (code blocks, newlines)
const formatMessage = (text: string) => {
  return text
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-900 p-2 rounded-md"><code>$1</code></pre>'
    ) // Code blocks
    .replace(/\n/g, "<br />"); // Preserve newlines
};

export default Chatbot;
