
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ref, get, set, child } from "firebase/database";


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
c:
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.026,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );

const isUserRegistered = async (uid: string): Promise<boolean> => {
    if (!uid) return false;
    try {
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await get(userRef);
        return snapshot.exists();
    } catch (error) {
        console.error("Error checking user registration in Firebase DB:", error);
        return false;
    }
};

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
        if (loading) {
            return;
        }

        const isAdminSession = sessionStorage.getItem('isAdminLoggedIn') === 'true';

        if (isAdminSession || (user && user.email === 'narongtorn.s@attorney285.co.th')) {
            router.push('/admin/dashboard');
        } else if (user) {
            const isRegistered = await isUserRegistered(user.uid);
            if (isRegistered) {
                router.push('/dashboard');
            } else {
                await signOut(auth);
                setLoginError("บัญชีของคุณยังไม่ได้รับอนุญาตให้เข้าใช้งาน หรือถูกนำออกจากระบบแล้ว โปรดติดต่อผู้ดูแล");
                setIsCheckingUser(false);
            }
        } else {
            // If not loading, no user, and no admin session, it means it's a new visitor.
            // Stop checking and show the login page.
            setIsCheckingUser(false);
        }
    };
    checkUserStatus();
  }, [user, loading, router]);


  const handleLoginAttempt = () => {
    setLoginError(null);
    setIsLoading(true);
  }

  const handleGoogleLogin = async () => {
    handleLoginAttempt();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The useEffect hook will handle redirection once the `user` state is updated.
    } catch (error: any) {
        const loggedInUser = auth.currentUser || (error.customData ? error.customData.user : null);

        if (loggedInUser) {
             const isRegistered = await isUserRegistered(loggedInUser.uid);
             if (!isRegistered) {
                setLoginError("ไม่มีชื่อในระบบ บัญชีของคุณยังไม่ได้รับอนุญาตให้เข้าใช้งาน โปรดติดต่อผู้ดูแลเพื่อขอสิทธิ์");
                
                const requestRef = ref(db, `requests/${loggedInUser.uid}`);
                const requestSnapshot = await get(requestRef);

                if (!requestSnapshot.exists()){
                    const pendingRequest = {
                        uid: loggedInUser.uid,
                        email: loggedInUser.email,
                        displayName: loggedInUser.displayName,
                        photoURL: loggedInUser.photoURL,
                    };
                    await set(requestRef, pendingRequest);
                }
                await signOut(auth);
             }
        } else if (error.code !== 'auth/popup-closed-by-user') {
            setLoginError(`เกิดข้อผิดพลาดในการล็อกอิน: ${error.message}`);
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
        setLoginError("กรุณากรอกอีเมลและรหัสผ่าน");
        return;
    }
    handleLoginAttempt();
    
    if (adminEmail === 'narongtorn.s@attorney285.co.th' && adminPassword === '12345678') {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        try {
            await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        } catch (error) {
            console.warn("Admin sign-in warning:", error);
        }
        router.push('/admin/dashboard');
    } else {
         setLoginError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
         setIsLoading(false);
    }
  }

    if (isCheckingUser) { 
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary"/>
                    <h1 className="text-2xl font-semibold text-foreground">กำลังตรวจสอบสถานะ...</h1>
                    <p className="text-muted-foreground">กรุณารอสักครู่</p>
                </div>
            </main>
        )
    }
    
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <div className="w-full max-w-sm p-8 space-y-6 bg-card rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-headline font-bold text-foreground">
                        {showAdminLogin ? 'Admin Login' : 'ยินดีต้อนรับ'}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {showAdminLogin ? 'เข้าสู่ระบบสำหรับผู้ดูแลระบบ' : 'เข้าสู่ระบบเพื่อทำข้อสอบ'}
                    </p>
                </div>

                {loginError && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                        <AlertDescription>
                            {loginError}
                        </AlertDescription>
                    </Alert>
                )}

                <div className={cn("transition-opacity duration-300", showAdminLogin ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                    <div className="flex flex-col space-y-4">
                        <Button onClick={handleGoogleLogin} variant="secondary" className="h-12 text-base font-bold" disabled={isLoading}>
                            {isLoading && !showAdminLogin ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <GoogleIcon className="mr-2"/>
                            )}
                            เข้าสู่ระบบด้วย Google
                        </Button>
                    </div>
                </div>
                
                <div className={cn("transition-opacity duration-300", !showAdminLogin ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                    <form onSubmit={handleAdminLogin} className="flex flex-col space-y-4">
                            <div>
                            <Label htmlFor="admin-email">อีเมล</Label>
                            <Input
                                id="admin-email"
                                type="email"
                                placeholder="admin@example.com"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                            <div>
                            <Label htmlFor="admin-password">รหัสผ่าน</Label>
                            <Input
                                id="admin-password"
                                type="password"
                                placeholder="••••••••"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                            <Button type="submit" className="w-full h-11" disabled={isLoading}>
                            {isLoading && showAdminLogin ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Shield className="mr-2 h-4 w-4" />
                            )}
                            เข้าสู่ระบบผู้ดูแล
                        </Button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                        <Button variant="link" className="text-muted-foreground" onClick={() => { setShowAdminLogin(!showAdminLogin); setLoginError(null); }}>
                        {showAdminLogin ? "กลับสู่หน้าเข้าสู่ระบบทั่วไป" : "สำหรับผู้ดูแลระบบ"}
                        </Button>
                </div>
            </div>
        </main>
    );
}

    