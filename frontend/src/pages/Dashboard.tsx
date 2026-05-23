import Converations from "@/components/Converations";
import { createClient } from "@/lib/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Conversation } from "@/types";

const supabase = createClient();

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const navigate = useNavigate();
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
    return (
        <div>
            <h1>Dashboard</h1>
            {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}
            {!user && <button onClick={() => navigate("/auth")}>Go to Auth</button>}
            {user && <button onClick={async () => {
                await supabase.auth.signOut();
                navigate("/auth");
            }}>Sign Out</button>}

            <Converations conversations={conversations} />
        </div>
    )
}