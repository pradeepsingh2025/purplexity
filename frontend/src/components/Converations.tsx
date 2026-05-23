import type { Conversation } from "@/types";

export default function Converations({ conversations }: { conversations: Conversation[] }) {
    return (
        <div>
            <h2>Conversations</h2>
            {conversations.length === 0 && <p>No conversations found</p>}
            {conversations.length > 0 && conversations.map((conversation) => (
                <div key={conversation.id}>
                    <h3>{conversation.title}</h3>
                    <p>{conversation.slug}</p>
                    <p>{conversation.userId}</p>
                    <div>
                        {conversation.messages.map((message) => (
                            <div key={message.id}>
                                <p>{message.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}