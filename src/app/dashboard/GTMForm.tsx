"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GTMForm() {
  const [form, setForm] = useState({
    product: "",
    audience: "",
    price: "",
    goal: "",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const generatePlan = async () => {
  setLoading(true);

  // Get logged-in user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Send request with user token
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  setPlan(data.plan);
  setLoading(false);
};


  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Create your GTM Plan</h2>

      {["product","audience","price","goal"].map((field) => (
        <input
          key={field}
          placeholder={field}
          className="border p-3 w-full rounded-lg"
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
        />
      ))}

      <button
        onClick={generatePlan}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Generating..." : "Generate GTM Plan"}
      </button>

      {plan && (
        <div className="bg-gray-900 text-gray-100 p-6 rounded-xl whitespace-pre-wrap mt-6">
          {plan}
        </div>
      )}
    </div>
  );
}
