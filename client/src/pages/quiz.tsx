import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Student, type GameState, type InsertQuizAttempt } from "@shared/schema";
import { CheckCircle2, XCircle, ArrowLeft, Trophy } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ShareButtons } from "@/components/ui/share-buttons";

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function Quiz() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    total: 0,
    correct: null,
    startTime: Date.now()
  });

  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"]
  });

  const recordAttemptMutation = useMutation({
    mutationFn: async (attempt: InsertQuizAttempt) => {
      await apiRequest("POST", "/api/attempts", attempt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
  });

  const setupNextQuestion = useCallback(() => {
    if (!students || students.length < 3) return;

    const currentStudent = students[Math.floor(Math.random() * students.length)];
    const otherStudents = students.filter(s => s.id !== currentStudent.id);
    const choices = shuffleArray([
      currentStudent,
      ...shuffleArray(otherStudents).slice(0, 2)
    ]);

    setGameState(prev => ({
      ...prev,
      currentStudent,
      choices,
      correct: null,
      startTime: Date.now()
    }));
  }, [students]);

  // Initialize quiz when we have students
  useEffect(() => {
    if (students && students.length >= 3 && !gameState.currentStudent) {
      setupNextQuestion();
    }
  }, [students, setupNextQuestion, gameState.currentStudent]);

  const handleAnswer = async (student: Student) => {
    if (!gameState.currentStudent || !gameState.startTime) return;

    const correct = student.id === gameState.currentStudent.id;
    const timeSpent = Math.floor((Date.now() - gameState.startTime) / 1000);

    setGameState(prev => ({
      ...prev,
      score: prev.score + (correct ? 1 : 0),
      total: prev.total + 1,
      correct
    }));

    // Record the attempt
    await recordAttemptMutation.mutateAsync({
      studentId: gameState.currentStudent.id,
      correct,
      timeSpent
    });
  };

  const handleNext = () => {
    setupNextQuestion();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <p className="text-lg animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  if (!students || students.length < 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto p-4 max-w-2xl">
          <Card className="shadow-xl">
            <CardContent className="pt-6 text-center">
              <p className="mb-4 text-lg">Add at least 3 students to start the quiz!</p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 shadow hover:shadow-md transition-all">
              <ArrowLeft className="h-4 w-4" />
              Exit Quiz
            </Button>
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full shadow">
            <Trophy className="h-4 w-4 text-primary" />
            <p className="font-medium">Score: {gameState.score}/{gameState.total}</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Name Quiz
          </h1>
        </div>

        <Card className="shadow-xl border-2 transition-all">
          <CardContent className="pt-6 text-center">
            {gameState.currentStudent && (
              <>
                <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20 shadow-xl">
                  {gameState.currentStudent.photo ? (
                    <AvatarImage src={gameState.currentStudent.photo} alt="Student" />
                  ) : (
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                      {gameState.currentStudent.name[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="space-y-4">
                  {gameState.choices?.map((student) => (
                    <Button
                      key={student.id}
                      className={`w-full text-lg transition-all ${
                        gameState.correct !== null
                          ? student.id === gameState.currentStudent?.id
                            ? "bg-primary hover:bg-primary"
                            : "bg-muted hover:bg-muted"
                          : ""
                      }`}
                      variant={gameState.correct !== null
                        ? student.id === gameState.currentStudent?.id
                          ? "default"
                          : "outline"
                        : "outline"
                      }
                      disabled={gameState.correct !== null}
                      onClick={() => handleAnswer(student)}
                    >
                      {student.name}
                    </Button>
                  ))}
                </div>

                {gameState.correct !== null && (
                  <div className="mt-6 space-y-4">
                    {gameState.correct ? (
                      <div className="flex items-center justify-center gap-2 text-green-600 animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Correct!</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-red-600 animate-in fade-in slide-in-from-bottom-4">
                        <XCircle className="h-5 w-5" />
                        <span className="font-medium">Wrong answer</span>
                      </div>
                    )}
                    <Button
                      onClick={handleNext}
                      className="shadow hover:shadow-md transition-all"
                    >
                      Next Question
                    </Button>
                    {gameState.total > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-center mb-4 text-muted-foreground">
                          Share your progress!
                        </p>
                        <ShareButtons
                          title="Name Learning Quiz Results 🎓"
                          text={`I scored ${gameState.score}/${gameState.total} (${Math.round((gameState.score/gameState.total) * 100)}%) in the name learning quiz!`}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}