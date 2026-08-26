"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Chat } from "./ChatRoom";

function getInitials(username: string) {
 const name=username.slice(0,2);
 return name
}

export function ChatRoomClient({
  chats,
  roomId,
  username,
}: {
  chats: Chat[];
  roomId: number;
  username: string;
}) {
  const { ws, loading } = useSocket(roomId);
  const [message, setMessage] =
    useState<Chat[]>(chats);
  const [noOfUserInRoom, setNoOfUserInRoom] = useState(0);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ws && !loading) {
      ws.onmessage = (event) => {
        const message = event.data;
        const parsed = JSON.parse(message as unknown as string);
        if (parsed.type === "join-room") {
          const data = parsed.data as {
            noOfUserJoined: number;
            roomId: number;
          };
          setNoOfUserInRoom(data.noOfUserJoined);
        } else if (parsed.type === "chat") {
          const data = parsed.data as {
            message: string;
            roomId: number;
            username: string;
          };
          setMessage((prev) => [...prev, data]);
        } else if (parsed.type === "leave-room") {
          // do other stuff
        }
      };
    }
    return () => {
      if (ws) ws.onmessage = null;
    };
  }, [ws, loading]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  const handleMessage = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || !ws) return;

    const obj = {
      type: "chat",
      data: {
        roomId: roomId,
        message: trimmedText,
        username,
      },
    };
    const parsed = JSON.stringify(obj);

    setMessage((p) => [...p, obj.data]);
    ws.send(parsed);
    setText("");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef] p-4 text-[#20211e] sm:p-8">
      <section className="flex h-[min(680px,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#dedbd1] bg-white shadow-[0_24px_70px_rgba(32,33,30,0.12)] sm:h-[min(720px,calc(100vh-4rem))]">
        <header className="flex items-center justify-between border-b border-[#ece9e1] bg-[#20211e] px-5 py-4 text-white sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f8d84a]">
              Room chat
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">
              Chat Section
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white/80">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#9de28f]" />
            {noOfUserInRoom} {noOfUserInRoom === 1 ? "user" : "users"}
          </div>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto bg-[#fcfbf8] px-4 py-6 sm:px-7">
          {message.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-[#8a887f]">
              Start the conversation with a friendly hello.
            </div>
          ) : (
            message.map((mes, idx) => {
              const isCurrentUser = mes.username === username;

              return (
                <div
                  key={`${mes.username}-${idx}`}
                  className={`flex animate-[message-in_350ms_ease-out_both] items-end gap-3 ${
                    isCurrentUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8d84a] text-xs font-bold text-[#20211e] shadow-sm">
                    {getInitials(mes.username)}
                  </div>
                  <div
                    className={`max-w-[78%] ${isCurrentUser ? "items-end" : "items-start"}`}
                  >
                    <p
                      className={`mb-1 text-xs font-medium text-[#77756c] ${isCurrentUser ? "text-right" : ""}`}
                    >
                      {mes.username}
                    </p>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${isCurrentUser ? "rounded-br-sm bg-[#20211e] text-white" : "rounded-bl-sm border border-[#e8e5dc] bg-white text-[#3b3b36]"}`}
                    >
                      {mes.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleMessage}
          className="flex gap-3 border-t border-[#ece9e1] bg-white p-4 sm:p-5"
        >
          <input
            type="text"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-[#dedbd1] bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa79d] focus:border-[#20211e] focus:ring-2 focus:ring-[#f8d84a]/60"
          />
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="rounded-2xl bg-[#f8d84a] px-5 py-3 text-sm font-bold text-[#20211e] transition hover:-translate-y-0.5 hover:bg-[#f3ce2b] focus:outline-none focus:ring-2 focus:ring-[#20211e] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
