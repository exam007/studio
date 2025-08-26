
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

type Exam = {
    id: string;
    name: string;
    questionCount: number;
    year: number; // Changed from timeInMinutes
}

export default function UserDashboardPage() {
    const [allQuizzes, setAllQuizzes] = useState<Exam[]>([]);

    useEffect(() => {
        // In a real app, this data would be fetched. Here we get it from localStorage.
        const quizzes: Exam[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("exam_details_")) {
                const quizData = JSON.parse(localStorage.getItem(key)!);
                // Add a default year if it doesn't exist for backward compatibility
                const quiz: Exam = {
                    ...quizData,
                    year: quizData.year || new Date().getFullYear() + 543, // Convert to Buddhist year
                };
                quizzes.push(quiz);
            }
        }
        setAllQuizzes(quizzes);
    }, []);


    return (
        <div className="animate-in fade-in-50">
             <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-headline font-bold">เลือกวิชาเพื่อเริ่มทำข้อสอบ</h1>
                    <p className="text-muted-foreground mt-2">เลือกวิชาที่คุณต้องการทดสอบความรู้ได้จากด้านล่างนี้</p>
                </div>
                <div>
                    {allQuizzes.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allQuizzes.map(quiz => (
                                <Card key={quiz.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                    <CardHeader className="p-0">
                                        <Image 
                                            src="https://placehold.co/600x400.png"
                                            alt={`ภาพประกอบข้อสอบ ${quiz.name}`}
                                            width={600}
                                            height={400}
                                            className="object-cover"
                                            data-ai-hint="test pattern"
                                        />
                                    </CardHeader>
                                    <CardContent className="p-4 flex-grow">
                                        <h2 className="font-semibold text-lg mb-2 truncate">{quiz.name}</h2>
                                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                                            <div className="flex items-center">
                                                <FileText className="w-4 h-4 mr-1.5" />
                                                <span>{quiz.questionCount} ข้อ</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1.5" />
                                                <span>ปี {quiz.year}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex flex-col items-stretch space-y-2">
                                        <Link href={`/quiz/${quiz.id}`} passHref className="w-full">
                                            <Button className="w-full justify-center bg-lime-500 hover:bg-lime-600 text-lime-950 font-bold">
                                                <span>เริ่มทำข้อสอบ</span>
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button className="w-full" variant="outline">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            อ่านข้อสอบ
                                        </Button>
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
            </div>
        </div>
    );
}
