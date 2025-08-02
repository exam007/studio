"use client";

import type { Question, Option } from '@/app/admin/edit-exam/[id]/page';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface QuestionEditorProps {
    question: Question;
    index: number;
    updateQuestion: (id: string, updatedQuestion: Partial<Question>) => void;
    removeQuestion: (id: string) => void;
}

export function QuestionEditor({ question, index, updateQuestion, removeQuestion }: QuestionEditorProps) {
    
    const handleTypeChange = (type: 'mcq' | 'short' | 'tf') => {
        const baseUpdate: Partial<Question> = { type, options: [], correctAnswer: '' };
        if (type === 'mcq') {
            baseUpdate.options = [{ id: uuidv4(), text: '' }, { id: uuidv4(), text: '' }];
        }
        if (type === 'tf') {
            baseUpdate.options = [
                { id: 'true', text: 'True' },
                { id: 'false', text: 'False' }
            ];
            baseUpdate.correctAnswer = 'true';
        }
        updateQuestion(question.id, baseUpdate);
    };

    const handleOptionChange = (optionId: string, text: string) => {
        const newOptions = question.options.map(o => o.id === optionId ? { ...o, text } : o);
        updateQuestion(question.id, { options: newOptions });
    };

    const addOption = () => {
        const newOptions = [...question.options, { id: uuidv4(), text: '' }];
        updateQuestion(question.id, { options: newOptions });
    };

    const removeOption = (optionId: string) => {
        const newOptions = question.options.filter(o => o.id !== optionId);
        updateQuestion(question.id, { options: newOptions });
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4 border-b">
                <h3 className="font-headline font-semibold text-lg">Question {index + 1}</h3>
                <div className="flex items-center gap-4">
                     <Select value={question.type} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="short">Short Answer</SelectItem>
                            <SelectItem value="tf">True/False</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor={`q-text-${question.id}`}>Question Text</Label>
                    <Textarea 
                        id={`q-text-${question.id}`} 
                        placeholder="What is the capital of France?" 
                        value={question.text} 
                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                        className="text-base"
                    />
                </div>

                {question.type === 'mcq' && (
                    <div className="space-y-4">
                        <Label>Options & Correct Answer</Label>
                         <RadioGroup value={question.correctAnswer} onValueChange={(val) => updateQuestion(question.id, { correctAnswer: val })}>
                            {question.options.map((option, idx) => (
                                <div key={option.id} className="flex items-center gap-2">
                                    <RadioGroupItem value={option.id} id={`q-${question.id}-opt-${option.id}`} />
                                    <Input 
                                        placeholder={`Option ${idx + 1}`}
                                        value={option.text} 
                                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => removeOption(option.id)} disabled={question.options.length <= 2}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </RadioGroup>
                        <Button variant="outline" size="sm" onClick={addOption}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Option
                        </Button>
                    </div>
                )}
                
                {question.type === 'tf' && (
                    <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <RadioGroup 
                            className="flex gap-4"
                            value={question.correctAnswer} 
                            onValueChange={(val) => updateQuestion(question.id, { correctAnswer: val })}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id={`q-${question.id}-true`} />
                                <Label htmlFor={`q-${question.id}-true`}>True</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id={`q-${question.id}-false`} />
                                <Label htmlFor={`q-${question.id}-false`}>False</Label>
                            </div>
                        </RadioGroup>
                    </div>
                )}

                {question.type === 'short' && (
                     <div className="space-y-2">
                        <Label htmlFor={`q-ans-${question.id}`}>Correct Answer (for AI grading reference)</Label>
                        <Input 
                            id={`q-ans-${question.id}`} 
                            placeholder="Provide the ideal answer for AI comparison"
                            value={question.correctAnswer} 
                            onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                        />
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
