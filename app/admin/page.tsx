"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AdminProductManagement from "@/app/components/AdminProductManagement";

const AdminPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login"); // Redirects unauthorized users to /admin/login
      } else {
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return isAuthenticated ? <AdminProductManagement /> : null;
};

export default AdminPage;
