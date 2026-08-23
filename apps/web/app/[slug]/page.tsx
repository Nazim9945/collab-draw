"use client";

export interface Message {
  id: number | string;
  text: string;
  sender: "me" | "other";
  createdAt?: string;
}

import { useEffect, useRef, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { apiInstance } from "../../config";


const FALLBACK_MESSAGES: Message[] = [
  { id: 1, text: "Hey, is this room available for tomorrow?", sender: "other" },
  { id: 2, text: "Yes it is, want me to book it?", sender: "me" },
];

export default function ChatSection({params}:{
params:Promise<{
    slug:string
}>
}) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // scroll to bottom whenever a new message comes in
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await apiInstance.get<Message[]>(`/chats`);
      setMessages(res.data);
    } catch (err) {
      console.log("messages api failed, using fallback", err);
      setMessages(FALLBACK_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "me",
    };

    // add it right away so it doesnt feel laggy, fix later if api fails
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setSending(true);
  };

  return (
    <div className="flex flex-col h-112 bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {loading ? (
          <p className="text-xs text-gray-400">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-gray-400">No messages yet, say hi.</p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "me"
                    ? "bg-blue-600 text-white self-end rounded-br-none"
                    : "bg-gray-100 text-gray-800 self-start rounded-bl-none"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-200 px-3 py-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
