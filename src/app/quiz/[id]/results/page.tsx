
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Home, XCircle, Check, HelpCircle, Info } from "lucide-react";
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
      explanation: 'Tokyo is indeed the capital of Japan, known for its Imperial Palace and numerous shrines and temples.',
    },
    {
      questionId: 'q2',
      questionText: 'The Great Wall of China is visible from the moon with the naked eye.',
      userAnswer: 'True',
      correctAnswer: 'False',
      isCorrect: false,
      explanation: 'This is a common misconception. The Great Wall is not visible from space, and certainly not from the moon, without aid.',
    },
    {
      questionId: 'q3',
      questionText: 'Which planet is known as the Red Planet?',
      userAnswer: 'Mars',
      correctAnswer: 'Mars',
      isCorrect: true,
      explanation: 'Mars is called the Red Planet because of the reddish iron oxide prevalent on its surface.',
    },
    {
      questionId: 'q4',
      questionText: 'Who wrote the play "Romeo and Juliet"?',
      userAnswer: 'Jane Austen',
      correctAnswer: 'William Shakespeare',
      isCorrect: false,
      explanation: '"Romeo and Juliet" is a tragedy written by William Shakespeare early in his career.',
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
                                                <p className={`p-3 rounded-md border-l-4 ${result.isCorrect ? 'bg-green-100/50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-100/50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-200'}`}>
                                                    <span className="font-medium">Your Answer: </span>{result.userAnswer}
                                                </p>
                                                {!result.isCorrect && (
                                                    <p className="p-3 rounded-md bg-green-100/50 border-l-4 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200">
                                                        <span className="font-medium">Correct Answer: </span>{result.correctAnswer}
                                                    </p>
                                                )}
                                                 <div className="mt-3 p-3 rounded-md bg-blue-100/50 border-l-4 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
                                                    <div className="flex items-start gap-2">
                                                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-300"/>
                                                        <div>
                                                           <h4 className="font-medium mb-1">Explanation</h4>
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
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
