export const dynamic = "force-dynamic";

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // This reads the session from the URL and saves it in the browser
      await supabase.auth.getSession();

      // Redirect user to dashboard after login
      router.replace("/dashboard");
    };

    handleAuth();
  }, [router]);

  return (
    <div className
