import { createClient } from "@/lib/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const supabase = createClient();

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
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
    return (
        <div>
            <h1>Dashboard</h1>
            {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}
            {!user && <button onClick={() => navigate("/auth")}>Go to Auth</button>}
            {user && <button onClick={async () => {
                await supabase.auth.signOut();
                navigate("/auth");
            }}>Sign Out</button>}
        </div>
    )
}