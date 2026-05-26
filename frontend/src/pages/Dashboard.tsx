"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INITIAL_CONVERSATIONS, MOCK_USER } from "@/constants";
import type { Conversation, Message } from "@/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { uid, clamp } from "@/lib/utils";
import { MessageRole } from "@/types";
import Sidebar from "@/components/Sidebar";
import { Icons } from "@/lib/svg";
import { MessageBubble } from "@/components/SubComponents";
import { TypingDots } from "@/components/SubComponents";
import { createClient } from "@/lib/client";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function ChatInterface() {
    const [user, setUser] = useState<User | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const activeConvo = conversations.find((c) => c.id === activeId) ?? null;

    // console.log("userID",user?.id);
    console.log("UID",uid());

    useEffect(() => {
        async function getUser() {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error(error);
            }
            setUser(data.user);
        }
        getUser();
    }, []);

    useEffect(() => {

        async function getConversations() {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) {
                console.error("No token");
                return;
            }
            const response = await fetch("http://localhost:3001/conversations", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }) as Response;
            if (!response.ok) {
                console.error(response.statusText);
            }
            const data = await response.json();
            setConversations(data as Conversation[]);
        }
        if (user) {
            getConversations();
        }
    }, [user]);


    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }, [input]);

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConvo?.messages.length, isTyping]);

    const handleNew = useCallback(() => {
        setActiveId(null);
        setInput("");
    }, []);

    const handleDelete = useCallback((id: string) => {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        setActiveId((prev) => (prev === id ? null : prev));
    }, []);

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || isTyping) return;
        setInput("");

        let cid = activeId;

        // Create new conversation if none active
        if (!cid) {
            const newConvo: Conversation = {
                title: clamp(text, 42),
                messages: [],
                slug: text.toLowerCase().replace(/ /g, "-"),
                userId: user!.id,
            };

            
            
            setConversations((prev) => [newConvo, ...prev]);
            cid = newConvo.id!;
            setActiveId(cid);
        }

        const userMsg: Message = {
            id: uid(),
            role: MessageRole.User,
            content: text,
            createdAt: new Date(),
        };

        setConversations((prev) =>
            prev.map((c) => (c.id === cid ? { ...c, messages: [...c.messages, userMsg] } : c))
        );
        setIsTyping(true);

        // Simulate AI latency
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

        const aiMsg: Message = {
            id: uid(),
            role: MessageRole.Assistant,
            content: `You said: "${text}". Wire up a real AI backend here to get live responses — replace this block with a fetch() to your API.`,
            createdAt: new Date(),
        };

        setConversations((prev) =>
            prev.map((c) => (c.id === cid ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );
        setIsTyping(false);
    }, [input, activeId, isTyping]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isEmpty = !activeConvo || activeConvo.messages.length === 0;

    return (
        <div className="flex h-screen w-screen bg-white overflow-hidden font-[DM_Sans,_system-ui,_sans-serif]">

            {/* ── Sidebar ── */}
            <div
                className={cn(
                    "transition-all duration-200 ease-in-out overflow-hidden flex-shrink-0",
                    sidebarOpen ? "w-64" : "w-0"
                )}
            >
                {sidebarOpen && (
                    <Sidebar
                        user={user!}
                        conversations={conversations}
                        activeId={activeId}
                        onSelect={setActiveId}
                        onNew={handleNew}
                        onClose={() => setSidebarOpen(false)}
                        onDelete={handleDelete}
                        search={search}
                        onSearch={setSearch}
                    />
                )}
            </div>

            {/* ── Main panel ── */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">

                {/* Header */}
                <header className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-100 bg-white min-h-[52px]">
                    {!sidebarOpen && (
                        <TooltipProvider delayDuration={400}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={() => setSidebarOpen(true)}>
                                        <Icons.PanelLeft />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Open sidebar</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={handleNew}>
                                        <Icons.Plus />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>New chat</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    <div className="flex items-center gap-1.5 ml-1">
                        <Icons.Sparkles className="text-zinc-400" />
                        <span className="text-sm font-semibold text-zinc-800 tracking-tight">
                            {activeConvo ? clamp(activeConvo.title, 50) : "AI Assistant"}
                        </span>
                    </div>
                </header>

                {/* Message area */}
                <ScrollArea className="flex-1 w-full">
                    <div className="py-6 space-y-3">
                        {isEmpty ? (
                            <div className="flex flex-col items-center justify-center h-full mt-32 gap-3 px-6 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                                    <Icons.Sparkles className="text-zinc-500 w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
                                    What can I help with?
                                </h1>
                                <p className="text-sm text-zinc-400 max-w-sm">
                                    Start a conversation below. Ask anything — code, concepts, writing, or just a chat.
                                </p>
                            </div>
                        ) : (
                            <>
                                {activeConvo?.messages.map((msg) => (
                                    <MessageBubble key={msg.id} message={msg} />
                                ))}
                                {isTyping && (
                                    <div className="flex items-end gap-2.5 px-4 max-w-3xl w-full mx-auto">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                                            <Icons.Bot />
                                        </div>
                                        <div className="bg-zinc-100 rounded-2xl rounded-bl-sm">
                                            <TypingDots />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </ScrollArea>

                {/* Input area */}
                <div className="px-4 pb-5 pt-3 bg-white border-t border-zinc-100">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-100 transition-all">
                            <textarea
                                ref={textareaRef}
                                className="flex-1 bg-transparent resize-none border-none outline-none text-sm text-zinc-800 placeholder:text-zinc-400 leading-relaxed max-h-40 overflow-y-auto"
                                placeholder="Message…"
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            className={cn(
                                                "h-8 w-8 rounded-xl flex-shrink-0 transition-all",
                                                input.trim()
                                                    ? "bg-zinc-900 hover:bg-zinc-700 text-white"
                                                    : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                                            )}
                                            disabled={!input.trim() || isTyping}
                                            onClick={handleSend}
                                        >
                                            <Icons.Send className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Send (Enter)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <p className="text-center text-[11px] text-zinc-400 mt-2">
                            Enter to send · Shift+Enter for a new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}