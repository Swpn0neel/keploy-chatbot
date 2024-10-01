"use client";

import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const res = await fetch("/api/sendChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: input }), // Send user input as the question
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMsg = { text: `Error: ${errorData.error}`, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, errorMsg]);
        return;
      }

      const data = await res.json();
      const botMessage = { text: data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMsg = {
        text: "Error communicating with the chatbot",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
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
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
