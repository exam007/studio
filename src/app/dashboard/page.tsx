
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ref, onValue, get, child } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type Exam = {
    id: string;
    name: string;
    questionCount: number;
    year: number; 
}

export default function UserDashboardPage() {
    const { user } = useAuth();
    const [permittedQuizzes, setPermittedQuizzes] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchPermittedQuizzes = async () => {
            setLoading(true);
            try {
                // 1. Get all exams
                const examsSnapshot = await get(ref(db, 'exams'));
                const allExams: Exam[] = examsSnapshot.exists() ? Object.values(examsSnapshot.val()) : [];
                
                // 2. Get all permissions
                const permissionsSnapshot = await get(ref(db, 'permissions'));
                const allPermissions = permissionsSnapshot.exists() ? permissionsSnapshot.val() : {};

                // 3. Filter exams based on user's permission
                const userPermittedExamIds = Object.keys(allPermissions).filter(examId => 
                    allPermissions[examId] && allPermissions[examId].includes(user.uid)
                );

                const quizzes = allExams.filter(exam => userPermittedExamIds.includes(exam.id));
                setPermittedQuizzes(quizzes);

            } catch (error) {
                console.error("Failed to fetch permitted quizzes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermittedQuizzes();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">กำลังโหลดข้อสอบของคุณ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in-50">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">เลือกวิชาเพื่อเริ่มทำข้อสอบ</h1>
                <p className="text-muted-foreground mt-2">เลือกวิชาที่คุณได้รับสิทธิ์ในการทดสอบความรู้ได้จากด้านล่างนี้</p>
            </div>
            <div>
                {permittedQuizzes.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {permittedQuizzes.map(quiz => (
                            <Card key={quiz.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <CardHeader className="p-0">
                                    <Image 
                                        src={`https://picsum.photos/seed/${quiz.id}/600/400`}
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
                        <p className="text-muted-foreground mt-2">คุณยังไม่ได้รับสิทธิ์ให้ทำข้อสอบใดๆ โปรดติดต่อผู้ดูแล</p>
                    </div>
                )}
            </div>
        </div>
    );
}
