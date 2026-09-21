import { GeminiService } from "@/services/gemini-service";
import { Answer, Question, TestResult, UserProfile } from "@/types";
import Constants from "expo-constants";
import { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  answers: Answer[];
  setAnswers: (answers: Answer[]) => void;
  testResult: TestResult | null;
  setTestResult: (result: TestResult | null) => void;
  testHistory: TestResult[];
  addToHistory: (result: TestResult) => void;
  geminiService: GeminiService | null;
  setGeminiService: (service: GeminiService | null) => void;
  apiKey: string;
  resetQuiz: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const apiKey = Constants.expoConfig?.extra?.geminiApiKey || "";

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    age: "",
    disabilities: [],
    preferences: { fontSize: "normal", contrast: "normal" },
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);

  const addToHistory = (result: TestResult) => setTestHistory((prev) => [...prev, result]);

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setTestResult(null);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile, setUserProfile,
        questions, setQuestions,
        answers, setAnswers,
        testResult, setTestResult,
        testHistory, addToHistory,
        geminiService, setGeminiService,
        apiKey,
        resetQuiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
