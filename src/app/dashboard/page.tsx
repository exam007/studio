
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, ArrowRight, BookOpen, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

type Exam = {
    id: string;
    name: string;
    questionCount: number;
    year: number; 
}

const QuizCard = ({ quiz, hasPermission }: { quiz: Exam, hasPermission: boolean }) => (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardHeader className="p-0 relative">
            <Image 
                src={`https://picsum.photos/seed/${quiz.id}/600/400`}
                alt={`ภาพประกอบข้อสอบ ${quiz.name}`}
                width={600}
                height={400}
                className="object-cover"
                data-ai-hint="test pattern"
            />
            {!hasPermission && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-white/80" />
                </div>
            )}
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
                <Button className="w-full justify-center bg-lime-500 hover:bg-lime-600 text-lime-950 font-bold disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed" disabled={!hasPermission}>
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
);

function DashboardPageContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const [allQuizzes, setAllQuizzes] = useState<Exam[]>([]);
    const [permittedQuizIds, setPermittedQuizIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        
        setLoading(true);

        const examsRef = ref(db, 'exams');
        const permissionsRef = ref(db, 'permissions');

        const unsubscribeExams = onValue(examsRef, (snapshot) => {
            const allExamsData: Exam[] = snapshot.exists() ? Object.values(snapshot.val()) : [];
            setAllQuizzes(allExamsData);
            
            // If user is admin, grant all permissions immediately
            if (user.email === 'narongtorn.s@attorney285.co.th') {
                const allIds = new Set(allExamsData.map(q => q.id));
                setPermittedQuizIds(allIds);
                setLoading(false);
            }
        });

        let unsubscribePermissions: () => void;

        if (user.email !== 'narongtorn.s@attorney285.co.th') {
            unsubscribePermissions = onValue(permissionsRef, (snapshot) => {
                const allPermissions = snapshot.exists() ? snapshot.val() : {};
                const userPermittedIds = new Set<string>();
                Object.keys(allPermissions).forEach(examId => {
                    if (allPermissions[examId] && allPermissions[examId].includes(user.uid)) {
                        userPermittedIds.add(examId);
                    }
                });
                setPermittedQuizIds(userPermittedIds);
                setLoading(false);
            }, (error) => {
                console.error("Failed to fetch permissions:", error);
                setLoading(false);
            });
        }

        return () => {
            unsubscribeExams();
            if (unsubscribePermissions) {
                unsubscribePermissions();
            }
        };
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
    
    const permittedQuizzes = allQuizzes.filter(quiz => permittedQuizIds.has(quiz.id));
    const defaultTabValue = tab === 'all-quizzes' ? 'all-quizzes' : 'my-quizzes';

    return (
        <div className="animate-in fade-in-50">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">คลังข้อสอบ</h1>
                <p className="text-muted-foreground mt-2">เลือกทำข้อสอบที่คุณได้รับสิทธิ์ หรือดูข้อสอบทั้งหมดที่มีในระบบ</p>
            </div>
            
            <Tabs defaultValue={defaultTabValue} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto sm:mx-0 sm:max-w-sm mb-6">
                    <TabsTrigger value="my-quizzes">ข้อสอบของคุณ</TabsTrigger>
                    <TabsTrigger value="all-quizzes">ข้อสอบทั้งหมด</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-quizzes">
                    {permittedQuizzes.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {permittedQuizzes.map(quiz => (
                                <QuizCard key={quiz.id} quiz={quiz} hasPermission={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h2 className="text-xl font-semibold">ไม่พบข้อสอบ</h2>
                            <p className="text-muted-foreground mt-2">คุณยังไม่ได้รับสิทธิ์ให้ทำข้อสอบใดๆ โปรดติดต่อผู้ดูแล</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all-quizzes">
                     {allQuizzes.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allQuizzes.map(quiz => (
                                <QuizCard key={quiz.id} quiz={quiz} hasPermission={permittedQuizIds.has(quiz.id)} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h2 className="text-xl font-semibold">ยังไม่มีข้อสอบในระบบ</h2>
                            <p className="text-muted-foreground mt-2">ยังไม่มีข้อสอบใดๆ ถูกสร้างขึ้นในระบบ</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function UserDashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardPageContent />
        </Suspense>
    )
}
