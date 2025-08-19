
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Home, XCircle, Check, HelpCircle, Info, Clock } from "lucide-react";
import Link from "next/link";

// In a real app, this data would be fetched from your backend
// after the AI grading is complete.
const MOCK_RESULTS = {
  score: 2,
  totalQuestions: 4,
  timeTakenInSeconds: 930, // 15 minutes 30 seconds
  totalTimeInMinutes: 20,
  results: [
    {
      questionId: 'q1',
      questionText: 'เมืองหลวงของประเทศญี่ปุ่นคืออะไร?',
      userAnswer: 'Tokyo',
      correctAnswer: 'Tokyo',
      isCorrect: true,
      explanation: 'โตเกียวเป็นเมืองหลวงของญี่ปุ่น เป็นที่รู้จักจากพระราชวังอิมพีเรียลและศาลเจ้าและวัดมากมาย',
    },
    {
      questionId: 'q2',
      questionText: 'กำแพงเมืองจีนสามารถมองเห็นได้จากดวงจันทร์ด้วยตาเปล่า',
      userAnswer: 'True',
      correctAnswer: 'False',
      isCorrect: false,
      explanation: 'นี่เป็นความเข้าใจผิดที่พบบ่อย กำแพงเมืองจีนไม่สามารถมองเห็นได้จากอวกาศ และแน่นอนว่าไม่สามารถมองเห็นได้จากดวงจันทร์หากไม่มีเครื่องช่วย',
    },
    {
      questionId: 'q3',
      questionText: 'ดาวเคราะห์ดวงใดเป็นที่รู้จักในชื่อดาวเคราะห์สีแดง',
      userAnswer: 'Mars',
      correctAnswer: 'Mars',
      isCorrect: true,
      explanation: 'ดาวอังคารถูกเรียกว่าดาวเคราะห์สีแดงเนื่องจากมีเหล็กออกไซด์สีแดงที่แพร่หลายบนพื้นผิว',
    },
    {
      questionId: 'q4',
      questionText: 'ใครเป็นคนเขียนบทละครเรื่อง "โรมิโอและจูเลียต"?',
      userAnswer: 'Jane Austen',
      correctAnswer: 'William Shakespeare',
      isCorrect: false,
      explanation: '"โรมิโอและจูเลียต" เป็นบทละครโศกนาฏกรรมที่เขียนโดยวิลเลียม เชกสเปียร์ ในช่วงต้นอาชีพของเขา',
    },
  ],
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function QuizResultsPage() {
    const { score, totalQuestions, results, timeTakenInSeconds, totalTimeInMinutes } = MOCK_RESULTS;

    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <Card className="w-full text-center shadow-2xl animate-in fade-in-50">
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
                                    <li key={result.questionId} className="p-4 border rounded-md bg-card">
                                        <div className="flex justify-between items-start gap-4">
                                            <p className="font-semibold text-base mb-3 flex-1">
                                                {index + 1}. {result.questionText}
                                            </p>
                                            {result.isCorrect ? (
                                                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p className={`p-3 rounded-md border-l-4 ${result.isCorrect ? 'bg-green-100/50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-100/50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-200'}`}>
                                                <span className="font-medium">คำตอบของคุณ: </span>{result.userAnswer}
                                            </p>
                                            {!result.isCorrect && (
                                                <p className="p-3 rounded-md bg-green-100/50 border-l-4 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200">
                                                    <span className="font-medium">คำตอบที่ถูกต้อง: </span>{result.correctAnswer}
                                                </p>
                                            )}
                                                <div className="mt-3 p-3 rounded-md bg-blue-100/50 border-l-4 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
                                                <div className="flex items-start gap-2">
                                                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-300"/>
                                                    <div>
                                                        <h4 className="font-medium mb-1">คำอธิบาย</h4>
                                                        <p className="text-sm">{result.explanation}</p>
                                                    </div>
                                                </div>
                                            </div>
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

