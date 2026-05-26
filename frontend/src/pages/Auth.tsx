import { createClient } from "@/lib/client";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
// const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

// const supabase = createClient(supabaseUrl, supabaseKey)

const supabase = createClient();

export default function Auth() {

    async function login(provider: "github" | "google") {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider
        })
    }
    return (
        <div className="flex flex-col gap-5 items-center justify-center">
            <button onClick={() => login("google")} className="border-2 border-b-black px-4 py-2 cursor-pointer">Login with Google</button>
            <button onClick={() => login("github")} className="border-2 border-b-black px-4 py-2 cursor-pointer">Login with Github</button>
        </div>
    )
}