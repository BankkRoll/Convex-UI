"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useChatScroll } from "../hooks/use-chat-scroll";
import {
  useRealtimeChat,
  type ChatMessage as ChatMessageType,
} from "../hooks/use-realtime-chat";
import { ChatMessage } from "./chat-message";

interface RealtimeChatProps {
  roomName: string;
  username: string;
  className?: string;
}

export function RealtimeChat({
  roomName,
  username,
  className,
}: RealtimeChatProps) {
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, isConnected } = useRealtimeChat({
    roomName,
    username,
  });
  const { containerRef, scrollToBottom, handleScroll, shouldAutoScroll } =
    useChatScroll();

  useEffect(() => {
    if (shouldAutoScroll()) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, shouldAutoScroll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await sendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <Card className={`flex flex-col h-full ${className ?? ""}`}>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 border-b">
        <CardTitle className="text-lg">{roomName}</CardTitle>
        <Badge
          variant={isConnected ? "default" : "destructive"}
          className="gap-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </CardHeader>

      <CardContent
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-y-auto flex-1 space-y-4 p-4 bg-muted/20"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.user.name === username}
            />
          ))
        )}
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!isConnected || !inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
