import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertQuizAttemptSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/students", async (_req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.get("/api/statistics", async (_req, res) => {
    const stats = await storage.getStatistics();
    res.json(stats);
  });

  app.post("/api/attempts", async (req, res) => {
    try {
      const attempt = insertQuizAttemptSchema.parse(req.body);
      const recorded = await storage.recordAttempt(attempt);
      await storage.updateStudentStats(attempt.studentId, attempt.correct);
      res.json(recorded);
    } catch (error) {
      res.status(400).json({ error: "Invalid attempt data" });
    }
  });

  return createServer(app);
}