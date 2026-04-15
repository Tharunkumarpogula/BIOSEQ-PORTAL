import { createClient } from "@supabase/supabase-js";

// Supabase Connection Configuration (provided via environment variables)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
	throw new Error(
		"Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
	);
}

// Create and export the client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
