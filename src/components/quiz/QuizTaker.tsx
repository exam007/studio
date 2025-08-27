
"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, Eye, EyeOff, Loader2, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Question } from "@/app/admin/edit-exam/[id]/page";

type Quiz = {
    id: string;
    title: string;
    timeInMinutes: number;
    questions: Question[];
}

type Answers = {
    [questionId: string]: string;
}

const Timer = ({ initialTimeInSeconds, onTimeUp, isVisible, timeTakenRef }: { initialTimeInSeconds: number, onTimeUp: () => void, isVisible: boolean, timeTakenRef: React.MutableRefObject<number> }) => {
    const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
    const progress = (timeLeft / initialTimeInSeconds) * 100;

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                const newTime = prevTime - 1;
                timeTakenRef.current = initialTimeInSeconds - newTime;
                return newTime;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeUp, initialTimeInSeconds, timeTakenRef]);

    if (!isVisible) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="mb-6 p-4 border rounded-lg bg-card sticky top-4 z-10">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-lg font-semibold">
                    <Clock className="mr-2 h-5 w-5" />
                    เวลาที่เหลือ
                </div>
                <div className="text-xl font-mono font-bold text-primary">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
            </div>
            <Progress value={progress} />
        </div>
    );
};

export function QuizTaker({ quiz }: { quiz: Quiz }) {
    const router = useRouter();
    const { toast } = useToast();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTimerVisible, setIsTimerVisible] = useState(true);
    const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
    
    const timeTakenRef = useRef(0);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    const handleTimeUp = () => {
        if (!showTimeUpDialog && !isSubmitting) {
            setShowTimeUpDialog(true);
        }
    };

    const submitFromDialog = () => {
        setShowTimeUpDialog(false);
        handleSubmit();
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        toast({
            title: "กำลังส่งข้อสอบ...",
            description: "ระบบกำลังประมวลผลคำตอบของคุณ โปรดรอสักครู่",
        });

        // This simulates a short delay for processing, then navigates with results.
        setTimeout(() => {
            const results = quiz.questions.map(q => {
                const userAnswer = answers[q.id] || "";
                let isCorrect = false;

                // For MCQ and T/F, check if the selected option ID matches the correct answer ID.
                if (q.type === 'mcq' || q.type === 'tf') {
                    isCorrect = userAnswer === q.correctAnswer;
                } else if (q.type === 'short') {
                    // For short answers, we'll just pass it through. AI grading is a future feature.
                    // For now, let's consider it incorrect for scoring purposes unless it's an exact match.
                    isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                }

                return {
                    question: q, // Pass the full question object
                    userAnswer: userAnswer,
                    isCorrect: isCorrect
                };
            });
            
            const resultsString = JSON.stringify(results);
            const timeTaken = timeTakenRef.current;

            // Navigate to results page with data in query params
            router.push(`/quiz/${quiz.id}/results?results=${encodeURIComponent(resultsString)}&timeTaken=${timeTaken}&totalTime=${quiz.timeInMinutes}`);

        }, 1500);
    };

    return (
        <div className="w-full">
             <AlertDialog>
                <div className="flex justify-between items-center mb-4 gap-2">
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive" className="h-9">
                            <X className="mr-2 h-4 w-4" />
                            ส่งข้อสอบ
                        </Button>
                    </AlertDialogTrigger>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="timer-visibility">{isTimerVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</Label>
                        <Switch
                            id="timer-visibility"
                            checked={isTimerVisible}
                            onCheckedChange={setIsTimerVisible}
                            aria-label="Toggle timer visibility"
                        />
                    </div>
                </div>
                
                <Timer 
                    initialTimeInSeconds={quiz.timeInMinutes * 60} 
                    onTimeUp={handleTimeUp} 
                    isVisible={isTimerVisible}
                    timeTakenRef={timeTakenRef}
                />

                <Card className="w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{`คำถามข้อที่ ${currentQuestionIndex + 1} จาก ${quiz.questions.length}`}</CardTitle>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                    <CardContent className="py-6 min-h-[200px]">
                        <p className="text-lg mb-6">{currentQuestion.text}</p>
                        {currentQuestion.type === 'mcq' && (
                            <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={(val) => handleAnswerChange(currentQuestion.id, val)} className="space-y-3">
                                {currentQuestion.options?.map(option => {
                                    const isSelected = answers[currentQuestion.id] === option.id;
                                    return (
                                        <div key={option.id} className="flex items-center">
                                            <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                                            <Label 
                                                htmlFor={option.id} 
                                                className={cn(
                                                    "flex-1 cursor-pointer space-x-3 p-4 border rounded-lg transition-all duration-200 ease-in-out w-full",
                                                    "hover:bg-primary/90 hover:text-primary-foreground hover:scale-[1.02] active:scale-[1.02]",
                                                    isSelected && "bg-primary text-primary-foreground scale-[1.02]"
                                                )}
                                            >
                                                <span>{option.text}</span>
                                            </Label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        )}
                        {currentQuestion.type === 'tf' && (
                             <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={(val) => handleAnswerChange(currentQuestion.id, val)} className="space-y-3">
                                {currentQuestion.options?.map(option => {
                                    const isSelected = answers[currentQuestion.id] === option.id;
                                    return (
                                        <div key={option.id} className="flex items-center">
                                            <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                                            <Label 
                                                htmlFor={option.id} 
                                                className={cn(
                                                    "flex-1 cursor-pointer space-x-3 p-4 border rounded-lg transition-all duration-200 ease-in-out w-full",
                                                    "hover:bg-primary/90 hover:text-primary-foreground hover:scale-[1.02] active:scale-[1.02]",
                                                    isSelected && "bg-primary text-primary-foreground scale-[1.02]"
                                                )}
                                            >
                                                <span>{option.text}</span>
                                            </Label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        )}
                        {currentQuestion.type === 'short' && (
                            <Textarea 
                                placeholder="พิมพ์คำตอบของคุณที่นี่..."
                                value={answers[currentQuestion.id] || ''}
                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                className="text-base h-32"
                            />
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>ก่อนหน้า</Button>
                        {currentQuestionIndex < quiz.questions.length - 1 ? (
                            <Button onClick={handleNext}>ถัดไป</Button>
                        ) : (
                            <AlertDialogTrigger asChild>
                                <Button disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    ส่งข้อสอบ
                                </Button>
                            </AlertDialogTrigger>
                        )}
                    </CardFooter>
                </Card>

                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการส่งข้อสอบ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        คุณแน่ใจหรือไม่ว่าต้องการส่งข้อสอบ? การกระทำนี้ไม่สามารถย้อนกลับได้
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "ยืนยันการส่ง"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>

            <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>หมดเวลา!</AlertDialogTitle>
                    <AlertDialogDescription>
                        เวลาในการทำข้อสอบหมดแล้ว ระบบจะทำการส่งคำตอบของคุณเพื่อตรวจคะแนน
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={submitFromDialog} disabled={isSubmitting}>
                         {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "ส่งคำตอบของฉัน"}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
