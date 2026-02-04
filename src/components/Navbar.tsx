"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="w-full bg-black text-white px-8 py-4 flex justify-between">
      <div className="flex gap-6">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/plans">My Plans</Link>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
