
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

// Mock data for quizzes a user has access to
const quizzes = [
    { id: '1', title: 'General Knowledge Challenge', questions: 15, time: 20 },
    { id: '2', title: 'World History Deep Dive', questions: 25, time: 25 },
];

export default function UserDashboardPage() {
    return (
        <div className="animate-in fade-in-50">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">ข้อสอบของคุณ</h1>
                <p className="text-muted-foreground mt-1">เลือกข้อสอบที่คุณต้องการจะทำ</p>
            </div>
            {quizzes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map(quiz => (
                        <Card key={quiz.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">{quiz.title}</CardTitle>
                                <CardDescription>บททดสอบความรู้ของคุณ</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <FileText className="w-4 h-4 mr-2" />
                                    <span>{quiz.questions} คำถาม</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>{quiz.time} นาที</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/quiz/${quiz.id}`} passHref className="w-full">
                                    <Button className="w-full justify-between" variant="default">
                                        <span>เริ่มทำข้อสอบ</span>
                                        <ChevronRight />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">ไม่พบข้อสอบ</h2>
                    <p className="text-muted-foreground mt-2">คุณยังไม่ได้รับสิทธิ์ให้ทำข้อสอบใดๆ</p>
                </div>
            )}
        </div>
    );
}

