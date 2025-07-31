
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // Mock function to simulate login and role check
  const handleLogin = (role: 'admin' | 'user') => {
    // In a real app, you would handle Google Sign-In here
    // and check the email domain.
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
            </div>
          <CardTitle className="text-4xl font-headline font-bold text-primary">แนวข้อสอบ</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
            <div className="flex flex-col space-y-3">
                {/* This would be a single Google Login button in the final version */}
                <Button onClick={() => handleLogin('user')} className="w-full h-12 text-lg" variant="default">
                  Login as User (@gmail.com)
                </Button>
                <Button onClick={() => handleLogin('admin')} className="w-full h-12 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Login as Admin (@attorney285.co.th)
                </Button>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
