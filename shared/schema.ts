import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatarSeed: text("avatarSeed").notNull(),
  photo: text("photo"), // Base64 encoded photo data
  totalAttempts: integer("totalAttempts").default(0),
  correctAttempts: integer("correctAttempts").default(0),
});

export const quizAttempts = pgTable("quizAttempts", {
  id: serial("id").primaryKey(),
  studentId: integer("studentId").notNull(),
  correct: boolean("correct").notNull(),
  timeSpent: integer("timeSpent").notNull(), // Time spent in seconds
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  name: true,
  photo: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).pick({
  studentId: true,
  correct: true,
  timeSpent: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

export interface GameState {
  score: number;
  total: number;
  correct: boolean | null;
  currentStudent?: Student;
  choices?: Student[];
  startTime?: number; // Track when question was shown
}

export interface Statistics {
  overallAccuracy: number;
  totalAttempts: number;
  studentStats: {
    student: Student;
    accuracy: number;
    attempts: number;
  }[];
  recentAttempts: QuizAttempt[];
}