"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace("/admin"); // 🔹 Redirect to /admin if already signed in
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin"); // Redirect to admin page on successful login
    }
  };

  // 🔹 Handle "Enter" key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
