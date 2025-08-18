
"use client";

import { QuizTaker } from "@/components/quiz/QuizTaker";
import { BookOpen } from "lucide-react";
import type { Question } from "@/app/admin/edit-exam/[id]/page";
import type { Exam } from "@/components/admin/DashboardContent";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
      const examDetailsString = localStorage.getItem(`exam_details_${id}`);
      const questionsString = localStorage.getItem(`exam_questions_${id}`);

      if (examDetailsString && questionsString) {
        const examDetails: Exam = JSON.parse(examDetailsString);
        const questions: Question[] = JSON.parse(questionsString);

        setQuizData({
          id: examDetails.id,
          title: examDetails.name,
          timeInMinutes: examDetails.timeInMinutes,
          questions: questions,
        });
      }
      setLoading(false);
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
        <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
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
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
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
