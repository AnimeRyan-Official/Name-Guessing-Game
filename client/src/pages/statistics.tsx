import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, TrendingUp, Users, Share2 } from "lucide-react";
import type { Statistics } from "@shared/schema";
import { ShareButtons } from "@/components/ui/share-buttons";

export default function StatisticsPage() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <p className="text-lg animate-pulse">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Overall Stats */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>Overall Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">
                    {stats?.overallAccuracy.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                  <p className="text-2xl font-bold">{stats?.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Stats */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Student Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.studentStats.map(({ student, accuracy, attempts }) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {attempts} attempts
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{accuracy.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Attempts */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Recent Attempts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentAttempts.map((attempt) => {
                  const student = stats.studentStats.find(
                    (s) => s.student.id === attempt.studentId
                  )?.student;

                  return (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{student?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(attempt.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full ${
                          attempt.correct
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attempt.correct ? "Correct" : "Incorrect"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          {/* Share Progress Card */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <CardTitle>Share Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-4 text-muted-foreground">
                Share your learning progress with others!
              </p>
              <ShareButtons
                title="Name Learning Progress 📊"
                text={`I've completed ${stats?.totalAttempts || 0} name quizzes with ${stats?.overallAccuracy.toFixed(1)}% accuracy!`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}