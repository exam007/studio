import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";

export default function QuizResultsPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in-50 zoom-in-95">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-accent" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Quiz Submitted!</CardTitle>
                    <CardDescription className="pt-2">
                        Thank you for completing the quiz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Your answers have been successfully submitted and are now being evaluated by our AI grading system. You will be notified once the results are available.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href="/dashboard" passHref className="w-full">
                        <Button className="w-full" size="lg">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
