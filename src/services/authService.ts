import { supabase } from "./supabase";

export async function signUp(
  email: string,
  password: string
) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(
  email: string,
  password: string
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function getProfile(
  userId: string
) {
  return supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
}

export async function signOut() {
  return supabase.auth.signOut();
}