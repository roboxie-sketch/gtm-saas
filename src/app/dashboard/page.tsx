"use client";

import { useUser } from "@/lib/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GTMForm from "./GTMForm";

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect AFTER we know user is not logged in
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // While checking session
  if (user === undefined) {
    return <p className="p-10">Checking login...</p>;
  }

  // If not logged in
  if (user === null) {
    return null;
  }

  // Logged in UI
  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-4">
        Dashboard 🎉
      </h1>

      <p className="text-lg">You are logged in as:</p>
      <p className="font-semibold mt-2">{user.email}</p>
      
      <GTMForm />
    </div>
  );
}
