export enum MessageRole {
    User = "user",
    Assistant = "assistant",
}
export type Role = "user" | "assistant";

export interface Message {
    id: string;
    content: string;
    role: MessageRole;
    createdAt: Date;
}
export interface Conversation {
    id?: string;
    title: string;
    slug: string;
    userId: string;
    messages: Message[];
}