import { supabase } from "./supabase";

// Funcția de înregistrare simplificată (Supabase se ocupă automat de profil în spate)
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

// Funcția de conectare cu email și parolă
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Preia utilizatorul conectat în sesiunea curentă
export async function getCurrentUser() {
  return supabase.auth.getUser();
}

// Preia profilul utilizatorului din tabela publică
export async function getProfile(userId: string) {
  return supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
}

// Deconectează utilizatorul din aplicație
export async function signOut() {
  return supabase.auth.signOut();
}
