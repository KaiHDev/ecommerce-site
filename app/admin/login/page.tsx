'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error logging in:', error.message);
        } else {
            console.log('Login successful!');
            router.push('/admin'); // Redirect to admin dashboard
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
            <form onSubmit={handleLogin} className="w-80 p-4 border rounded">
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded text-black"
                        placeholder="admin@example.com"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded text-black"
                        placeholder="Your password"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;

