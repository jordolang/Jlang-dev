"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";

interface Message {
  id: string;
  sender: "client" | "jordan";
  senderName: string;
  content: string;
  timestamp: string;
  read?: boolean;
}

interface MessageThreadProps {
  messages: Message[];
  clientName?: string;
}

/**
 * Message thread component for displaying conversation between client and Jordan.
 * Shows message bubbles with sender info, timestamps, and read status.
 */
export default function MessageThread({ messages, clientName = "Client" }: MessageThreadProps) {
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900"
          role="status"
        >
          <Icon icon="mdi:message-outline" width={64} height={64} className="mx-auto mb-4 text-gray-400" aria-hidden="true" />
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No Messages Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start a conversation with Jordan to discuss your project
          </p>
        </m.div>
      ) : (
        <div className="space-y-4">
          {/* Render messages with map to display each sender's message */}
          {messages.map((message, index) => {
            const isJordan = message.sender === "jordan";
            const isClient = message.sender === "client";

            return (
              <m.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`flex ${isJordan ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex max-w-[80%] gap-3 ${isJordan ? "flex-row" : "flex-row-reverse"}`}>
                  {/* Avatar */}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      isJordan
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                        : "bg-gradient-to-br from-blue-500 to-cyan-500"
                    } shadow-lg`}
                    aria-hidden="true"
                  >
                    <Icon
                      icon={isJordan ? "mdi:account-tie" : "mdi:account"}
                      width={20}
                      height={20}
                      className="text-white"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Message bubble */}
                  <div className={`flex flex-col ${isJordan ? "items-start" : "items-end"}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isJordan ? "text-indigo-600 dark:text-indigo-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {message.senderName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {isClient && message.read && (
                        <Icon icon="mdi:check-all" width={16} height={16} className="text-blue-600 dark:text-blue-400" aria-label="Read" />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-md ${
                        isJordan
                          ? "rounded-tl-none bg-white dark:bg-gray-800"
                          : "rounded-tr-none bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                      }`}
                    >
                      <p className={`leading-relaxed ${isJordan ? "text-gray-700 dark:text-gray-300" : "text-white"}`}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
