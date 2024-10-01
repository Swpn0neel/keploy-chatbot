"use client";

import React, { useState, useCallback } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const apiRes = await fetch(
        "https://keploy-api.abhishekkushwaha.me/chat",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: input }),
        }
      );

      if (!apiRes.ok) {
        throw new Error(`HTTP error! status: ${apiRes.status}`);
      }

      const { answer } = await apiRes.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: answer, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching response from Keploy API", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, there was an error processing your request.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  }, [input, isLoading]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );
  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">Bot is typing...</div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
