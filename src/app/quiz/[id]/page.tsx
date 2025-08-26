
"use client";

import { QuizTaker } from "@/components/quiz/QuizTaker";
import { BookOpen } from "lucide-react";
import type { Question } from "@/app/admin/edit-exam/[id]/page";
import type { ExamDetails } from "@/app/admin/edit-exam/[id]/page";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";


type QuizData = {
  id: string;
  title: string;
  timeInMinutes: number;
  questions: Question[];
}

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const examRef = ref(db, `exams/${id}`);
        get(examRef).then((snapshot) => {
            if (snapshot.exists()) {
                const examDetails: ExamDetails = snapshot.val();
                setQuizData({
                    id: examDetails.id,
                    title: examDetails.name,
                    timeInMinutes: examDetails.timeInMinutes,
                    questions: examDetails.questions || [],
                });
            }
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">กำลังโหลดข้อสอบ...</p>
        </div>
      </div>
    );
  }

  if (!quizData || quizData.questions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-background p-4 sm:p-6 lg:p-8">
             <div className="w-full max-w-4xl text-center">
                 <div className="flex justify-center items-center mb-4">
                    <BookOpen className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="text-4xl font-headline font-bold">ไม่พบข้อสอบ</h1>
                <p className="text-muted-foreground mt-2">ไม่พบข้อมูลข้อสอบสำหรับรหัสนี้ หรือยังไม่มีคำถามในข้อสอบ</p>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
            <header className="text-center mb-8">
                <div className="flex justify-center items-center mb-4">
                    <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-headline font-bold">{quizData.title}</h1>
                <p className="text-muted-foreground mt-2">ตั้งใจทำข้อสอบ ขอให้โชคดี!</p>
            </header>
            <QuizTaker quiz={quizData} />
        </div>
    </div>
  );
}
