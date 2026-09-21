import { Answer, Question, TestResult, UserProfile } from "@/types";

const MODEL = "openai/gpt-oss-20b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function groqChat(apiKey: string, content: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content ?? "";
}

function extractJson(text: string, pattern: RegExp): string {
  // handle markdown code blocks: ```json ... ``` or ``` ... ```
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();

  const match = text.match(pattern);
  if (match) return match[0];

  throw new Error("Tidak ada JSON valid dalam response");
}

export class GroqService {
  constructor(private apiKey: string) {}

  async generateQuestions(userProfile: UserProfile): Promise<Question[]> {
    const hasDisability = userProfile.disabilities.length > 0;
    const questionType = hasDisability ? "multiple-choice" : "essay";

    const prompt = `Kamu adalah sistem assessment untuk menentukan passion, minat, dan gaya belajar.

PROFIL USER:
- Nama: ${userProfile.name}
- Usia: ${userProfile.age} tahun
- ${
      hasDisability
        ? `Kondisi: ${userProfile.disabilities.join(", ")}. Buat pertanyaan PILIHAN GANDA dengan 4 opsi.`
        : "Tidak ada kondisi khusus. Buat pertanyaan ESSAY yang reflektif."
    }

TUGAS: Generate TEPAT 15 pertanyaan untuk menilai:
1. Passion & interest (5 pertanyaan)
2. Learning style (5 pertanyaan)
3. Personality & career fit (5 pertanyaan)

ATURAN:
- Bahasa Indonesia, sederhana dan jelas
- ${
      hasDisability
        ? "Setiap pertanyaan HARUS punya 4 pilihan jawaban berbeda."
        : "Pertanyaan essay terbuka, mendorong refleksi mendalam."
    }
- Sesuaikan dengan usia user

FORMAT OUTPUT (JSON ARRAY SAJA, TANPA TEKS LAIN):
[
  {
    "id": 1,
    "question": "pertanyaan di sini",
    "options": ${hasDisability ? '["opsi A", "opsi B", "opsi C", "opsi D"]' : "[]"},
    "category": "passion",
    "type": "${questionType}"
  }
]`;

    const text = await groqChat(this.apiKey, prompt);
    const json = extractJson(text, /\[[\s\S]*\]/);
    return JSON.parse(json) as Question[];
  }

  async analyzeAnswers(userProfile: UserProfile, answers: Answer[]): Promise<TestResult> {
    const answersSummary = answers
      .map((a) => `Q${a.questionId} (${a.category}): ${a.answer}`)
      .join("\n");

    const prompt = `Kamu adalah AI career counselor dan learning style expert.

PROFIL USER:
- Nama: ${userProfile.name}
- Usia: ${userProfile.age} tahun
- Kondisi: ${userProfile.disabilities.join(", ") || "Tidak ada"}

JAWABAN USER:
${answersSummary}

TUGAS: Analisis jawaban dan berikan assessment lengkap.

FORMAT OUTPUT (JSON OBJECT SAJA, TANPA TEKS LAIN):
{
  "passion": ["passion 1", "passion 2", "passion 3"],
  "learningStyle": "Visual/Auditory/Kinesthetic/Reading-Writing/Social/Solitary/Logical",
  "careerPotential": ["karir 1", "karir 2", "karir 3", "karir 4"],
  "recommendations": "penjelasan 2-3 paragraf yang personal dan supportif",
  "tips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "activities": ["aktivitas 1", "aktivitas 2", "aktivitas 3", "aktivitas 4"]
}`;

    const text = await groqChat(this.apiKey, prompt);
    const json = extractJson(text, /\{[\s\S]*\}/);
    return JSON.parse(json) as TestResult;
  }
}
