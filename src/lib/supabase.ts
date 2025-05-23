// src/lib/supabase.ts
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { storage } from "./storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltam variáveis de ambiente do Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface Profile {
  id: string;
  directus_token: string;
  updated_at: string;
  created_at: string;
  directus_user_id: string;
  plan: string | null;
  company_id: string;
}
