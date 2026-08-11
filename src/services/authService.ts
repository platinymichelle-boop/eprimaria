import { supabase } from "./supabase";

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}