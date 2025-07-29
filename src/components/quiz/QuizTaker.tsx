"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, Eye, EyeOff, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Quiz = {
    id: string;
    title: string;
    timeInMinutes: number;
    questions: {
        id: string;
        type: 'mcq' | 'short' | 'tf';
        text: string;
        options?: { id: string, text: string }[];
    }[];
}

type Answers = {
    [questionId: string]: string;
}

const Timer = ({ initialTimeInSeconds, onTimeUp, isVisible }: { initialTimeInSeconds: number, onTimeUp: () => void, isVisible: boolean }) => {
    const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
    const progress = (timeLeft / initialTimeInSeconds) * 100;

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeUp]);

    if (!isVisible) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="mb-6 p-4 border rounded-lg bg-card sticky top-4 z-10">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-lg font-semibold">
                    <Clock className="mr-2 h-5 w-5" />
                    Time Left
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

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    const handleTimeUp = () => {
        setShowTimeUpDialog(true);
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
            title: "Submitting Quiz...",
            description: "Your answers are being sent for AI grading. Please wait.",
        });

        setTimeout(() => {
            // Simulate AI grading
            setIsSubmitting(false);
            router.push(`/quiz/${quiz.id}/results`);
        }, 2500);
    };

    return (
        <div className="w-full">
            <div className="flex justify-end items-center mb-4 gap-2">
                <div className="flex items-center space-x-2">
                    {isTimerVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <Label htmlFor="timer-visibility">Show Timer</Label>
                    <Switch
                        id="timer-visibility"
                        checked={isTimerVisible}
                        onCheckedChange={setIsTimerVisible}
                    />
                </div>
            </div>
            
            <Timer initialTimeInSeconds={quiz.timeInMinutes * 60} onTimeUp={handleTimeUp} isVisible={isTimerVisible} />

            <Card className="w-full shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{`Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`}</CardTitle>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
                <CardContent className="py-6 min-h-[200px]">
                    <p className="text-lg mb-6">{currentQuestion.text}</p>
                    {currentQuestion.type === 'mcq' && (
                        <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={(val) => handleAnswerChange(currentQuestion.id, val)} className="space-y-3">
                            {currentQuestion.options?.map(option => (
                                <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value={option.id} id={option.id} />
                                    <Label htmlFor={option.id} className="text-base flex-1 cursor-pointer">{option.text}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                    {currentQuestion.type === 'tf' && (
                         <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={(val) => handleAnswerChange(currentQuestion.id, val)} className="space-y-3">
                            {currentQuestion.options?.map(option => (
                                <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value={option.text} id={option.id} />
                                    <Label htmlFor={option.id} className="text-base flex-1 cursor-pointer">{option.text}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                    {currentQuestion.type === 'short' && (
                        <Textarea 
                            placeholder="Type your answer here..."
                            value={answers[currentQuestion.id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            className="text-base h-32"
                        />
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</Button>
                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                        <Button onClick={handleNext}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit for AI Grading
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <AlertDialog open={showTimeUpDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Time's Up!</AlertDialogTitle>
                    <AlertDialogDescription>
                        The timer for this quiz has run out. Your answers will be submitted for grading now.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={submitFromDialog}>Submit My Answers</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
