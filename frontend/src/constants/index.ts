import type { Conversation } from "@/types";

export const MOCK_USER = {
    id: "1",
    name: "Pradeep Singh",
    initials: "PS",
    plan: "Pro",
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
    "Undecidable Problems",
    "Grammar Evaluation for Parsing",
    "LR(1) vs LALR(1)",
    "Probability Calculation Explanation",
    "Superkeys of Relation",
    "Conflict Serializability Check",
    "Cache Calculation Steps",
    "Benchmark Supply Chain Cost",
    "Download Google Maps Offline",
    "SQL Interview Prep Guide",
].map((title, i) => ({
    id: String(i + 1),
    title,
    slug: title.toLowerCase().replace(/ /g, "-"),
    userId: MOCK_USER.id,
    messages: [],
    createdAt: new Date(Date.now() - i * 86_400_000),
}));