export interface UserProfile {
  name: string;
  age: string;
  disabilities: string[];
  preferences: {
    fontSize: 'normal' | 'large' | 'xlarge';
    contrast: 'normal' | 'high';
  };
}

export interface Question {
  id: number;
  question: string;
  options: string[]; // Kosong untuk essay
  category: string;
  type: 'multiple-choice' | 'essay'; // Tipe pertanyaan
}

export interface Answer {
  questionId: number;
  answer: string;
  category: string;
}

export interface TestResult {
  passion: string[];
  learningStyle: string;
  careerPotential: string[];
  recommendations: string;
  tips: string[];
  activities: string[];
}