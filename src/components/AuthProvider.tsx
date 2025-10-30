'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loader from '@/components/common/Loader';

export default function AuthProvider({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = sessionStorage.getItem('authToken');

            // If no token and not on signin page, redirect to signin
            if (!token && pathname !== '/auth/signin') {
                router.push('auth/signin');
            }
            // If has token and on signin page, redirect to dashboard
            if (token && pathname === 'auth/signin') {
                router.push('/');
            }

            setLoading(false);
        };

        checkAuth();
    }, [pathname, router]);

    if (loading) {
        return <Loader />;
    }

    return <>{children}</>;
}