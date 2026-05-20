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

        if (error) {
            alert("Error while signing in");
        } else {
            alert("Signed In");
            console.log(data);
        }
    }
    return (
        <div>
            <h1>Auth page</h1>
            <button onClick={() => login("google")}>Login with Google</button>
            <button onClick={() => login("github")}>Login with Github</button>
        </div>
    )
}