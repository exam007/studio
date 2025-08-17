
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.026,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, isRegisteredUser } = useAuth();
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setAuthChecked(true);
      if (user) {
        if (isRegisteredUser) {
            router.push('/dashboard');
        } else {
             // The AuthContext will show the "not registered" toast.
             // We just need to stay on the page.
        }
      }
    }
  }, [user, loading, isRegisteredUser, router]);


  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // signInWithPopup will trigger onAuthStateChanged in AuthContext
      // AuthContext will handle user registration, toasts, and redirection.
      await signInWithPopup(auth, provider);
    } catch (error: any) {
        if (error.code !== 'auth/popup-closed-by-user') {
            toast({
                title: "เกิดข้อผิดพลาดในการล็อกอิน",
                description: `ไม่สามารถเข้าสู่ระบบด้วย Google ได้: ${error.message}`,
                variant: "destructive",
            });
        }
    } finally {
        setIsGoogleLoading(false);
    }
  };

    if (loading || !authChecked || (user && isRegisteredUser)) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-blue-200 dark:from-background dark:to-blue-950">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary"/>
                    <h1 className="text-2xl font-semibold text-foreground">กำลังตรวจสอบสถานะ...</h1>
                    <p className="text-muted-foreground">กรุณารอสักครู่</p>
                </div>
            </main>
        )
    }
    
    // Auth has been checked, and user is either not logged in, or logged in but not registered.
    // Show the login page.
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-blue-200 dark:from-background dark:to-blue-950">
          <Card className="w-full max-w-sm shadow-2xl backdrop-blur-sm bg-card/80">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="p-4 bg-primary/20 rounded-full">
                        <BookOpen className="w-12 h-12 text-primary" />
                    </div>
                </div>
              <CardTitle className="text-4xl font-headline font-bold text-primary">แนวข้อสอบ</CardTitle>
              <CardDescription>เข้าสู่ระบบด้วย Google เพื่อส่งคำขอเข้าใช้งานระบบ</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <div className="flex flex-col space-y-4">
                    <Button onClick={handleGoogleLogin} variant="outline" className="h-11 text-base" disabled={isGoogleLoading}>
                        {isGoogleLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <GoogleIcon className="mr-2"/>
                        )}
                        เข้าสู่ระบบด้วย Google
                    </Button>
                </div>
            </CardContent>
          </Card>
        </main>
    );
}
