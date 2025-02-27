"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login'); // Redirect to login page if not authenticated
      } else {
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AdminGuard;
