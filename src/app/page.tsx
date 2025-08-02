
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "Admin@aottorney" && password === "Admin285") {
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "กำลังนำคุณไปยังหน้าแดชบอร์ด...",
      });
      router.push('/admin/dashboard');
    } else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-blue-200 dark:from-background dark:to-blue-950">
      <Card className="w-full max-w-sm shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <div className="p-4 bg-primary/20 rounded-full">
                    <BookOpen className="w-12 h-12 text-primary" />
                </div>
            </div>
          <CardTitle className="text-4xl font-headline font-bold text-primary">Admin Login</CardTitle>
          <CardDescription>เข้าสู่ระบบเพื่อจัดการข้อสอบ</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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
        </CardContent>
      </Card>
    </main>
  );
}

