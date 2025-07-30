import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
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
                <Link href="/dashboard" passHref>
                    <Button className="w-full h-12 text-lg" variant="default">
                    เข้าสู่ระบบด้วย Google
                    </Button>
                </Link>
                <Link href="/dashboard" passHref>
                    <Button className="w-full h-12 text-lg bg-[#00B900] hover:bg-[#00B900]/90 text-white">
                    เข้าสู่ระบบด้วย Line
                    </Button>
                </Link>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
