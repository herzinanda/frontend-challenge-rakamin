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
    } = onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        getUserProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

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
