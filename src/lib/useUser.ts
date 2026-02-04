"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useUser() {
  const [user, setUser] = useState<any>(undefined); 
  // undefined = still checking
  // null = not logged in
  // object = logged in

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return user;
}
