import { createBrowserClient } from '@supabase/ssr'

// Literal process.env.VITE_* refs are inlined by Bun (see bunfig.toml env = "VITE_*").
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

export function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase env vars. Create frontend/.env with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (see .env.example).'
    )
  }
  return createBrowserClient(supabaseUrl, supabaseKey)
}
