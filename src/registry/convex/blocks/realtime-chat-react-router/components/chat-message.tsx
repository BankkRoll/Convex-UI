import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    user: {
      name: string;
    };
    createdAt: string;
  };
  isOwnMessage?: boolean;
}

export function ChatMessage({
  message,
  isOwnMessage = false,
}: ChatMessageProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 max-w-[75%] animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isOwnMessage ? "ml-auto items-end" : "mr-auto items-start",
      )}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <span className="font-semibold">{message.user.name}</span>
        <span className="opacity-60">{formattedTime}</span>
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm shadow-sm border transition-all",
          isOwnMessage
            ? "bg-primary text-primary-foreground border-primary/20"
            : "bg-card text-card-foreground border-border",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
