"use client";

import "./styles/globals.css";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminHeader from "./components/AdminHeader";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Optional delay for smoother UX

    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session); // Replace with role checks if needed
    };
    checkSession();

    // Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session); // Update admin status on sign-in/out
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <html lang="en">
      <body>
        {isAdmin && <AdminHeader />}
        <Header />
        {loading && <LoadingSpinner />}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
