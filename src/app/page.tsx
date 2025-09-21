
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, check if they are admin
        if (user.email === 'narongtorn.s@attorney285.co.th') {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/dashboard');
        }
      } else {
        // If no user, redirect to login page
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Display a loading indicator while checking auth status
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary"/>
            <h1 className="text-2xl font-semibold text-foreground">กำลังนำทาง...</h1>
            <p className="text-muted-foreground">กรุณารอสักครู่</p>
        </div>
    </main>
  );
}
