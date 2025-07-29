"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuestionEditor } from '@/components/quiz/QuestionEditor';

export type Option = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  type: 'mcq' | 'short' | 'tf';
  text: string;
  options: Option[];
  correctAnswer: string;
};


export default function CreateQuizPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        id: crypto.randomUUID(), 
        type: 'mcq', 
        text: '', 
        options: [
            { id: crypto.randomUUID(), text: '' },
            { id: crypto.randomUUID(), text: '' },
        ], 
        correctAnswer: '' 
      }
    ]);
  };

  const updateQuestion = (id: string, updatedQuestion: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updatedQuestion } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSaveQuiz = () => {
    // Here you would typically save the quiz data to your backend
    console.log({ title, description, questions });
    toast({
      title: "Quiz Saved!",
      description: "Your new quiz has been successfully created.",
      variant: 'default',
    });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in-50">
      <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-bold">Create a New Quiz</h1>
            <p className="text-muted-foreground mt-1">Fill in the details below to create your quiz.</p>
        </div>

        <div className="space-y-4 p-6 border rounded-lg bg-card">
            <div className="space-y-2">
                <Label htmlFor="quiz-title" className="text-lg">Quiz Title</Label>
                <Input id="quiz-title" placeholder="e.g., European Capitals" value={title} onChange={(e) => setTitle(e.target.value)} className="text-base" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="quiz-description" className="text-lg">Description</Label>
                <Textarea id="quiz-description" placeholder="A short description of your quiz" value={description} onChange={(e) => setDescription(e.target.value)} className="text-base" />
            </div>
        </div>

        {questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            index={index}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
          />
        ))}

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={addQuestion}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
            </Button>
            <Button size="lg" onClick={handleSaveQuiz} disabled={!title || questions.length === 0}>
                <Save className="mr-2 h-4 w-4" />
                Save Quiz
            </Button>
        </div>
      </div>
    </div>
  );
}
