import { createClient } from "@supabase/supabase-js";

// Supabase Connection Configuration
const SUPABASE_URL = "https://aamqfcwvylkglklwfypr.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_WFxzjsteS1lfTTz37z7IaA_NfnxJ6i-";

// Create and export the client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
