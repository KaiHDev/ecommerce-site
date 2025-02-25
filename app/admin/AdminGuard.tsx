'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            // Get the current session (user must be logged in)
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                console.log('No session found. Redirecting to login...');
                router.push('/admin/login'); // Redirect to login if not logged in
                return;
            }

            // Fetch the user's metadata to check for admin role
            const { data: { user } } = await supabase.auth.getUser();
            const role = user?.user_metadata?.role;

            if (role === 'admin') {
                console.log('User is admin. Access granted.');
                setIsAdmin(true);
            } else {
                console.warn('User is not admin. Redirecting to login...');
                router.push('/admin/login'); // Redirect if not an admin
            }
            
            setIsLoading(false);
        };

        checkAdmin();
    }, [router]);

    if (isLoading) return <p>Loading...</p>;

    return isAdmin ? <>{children}</> : null;
};

export default AdminGuard;
