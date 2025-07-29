import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, PlusCircle } from "lucide-react";
import Link from "next/link";

const quizzes = [
    { id: '1', title: 'General Knowledge Challenge', questions: 15, time: 20, image: "https://placehold.co/600x400" },
    { id: '2', title: 'Advanced Mathematics', questions: 20, time: 30, image: "https://placehold.co/600x400" },
    { id: '3', title: 'World History Deep Dive', questions: 25, time: 25, image: "https://placehold.co/600x400" },
    { id: '4', title: 'Introduction to Physics', questions: 10, time: 15, image: "https://placehold.co/600x400" },
];

export default function DashboardPage() {
    return (
        <div className="animate-in fade-in-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold">My Quizzes</h1>
                    <p className="text-muted-foreground mt-1">Manage your quizzes or create a new one to begin.</p>
                </div>
                <Link href="/dashboard/create-quiz" passHref>
                    <Button size="lg">
                        <PlusCircle className="mr-2 h-5 w-5"/>
                        Create New Quiz
                    </Button>
                </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {quizzes.map(quiz => (
                    <Card key={quiz.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">{quiz.title}</CardTitle>
                            <CardDescription>A test of your knowledge.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <FileText className="w-4 h-4 mr-2" />
                                <span>{quiz.questions} Questions</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{quiz.time} Minutes</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/quiz/${quiz.id}`} passHref className="w-full">
                                <Button className="w-full" variant="default">Start Quiz</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
