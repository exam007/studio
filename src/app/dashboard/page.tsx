
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Exam = {
    id: string;
    name: string;
    questionCount: number;
    timeInMinutes: number;
}

export default function UserDashboardPage() {
    const [allQuizzes, setAllQuizzes] = useState<Exam[]>([]);

    useEffect(() => {
        // In a real app, this data would be fetched. Here we get it from localStorage.
        const quizzes: Exam[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("exam_details_")) {
                const quiz = JSON.parse(localStorage.getItem(key)!);
                quizzes.push(quiz);
            }
        }
        setAllQuizzes(quizzes);
    }, []);


    return (
        <div className="animate-in fade-in-50">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">ข้อสอบทั้งหมด</h1>
                <p className="text-muted-foreground mt-1">เลือกข้อสอบที่คุณต้องการจะทำ (มุมมองผู้ใช้)</p>
            </div>
            {allQuizzes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allQuizzes.map(quiz => (
                        <Card key={quiz.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">{quiz.name}</CardTitle>
                                <CardDescription>บททดสอบความรู้ของคุณ</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <FileText className="w-4 h-4 mr-2" />
                                    <span>{quiz.questionCount} คำถาม</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>{quiz.timeInMinutes} นาที</span>
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
                    <p className="text-muted-foreground mt-2">ยังไม่มีข้อสอบในระบบที่ผู้ดูแลสร้างไว้</p>
                </div>
            )}
        </div>
    );
}

    