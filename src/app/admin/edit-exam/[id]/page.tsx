
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
// We'll need a QuestionEditor component
// import { QuestionEditor } from "@/components/quiz/QuestionEditor";

// Mock data - In a real app, this would be fetched based on params.id
const MOCK_EXAM_DATA = {
  id: 'EXM001',
  name: 'General Knowledge Challenge',
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      text: 'What is the capital of Japan?',
      options: [
        { id: 'q1o1', text: 'Beijing' },
        { id: 'q1o2', text: 'Seoul' },
        { id: 'q1o3', text: 'Tokyo' },
        { id: 'q1o4', text: 'Bangkok' },
      ],
      correctAnswer: 'q1o3'
    },
    {
      id: 'q2',
      type: 'tf',
      text: 'The Great Wall of China is visible from the moon.',
      options: [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' },
      ],
      correctAnswer: 'false'
    },
  ]
};

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
  const [examName, setExamName] = useState(MOCK_EXAM_DATA.name);
  const [questions, setQuestions] = useState<Question[]>(MOCK_EXAM_DATA.questions);

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
    // Here you would send the updated exam data (examName, questions) to your backend
    console.log("Saving changes for exam:", { id, name: examName, questions });
    alert("Changes saved to console!");
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
            คุณกำลังแก้ไขข้อสอบ: <span className="font-semibold text-primary">{MOCK_EXAM_DATA.name} ({id})</span>
            </p>
      </div>

      <div className="space-y-8">
        {/*
        <Card>
            <CardHeader>
                <CardTitle>รายละเอียดข้อสอบ</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="exam-name">ชื่อข้อสอบ</Label>
                    <Input 
                        id="exam-name" 
                        value={examName} 
                        onChange={(e) => setExamName(e.target.value)} 
                    />
                </div>
            </CardContent>
        </Card>
        */}

        <Card>
            <CardHeader>
                <CardTitle>คำถามทั้งหมด</CardTitle>
                <CardDescription>จัดการคำถาม ตัวเลือก และคำตอบที่ถูกต้อง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* {questions.map((q, index) => (
                    <QuestionEditor 
                        key={q.id}
                        index={index}
                        question={q}
                        updateQuestion={updateQuestion}
                        removeQuestion={removeQuestion}
                    />
                ))} */}
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">ส่วนสำหรับแก้ไขคำถามจะถูกพัฒนาในขั้นตอนถัดไป</p>
                </div>
                <Button variant="outline" onClick={addQuestion}>
                    <PlusCircle className="mr-2 h-4 w-4"/> เพิ่มคำถามใหม่
                </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button variant="outline">ยกเลิก</Button>
            <Button onClick={handleSaveChanges}>บันทึกการเปลี่ยนแปลง</Button>
        </div>
      </div>
    </div>
  );
}

    