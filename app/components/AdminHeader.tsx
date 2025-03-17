"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"; 

const AdminHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  if (!user) return null;

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1
        className="text-white text-2xl font-semibold cursor-pointer"
        onClick={() => router.push("/")}
      >
        E-Commerce Admin
      </h1>
      <div>
        <button
          onClick={() => router.push("/admin")}
          className="bg-primary hover:bg-accent bg-shadow-md text-white px-4 py-2 rounded-md transition-all mr-3"
        >
          Dashboard
        </button>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
            router.push("/admin/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default AdminHeader;
