import { useState, useCallback } from "react";
import { modules } from "@/data/courseData";

const STORAGE_KEY_COMPLETED = "lp_completed_lessons";
const STORAGE_KEY_QUESTIONS = "lp_questions_answered";
const STORAGE_KEY_QUIZ_SCORES = "lp_quiz_scores";

function loadSet(key: string): Set<string> {
  try {
    const data = localStorage.getItem(key);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function loadNumber(key: string): number {
  return Number(localStorage.getItem(key) || "0");
}

function loadScores(): Record<string, number> {
  try {
    const data = localStorage.getItem(STORAGE_KEY_QUIZ_SCORES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => loadSet(STORAGE_KEY_COMPLETED));
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(() => loadNumber(STORAGE_KEY_QUESTIONS));
  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => loadScores());

  const markLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.add(lessonId);
      saveSet(STORAGE_KEY_COMPLETED, next);
      return next;
    });
  }, []);

  const addQuestionsAnswered = useCallback((count: number) => {
    setQuestionsAnswered((prev) => {
      const next = prev + count;
      localStorage.setItem(STORAGE_KEY_QUESTIONS, String(next));
      return next;
    });
  }, []);

  const saveQuizScore = useCallback((moduleId: string, percent: number) => {
    setQuizScores((prev) => {
      const next = { ...prev, [moduleId]: percent };
      localStorage.setItem(STORAGE_KEY_QUIZ_SCORES, JSON.stringify(next));
      return next;
    });
  }, []);

  const getModuleCompletedCount = useCallback((moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return 0;
    return mod.lessons.filter((l) => completedLessons.has(l.id)).length;
  }, [completedLessons]);

  const getQuizScore = useCallback((moduleId: string): number | null => {
    return quizScores[moduleId] ?? null;
  }, [quizScores]);

  return {
    completedLessons,
    questionsAnswered,
    markLessonComplete,
    addQuestionsAnswered,
    saveQuizScore,
    getModuleCompletedCount,
    getQuizScore,
  };
}
