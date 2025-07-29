import { QuizTaker } from "@/components/quiz/QuizTaker";
import { BookOpen } from "lucide-react";

// This would typically be fetched from a database based on the [id]
const MOCK_QUIZ_DATA = {
  id: '1',
  title: 'General Knowledge Challenge',
  timeInMinutes: 20,
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
    },
    {
      id: 'q2',
      type: 'tf',
      text: 'The Great Wall of China is visible from the moon with the naked eye.',
      options: [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' },
      ],
    },
    {
      id: 'q3',
      type: 'short',
      text: 'Which planet is known as the Red Planet?',
    },
    {
        id: 'q4',
        type: 'mcq',
        text: 'Who wrote the play "Romeo and Juliet"?',
        options: [
          { id: 'q4o1', text: 'Charles Dickens' },
          { id: 'q4o2', text: 'William Shakespeare' },
          { id: 'q4o3', text: 'Jane Austen' },
          { id: 'q4o4', text: 'Mark Twain' },
        ],
      },
  ],
};


export default function TakeQuizPage({ params }: { params: { id: string } }) {
  // In a real app, you would use params.id to fetch quiz data.
  // For this example, we use mock data.
  const quiz = MOCK_QUIZ_DATA;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
            <header className="text-center mb-8">
                <div className="flex justify-center items-center mb-4">
                    <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-headline font-bold">{quiz.title}</h1>
                <p className="text-muted-foreground mt-2">Answer the questions below. Good luck!</p>
            </header>
            <QuizTaker quiz={quiz} />
        </div>
    </div>
  );
}
