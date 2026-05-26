import type { Conversation } from "@/types";
import { useNavigate } from "react-router";

const navigate = useNavigate();
export default function Converations({ conversations }: { conversations: Conversation[] }) {
    if (conversations.length === 0) {
        return <div>No conversations found</div>;
    }
    return <div>
        <h2>Conversations</h2>
        {conversations.map((conversation) => (
            <button key={conversation.id} onClick={() => {
                navigate(`/conversation/${conversation.id}`);
            }}>
                {conversation.title}
            </button>
        ))}
    </div>
}