
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, LogIn, Terminal, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.026,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );

type PendingRequest = {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
};


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, isRegisteredUser } = useAuth();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // Redirect if user is logged in and registered
    if (!loading && user && isRegisteredUser) {
        router.push('/dashboard');
    }
  }, [user, loading, isRegisteredUser, router]);


  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "Admin@attorney" && password === "Admin285") {
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "กำลังนำคุณไปยังหน้าแดชบอร์ดผู้ดูแลระบบ...",
        className: "bg-green-100 dark:bg-green-900",
      });
      router.push('/admin/dashboard'); 
    } else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const loggedInUser = result.user;

        if (!loggedInUser || !loggedInUser.email) {
            throw new Error("ไม่สามารถรับข้อมูลผู้ใช้จาก Google ได้");
        }
        
        // The useEffect hook will handle redirection for registered users.
        // We now check if the user is NOT registered to handle the pending request logic.
        const isRegistered = isRegisteredUser; // use the state from context which is already calculated

        if (!isRegistered) {
            const pendingRequests: PendingRequest[] = JSON.parse(localStorage.getItem("pending_requests") || "[]");
            const existingRequest = pendingRequests.find(req => req.email === loggedInUser.email);

            if (existingRequest) {
                toast({
                    title: "กำลังรอการอนุมัติ",
                    description: "คำขอเข้าสู่ระบบของคุณถูกส่งไปแล้ว โปรดรอการอนุมัติจากผู้ดูแลระบบ",
                    variant: "default",
                });
            } else {
                const newRequest: PendingRequest = {
                    uid: loggedInUser.uid,
                    email: loggedInUser.email,
                    displayName: loggedInUser.displayName || "No Name",
                    photoURL: loggedInUser.photoURL || "",
                };
                pendingRequests.push(newRequest);
                localStorage.setItem("pending_requests", JSON.stringify(pendingRequests));
                window.dispatchEvent(new Event("storage"));
                
                toast({
                    title: "ส่งคำขอสำเร็จ",
                    description: "คำขอของคุณได้ถูกส่งไปให้ผู้ดูแลระบบเพื่อทำการอนุมัติแล้ว",
                    variant: "default",
                    duration: 9000,
                });
            }
            await signOut(auth);
            toast({
                title: "ไม่ได้รับอนุญาต",
                description: "ขออภัย คุณยังไม่มีชื่ออยู่ในระบบ โปรดรอการอนุมัติจากผู้ดูแล",
                variant: "destructive"
            });
        }

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

    if (loading) {
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
    
    // Don't render login page if user is logged in and registered, let useEffect redirect
    if (user && isRegisteredUser) {
        return (
             <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-blue-200 dark:from-background dark:to-blue-950">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary"/>
                    <h1 className="text-2xl font-semibold text-foreground">กำลังเข้าสู่ระบบ...</h1>
                </div>
            </main>
        );
    }

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
          <CardDescription>เข้าสู่ระบบเพื่อทำข้อสอบ หรือจัดการระบบ</CardDescription>
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
                
                <div className="flex items-center space-x-2 my-2">
                    <Separator className="flex-1"/>
                    <span className="text-xs text-muted-foreground">หรือ</span>
                    <Separator className="flex-1"/>
                </div>

                {showAdminLogin ? (
                    <form onSubmit={handleAdminLogin} className="flex flex-col space-y-4 animate-in fade-in-50">
                        <p className="text-center text-sm text-muted-foreground -mt-2">สำหรับผู้ดูแลระบบ</p>
                        {error && (
                            <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">ชื่อผู้ใช้</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="ชื่อผู้ใช้"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">รหัสผ่าน</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 text-lg" variant="default">
                            <LogIn className="mr-2 h-5 w-5" />
                            เข้าสู่ระบบ
                        </Button>
                    </form>
                ) : (
                    <Button variant="ghost" onClick={() => setShowAdminLogin(true)} className="w-full">
                       สำหรับผู้ดูแลระบบ
                    </Button>
                )}
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
