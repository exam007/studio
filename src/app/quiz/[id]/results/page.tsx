
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Home, XCircle, Check, HelpCircle, Info, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Question } from "@/app/admin/edit-exam/[id]/page";

type Result = {
    question: Question;
    userAnswer: string;
    isCorrect: boolean;
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

function QuizResults() {
    const searchParams = useSearchParams();

    const resultsString = searchParams.get("results");
    const timeTakenString = searchParams.get("timeTaken");
    const totalTimeString = searchParams.get("totalTime");

    if (!resultsString || !timeTakenString || !totalTimeString) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">ไม่สามารถโหลดผลลัพธ์ได้</h1>
                <p className="text-muted-foreground">ข้อมูลผลลัพธ์ไม่ครบถ้วน</p>
                <Link href="/dashboard" className="mt-4">
                    <Button>กลับไปหน้าหลัก</Button>
                </Link>
            </div>
        );
    }

    const results: Result[] = JSON.parse(resultsString);
    const timeTakenInSeconds = parseInt(timeTakenString, 10);
    const totalTimeInMinutes = parseInt(totalTimeString, 10);
    
    const score = results.filter(r => r.isCorrect).length;
    const totalQuestions = results.length;

    const getDisplayAnswer = (question: Question, answer: string): string => {
        if (question.type === 'mcq') {
            const option = question.options.find(o => o.id === answer);
            return option ? option.text : "ไม่ได้ตอบ";
        }
        if (question.type === 'tf') {
            return answer === 'true' ? 'True' : answer === 'false' ? 'False' : "ไม่ได้ตอบ";
        }
        return answer || "ไม่ได้ตอบ";
    };

    return (
        <div className="flex flex-col items-center bg-background p-4 sm:p-6 lg:p-8 animate-in fade-in-50">
            <Card className="w-full max-w-3xl text-center shadow-2xl">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-headline">ทำข้อสอบเสร็จสิ้น!</CardTitle>
                    <CardDescription className="pt-2 text-base">
                        นี่คือผลลัพธ์ของคุณ
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 bg-muted/50 rounded-lg flex flex-col sm:flex-row justify-around items-center gap-4">
                        <div className="text-center">
                            <p className="text-lg text-muted-foreground">คะแนน</p>
                            <p className="text-6xl font-bold text-primary">{score} / {totalQuestions}</p>
                        </div>
                        <div className="h-20 w-px bg-border hidden sm:block"></div>
                        <div className="w-full h-px bg-border sm:hidden"></div>
                        <div className="text-center">
                            <p className="text-lg text-muted-foreground flex items-center justify-center gap-2"><Clock className="w-5 h-5"/> เวลาที่ใช้</p>
                            <p className="text-4xl font-bold text-primary">{formatTime(timeTakenInSeconds)}</p>
                            <p className="text-sm text-muted-foreground">จากทั้งหมด {totalTimeInMinutes} นาที</p>
                        </div>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full text-left">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5" />
                                    <span>ตรวจสอบคำตอบของคุณ</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-4 pt-4">
                                    {results.map((result, index) => (
                                        <li key={result.question.id} className="p-4 border rounded-md bg-card">
                                            <div className="flex justify-between items-start gap-4">
                                                <p className="font-semibold text-base mb-3 flex-1">
                                                    {index + 1}. {result.question.text}
                                                </p>
                                                {result.isCorrect ? (
                                                    <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <p className={`p-3 rounded-md border-l-4 ${result.isCorrect ? 'bg-green-100/50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-100/50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-200'}`}>
                                                    <span className="font-medium">คำตอบของคุณ: </span>{getDisplayAnswer(result.question, result.userAnswer)}
                                                </p>
                                                {!result.isCorrect && (
                                                    <p className="p-3 rounded-md bg-green-100/50 border-l-4 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200">
                                                        <span className="font-medium">คำตอบที่ถูกต้อง: </span>{getDisplayAnswer(result.question, result.question.correctAnswer)}
                                                    </p>
                                                )}
                                                {result.question.type !== 'short' && ( // Assuming no explanation for short answers yet
                                                    <div className="mt-3 p-3 rounded-md bg-blue-100/50 border-l-4 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
                                                        <div className="flex items-start gap-2">
                                                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-300"/>
                                                            <div>
                                                                <h4 className="font-medium mb-1">คำอธิบาย</h4>
                                                                <p className="text-sm">คำตอบที่ถูกต้องคือ "{getDisplayAnswer(result.question, result.question.correctAnswer)}"</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    
                </CardContent>
                <CardFooter>
                    <Link href="/dashboard" passHref className="w-full">
                        <Button className="w-full" size="lg">
                            <Home className="mr-2 h-4 w-4" />
                            กลับไปหน้าหลัก
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function QuizResultsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">กำลังประมวลผลผลลัพธ์...</p>
                </div>
            </div>
        }>
            <QuizResults />
        </Suspense>
    );
}
