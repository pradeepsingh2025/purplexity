import type{ Message } from "@/types";

export default function ChatBox({ messages }: { messages: Message[] }) {
    if (messages.length === 0) {
        return <div>Start a new conversation</div>;
    }
    return (
        <div>
            <h1>ChatBox</h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <p>User</p>
                    <p>Message</p>
                    <p>Time</p>
                </div>
            </div>
            <div className="flex flex-row gap-4">
                <p>Assistant</p>
                <p>Message</p>
            </div>
        </div>
    )
}