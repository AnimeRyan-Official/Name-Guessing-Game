import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Student } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayCircle, Users, ChartBar } from "lucide-react";

export default function Home() {
  const { data: students, isLoading } = useQuery<Student[]>({ 
    queryKey: ["/api/students"]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted animate-in fade-in duration-700">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="py-12 mb-8 text-center animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:scale-[1.02] transition-transform">
            Name Learning Game
          </h1>
          <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Practice remembering student names and ace your classroom management!
          </p>
        </div>

        {students && students.length >= 3 && (
          <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <PlayCircle className="h-5 w-5" />
                  Start Quiz Game
                </Button>
              </Link>
              <Link href="/statistics">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ChartBar className="h-5 w-5" />
                  View Statistics
                </Button>
              </Link>
            </div>
          </div>
        )}

        <Card className="shadow-xl border-2 transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Student List</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground animate-pulse">
                Loading students...
              </p>
            ) : students?.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No students available
              </p>
            ) : (
              <div className="grid gap-3">
                {students?.map((student, index) => (
                  <div 
                    key={student.id} 
                    className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20 transition-transform duration-300 hover:scale-110">
                        {student.photo ? (
                          <AvatarImage src={student.photo} alt={student.name} />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {student.name[0].toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}