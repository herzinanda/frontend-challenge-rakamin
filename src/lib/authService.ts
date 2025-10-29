import { supabase } from "./supabaseClient";
import type {
  SignInWithPasswordCredentials,
  Session,
  Subscription,
  AuthChangeEvent,
} from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  role: "ADMIN" | "APPLICANT";
  full_name?: string;
}

interface CustomSignUpCredentials {
  email: string;
  password: string;
  fullName: string;
}

export const signUpUser = async (credentials: CustomSignUpCredentials) => {
  const { email, password, fullName } = credentials;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const signInUser = async (
  credentials: SignInWithPasswordCredentials
) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async (): Promise<Session | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error.message);
      return null;
    }
    return data as UserProfile;
  } catch (error: any) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
};

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return { data: { subscription } };
};
