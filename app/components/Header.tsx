"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes and update UI dynamically
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Fetch initial user session
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const handleSignIn = () => {
    router.push("/admin/login"); // Redirect to login page when "Sign In" is clicked
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/admin/login"); // Redirect to login after logout
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-white text-2xl font-semibold cursor-pointer" onClick={() => router.push("/")}>
        E-Commerce Admin
      </h1>
      <div>
        {user ? (
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
