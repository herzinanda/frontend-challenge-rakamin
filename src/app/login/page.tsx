"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react"; // Import React for a loading fallback
import { useAuth } from "@/context/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role === "ADMIN") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [profile, loading, router]);

  if (loading || profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-10">
      <AuthForm />
    </div>
  );
}