"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";
import { useRouter } from "next/navigation";

type Plan = {
  id: string;
  product: string;
  audience: string;
  price: string;
  goal: string;
  plan: string;
  created_at: string;
};

export default function PlansPage() {
  const user = useUser();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    if (user === null) router.push("/login");
    if (user) fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("gtm_plans")
      .select("*")
      .order("created_at", { ascending: false });

    setPlans(data || []);
  };

  if (user === undefined) return <p className="p-10">Loading...</p>;
  if (user === null) return null;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My GTM Plans</h1>

      <div className="space-y-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-gray-900 text-white p-6 rounded-xl">
            <p className="text-sm opacity-70 mb-2">
              {new Date(plan.created_at).toLocaleString()}
            </p>

            <h2 className="text-xl font-bold mb-2">
              {plan.product}
            </h2>

            <p className="opacity-80 mb-4">
              Audience: {plan.audience} • Price: {plan.price}
            </p>

            <div className="whitespace-pre-wrap text-sm">
              {plan.plan}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
