import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c5.08 0 9.27-3.81 9.88-8.72H12v-2.36h10.12A10.01 10.01 0 0 1 22 12z" />
      <path d="M12 22c-5.52 0-10-4.48-10-10S6.48 2 12 2c2.76 0 5.26 1.12 7.07 2.93L17.66 6.34A5.98 5.98 0 0 0 12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c3.64 0 6.51-2.95 6.51-6.51V11h-6.51" />
    </svg>
  );

const LineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path fill="#00C300" d="M21.92,8.19a9.78,9.78,0,0,0-5.3-4.88,10,10,0,0,0-9.24,0,9.78,9.78,0,0,0-5.3,4.88,9.9,9.9,0,0,0,0,9.62,9.78,9.78,0,0,0,5.3,4.88,10,10,0,0,0,9.24,0,9.78,9.78,0,0,0,5.3-4.88A9.9,9.9,0,0,0,21.92,8.19ZM11.23,15.75H9.51V10.23h.9s.25,0,.38.08.25.18.3.32l1.45,3.61,1.45-3.61c.05-.14.17-.24.3-.32a.89.89,0,0,1,.38-.08h.9v5.52H13.75V11.39l-1.12,2.83h-.89l-1.12-2.83v4.36ZM8.23,15.75H6.51V10.23H8.23Zm-2.72,0H3.79V10.23H5.51Zm11.3,0h-1V12.42a1.84,1.84,0,0,0-.47-1.31,1.48,1.48,0,0,0-1.2-.48,1.72,1.72,0,0,0-1.25.5,2.15,2.15,0,0,0-.5,1.43v2.19H10.15V10.23h1.58v.76a2.82,2.82,0,0,1,2.44-1.25,2.78,2.78,0,0,1,2.64,2.9V15.75Z"/>
    </svg>
);


export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl font-headline font-bold text-primary">Examplify</h1>
          <CardDescription className="text-foreground/80 pt-2">Sign in to create and take exams with ease</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/dashboard" passHref>
            <Button className="w-full h-12 text-lg" variant="default">
              <GoogleIcon className="mr-3 h-6 w-6" /> Sign in with Google
            </Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button className="w-full h-12 text-lg bg-[#00C300] hover:bg-[#00C300]/90 text-white">
              <LineIcon className="mr-3 h-6 w-6" /> Sign in with Line
            </Button>
          </Link>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">By signing in, you agree to our Terms of Service.</p>
        </CardFooter>
      </Card>
    </main>
  );
}
