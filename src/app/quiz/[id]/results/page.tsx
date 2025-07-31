
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Home, XCircle, Check, HelpCircle } from "lucide-react";
import Link from "next/link";

// In a real app, this data would be fetched from your backend
// after the AI grading is complete.
const MOCK_RESULTS = {
  score: 2,
  totalQuestions: 4,
  results: [
    {
      questionId: 'q1',
      questionText: 'What is the capital of Japan?',
      userAnswer: 'Tokyo',
      correctAnswer: 'Tokyo',
      isCorrect: true,
    },
    {
      questionId: 'q2',
      questionText: 'The Great Wall of China is visible from the moon with the naked eye.',
      userAnswer: 'True',
      correctAnswer: 'False',
      isCorrect: false,
    },
    {
      questionId: 'q3',
      questionText: 'Which planet is known as the Red Planet?',
      userAnswer: 'Mars',
      correctAnswer: 'Mars',
      isCorrect: true,
    },
    {
      questionId: 'q4',
      questionText: 'Who wrote the play "Romeo and Juliet"?',
      userAnswer: 'Jane Austen',
      correctAnswer: 'William Shakespeare',
      isCorrect: false,
    },
  ],
};


export default function QuizResultsPage() {
    const { score, totalQuestions, results } = MOCK_RESULTS;

    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-3xl">
                <Card className="w-full text-center shadow-2xl animate-in fade-in-50">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-headline">Quiz Complete!</CardTitle>
                        <CardDescription className="pt-2 text-base">
                            Here are your results.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-6 bg-muted/50 rounded-lg">
                            <p className="text-lg text-muted-foreground">You Scored</p>
                            <p className="text-6xl font-bold text-primary">{score} / {totalQuestions}</p>
                        </div>
                        
                        <Accordion type="single" collapsible className="w-full text-left">
                           <AccordionItem value="item-1">
                             <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5" />
                                    <span>Review Your Answers</span>
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
                                                <p className={`p-2 rounded-md ${result.isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                    <span className="font-medium">Your Answer: </span>{result.userAnswer}
                                                </p>
                                                {!result.isCorrect && (
                                                    <p className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                                                        <span className="font-medium">Correct Answer: </span>{result.correctAnswer}
                                                    </p>
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
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
