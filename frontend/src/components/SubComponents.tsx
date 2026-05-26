import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { Icons } from "@/lib/svg";

export function TypingDots() {
    return (
      <div className="flex items-center gap-1 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
          />
        ))}
      </div>
    );
  }
   
  export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "user";
   
    return (
      <div className={cn("flex items-end gap-2.5 px-4 max-w-3xl w-full mx-auto", isUser ? "flex-row-reverse" : "flex-row")}>
        {!isUser && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center mb-0.5">
            <Icons.Bot />
          </div>
        )}
        <div
          className={cn(
            "max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-zinc-900 text-white rounded-br-sm"
              : "bg-zinc-100 text-zinc-800 rounded-bl-sm"
          )}
        >
          {message.content}
        </div>
      </div>
    );
  }