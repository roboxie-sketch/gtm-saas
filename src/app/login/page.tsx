"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const login = async () => {
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    alert("Magic link sent! Check your email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">
          Login / Signup
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 w-full mb-4 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-black text-white w-full py-3 rounded-lg"
        >
          Send Magic Link
        </button>
      </div>
    </div>
  );
}
