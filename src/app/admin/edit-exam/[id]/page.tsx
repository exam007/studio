
"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import { QuestionEditor } from "@/components/quiz/QuestionEditor";
import { useToast } from "@/components/ui/use-toast";

export type Option = {
    id: string;
    text: string;
}

export type Question = {
    id: string;
    type: 'mcq' | 'short' | 'tf';
    text: string;
    options: Option[];
    correctAnswer: string;
}

export default function EditExamPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { toast } = useToast();
  const [examName, setExamName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Load exam details and questions from localStorage
    const storedExamDetails = localStorage.getItem(`exam_details_${id}`);
    const storedQuestions = localStorage.getItem(`exam_questions_${id}`);
    
    if (storedExamDetails) {
        const examDetails = JSON.parse(storedExamDetails);
        setExamName(examDetails.name);
    } else {
        setExamName(`ข้อสอบ ${id}`);
    }

    if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
    }
  }, [id]);


  const addQuestion = () => {
    const newQuestion: Question = {
        id: uuidv4(),
        type: 'mcq',
        text: '',
        options: [
            { id: uuidv4(), text: '' },
            { id: uuidv4(), text: '' }
        ],
        correctAnswer: ''
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, updatedQuestion: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSaveChanges = () => {
    // In a real app, this would be an API call. Here, we use localStorage.
    try {
        const examDetails = { 
            id, 
            name: examName, 
            questionCount: questions.length,
            timeInMinutes: 20 // You might want a field for this
        };
        localStorage.setItem(`exam_details_${id}`, JSON.stringify(examDetails));
        localStorage.setItem(`exam_questions_${id}`, JSON.stringify(questions));

        toast({
            title: "บันทึกสำเร็จ",
            description: `ข้อสอบ "${examName}" ได้รับการบันทึกเรียบร้อยแล้ว`,
        });
    } catch (error) {
        console.error("Failed to save to localStorage", error);
        toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถบันทึกการเปลี่ยนแปลงได้",
            variant: "destructive"
        });
    }
  };

  return (
    <div className="animate-in fade-in-50">
        <div className="mb-6">
            <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    กลับไปหน้า Dashboard
                </Button>
            </Link>
            <h1 className="text-3xl font-headline font-bold">แก้ไขข้อสอบ</h1>
            <p className="text-muted-foreground mt-1">
            คุณกำลังแก้ไขข้อสอบ: <span className="font-semibold text-primary">{examName} ({id})</span>
            </p>
      </div>

      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>คำถามทั้งหมด</CardTitle>
                <CardDescription>จัดการคำถาม ตัวเลือก และคำตอบที่ถูกต้อง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {questions.map((q, index) => (
                    <QuestionEditor 
                        key={q.id}
                        index={index}
                        question={q}
                        updateQuestion={updateQuestion}
                        removeQuestion={removeQuestion}
                    />
                ))}
                
                <Button variant="outline" onClick={addQuestion}>
                    <PlusCircle className="mr-2 h-4 w-4"/> เพิ่มคำถามใหม่
                </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Link href="/admin/dashboard">
                <Button variant="outline">ยกเลิก</Button>
            </Link>
            <Button onClick={handleSaveChanges}>บันทึกการเปลี่ยนแปลง</Button>
        </div>
      </div>
    </div>
  );
}
