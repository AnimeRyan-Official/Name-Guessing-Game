import { students, quizAttempts, type Student, type InsertStudent, type QuizAttempt, type InsertQuizAttempt, type Statistics } from "@shared/schema";
import { predefinedStudents } from "@shared/data/students";

export interface IStorage {
  getStudents(): Promise<Student[]>;
  recordAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getStatistics(): Promise<Statistics>;
  updateStudentStats(studentId: number, correct: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student>;
  private attempts: QuizAttempt[];
  private currentId: number;
  private attemptId: number;

  constructor() {
    this.students = new Map();
    this.attempts = [];
    this.currentId = 1;
    this.attemptId = 1;

    // Initialize with predefined students
    predefinedStudents.forEach(predef => {
      const student: Student = {
        id: this.currentId++,
        name: predef.name,
        avatarSeed: Math.random().toString(36).substring(7),
        photo: predef.photo,
        totalAttempts: 0,
        correctAttempts: 0
      };
      this.students.set(student.id, student);
    });
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async recordAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const quizAttempt: QuizAttempt = {
      id: this.attemptId++,
      ...attempt,
      timestamp: new Date(),
    };
    this.attempts.push(quizAttempt);
    return quizAttempt;
  }

  async updateStudentStats(studentId: number, correct: boolean): Promise<void> {
    const student = this.students.get(studentId);
    if (student) {
      student.totalAttempts++;
      if (correct) {
        student.correctAttempts++;
      }
      this.students.set(studentId, student);
    }
  }

  async getStatistics(): Promise<Statistics> {
    const students = Array.from(this.students.values());
    const totalAttempts = this.attempts.length;
    const correctAttempts = this.attempts.filter(a => a.correct).length;

    return {
      overallAccuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0,
      totalAttempts,
      studentStats: students.map(student => ({
        student,
        accuracy: student.totalAttempts > 0 
          ? (student.correctAttempts / student.totalAttempts) * 100 
          : 0,
        attempts: student.totalAttempts
      })),
      recentAttempts: this.attempts.slice(-10).reverse() // Last 10 attempts
    };
  }
}

export const storage = new MemStorage();