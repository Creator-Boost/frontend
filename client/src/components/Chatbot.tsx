import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatIconRef = useRef<HTMLImageElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ sender: "bot", text: "Hello! How can I help you today? 😊" }]);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    const icon = chatIconRef.current;
    if (icon && !isOpen) {
      const interval = setInterval(() => {
        icon.style.transform = "translateY(-8px)";
        setTimeout(() => { if (icon) icon.style.transform = "translateY(0)"; }, 500);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8088/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: input }),
      });
      const data = await res.json();
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: data.answer }]);
        setIsTyping(false);
      }, 1000);
    } catch {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Error connecting to server." }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <div className="fixed bottom-12 right-16 z-50">
          <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
            <img
              ref={chatIconRef}
              src="/chatbot.png"
              alt="Chatbot"
              className="w-28 h-28 transition-transform duration-500"
            />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-black text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md whitespace-nowrap pointer-events-none">
              💬 Need help? Chat with me!
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 w-[28rem] h-[32rem] bg-white border rounded-xl shadow-lg flex flex-col z-50 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 flex justify-between items-center rounded-t-xl">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
              <span className="font-semibold">Chatbot Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-300 transition-colors duration-200"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 flex flex-col">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-xs transition-all duration-300 transform ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto text-right animate-message-sent"
                    : "bg-blue-50 text-blue-900 border border-blue-200 mr-auto text-left animate-message-received"
                }`}
                style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.08)" }}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="p-2 rounded-2xl max-w-xs bg-blue-50 border border-blue-200 text-blue-800 self-start mr-auto animate-message-received flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 flex space-x-2 border-t bg-white rounded-b-xl">
            <input
              type="text"
              className="flex-1 border border-blue-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-gray-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp { from {opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }
          @keyframes messageSent { from {opacity:0; transform:translateX(20px) scale(0.9);} to {opacity:1; transform:translateX(0) scale(1);} }
          @keyframes messageReceived { from {opacity:0; transform:translateX(-20px) scale(0.9);} to {opacity:1; transform:translateX(0) scale(1);} }
          .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
          .animate-message-sent { animation: messageSent 0.3s ease-out; }
          .animate-message-received { animation: messageReceived 0.3s ease-out; }
        `}
      </style>
    </div>
  );
}
