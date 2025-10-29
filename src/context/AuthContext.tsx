"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabaseClient"; // Pastikan path ini benar

import { Session } from "@supabase/supabase-js";
import {
  getUserProfile,
  onAuthStateChange,
  UserProfile,
} from "@/lib/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();

    const {
      data: { subscription: authListener },
    } = onAuthStateChange(async(authEvent, session) => {
      setSession(session);

      if (authEvent === "SIGNED_IN" && session) {
        const userProfile = await getUserProfile(session.user.id);
        setProfile(userProfile);

        // This is the new redirection logic
        if (userProfile?.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          // Default redirect for APPLICANT or any other role
          router.push("/");
        }
      } else if (authEvent === "SIGNED_OUT") {
        setProfile(null);
        // Optional: You might want to force a redirect to login on sign out
        // router.push("/login");
      } else if (session) {
        getUserProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  const value = {
    session,
    profile,
    loading,
    isAdmin: profile?.role === "ADMIN",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Hook Kustom (Best Practice!)
 * Ini adalah cara Anda akan mengakses data auth di komponen lain.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
