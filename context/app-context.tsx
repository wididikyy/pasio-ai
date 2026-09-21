import { GroqService } from "@/services/groq-service";
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
  groqService: GroqService | null;
  setGroqService: (service: GroqService | null) => void;
  apiKey: string;
  resetQuiz: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const apiKey = Constants.expoConfig?.extra?.groqApiKey || "";

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
  const [groqService, setGroqService] = useState<GroqService | null>(null);

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
        groqService, setGroqService,
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
