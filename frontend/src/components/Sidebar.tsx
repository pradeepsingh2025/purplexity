import type { Conversation } from "@/types";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/svg";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { clamp, cn } from "@/lib/utils";
import { MOCK_USER } from "@/constants";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router";
import { createClient } from "@/lib/client";
import { LogOut } from "lucide-react"

const supabase = createClient()

interface SidebarProps {
    user: User
    conversations: Conversation[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onNew: () => void;
    onClose: () => void;
    onDelete: (id: string) => void;
    search: string;
    onSearch: (v: string) => void;
}

export default function Sidebar({
    user,
    conversations,
    activeId,
    onSelect,
    onNew,
    onClose,
    onDelete,
    search,
    onSearch,
}: SidebarProps) {

    const navigate = useNavigate()

    const filtered = conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <aside className="flex flex-col h-full w-64 bg-zinc-50 border-r border-zinc-200">
            {/* Top row */}
            <div className="flex items-center justify-between px-3 py-3">
                <TooltipProvider delayDuration={400}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={onClose}>
                                <Icons.PanelLeft />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Close sidebar</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={400}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={onNew}>
                                <Icons.Plus />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">New chat</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
                <div className="relative">
                    <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <Input
                        className="pl-8 h-8 text-sm bg-white border-zinc-200 focus-visible:ring-zinc-300 rounded-lg"
                        placeholder="Search conversations"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>

            <Separator className="bg-zinc-200" />

            {/* Conversation list */}
            <ScrollArea className="flex-1 px-2 py-2">
                {filtered.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center pt-6">No conversations found</p>
                ) : (
                    <ul className="space-y-0.5">
                        {filtered.map((c) => (
                            <li key={c.id}>
                                <div
                                    className={cn(
                                        "group flex items-center gap-2 w-full rounded-lg px-2.5 py-2 cursor-pointer text-left text-sm transition-colors",
                                        c.id === activeId
                                            ? "bg-zinc-200 text-zinc-900 font-medium"
                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    )}
                                    onClick={() => onSelect(c.id!)}
                                >
                                    <Icons.MessageSquare className="flex-shrink-0 text-zinc-400" />
                                    <span className="flex-1 truncate">{clamp(c.title, 34)}</span>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity p-0.5 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(c.id!);
                                        }}
                                        aria-label="Delete conversation"
                                    >
                                        <Icons.Trash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </ScrollArea>

            <Separator className="bg-zinc-200" />

            {/* User area */}
            {user &&
                <div className="flex items-center gap-3 px-3 py-3">
                    <Avatar className="h-8 w-8 bg-zinc-900 text-white text-xs font-semibold">
                        <AvatarFallback className="bg-zinc-900 text-white text-xs">{MOCK_USER.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-zinc-900 truncate leading-tight">{user?.email}</span>
                        <Badge variant="secondary" className="w-fit text-[10px] px-1.5 py-0 mt-0.5 bg-zinc-200 text-zinc-500 font-normal rounded-sm">
                            {MOCK_USER.plan}
                        </Badge>
                    </div>
                    <button onClick={async () => {
                        await supabase.auth.signOut();
                        navigate("/auth");
                    }} className="cursor-pointer text-sm">
                        <LogOut className="w-4 h-4"/>
                    </button>
                </div>
            }
            {!user && <button onClick={() => navigate("/auth")}>Go to Auth</button>}
        </aside>
    );
}