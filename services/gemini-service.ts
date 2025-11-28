import { Answer, Question, TestResult, UserProfile } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateQuestions(userProfile: UserProfile): Promise<Question[]> {
    const hasDisability = userProfile.disabilities.length > 0;
    const questionType = hasDisability ? 'multiple-choice' : 'essay';
    
    const disabilityInfo = hasDisability
      ? `User memiliki kondisi: ${userProfile.disabilities.join(
          ", "
        )}. Buat pertanyaan PILIHAN GANDA dengan 4 opsi yang jelas dan mudah dipahami.`
      : "User tidak memiliki kondisi khusus. Buat pertanyaan ESSAY yang mendalam dan reflektif.";

    const formatInstruction = hasDisability
      ? `Setiap pertanyaan HARUS punya 4 pilihan jawaban yang spesifik dan berbeda.`
      : `Setiap pertanyaan adalah ESSAY (options kosong []), user akan menulis jawaban bebas.`;

    const prompt = `Kamu adalah sistem assessment untuk menentukan passion, minat, dan gaya belajar.

PROFIL USER:
- Nama: ${userProfile.name}
- Usia: ${userProfile.age} tahun
- ${disabilityInfo}

TIPE PERTANYAAN: ${questionType.toUpperCase()}

TUGAS: Generate TEPAT 15 pertanyaan adaptive untuk menilai:
1. Passion & interest (5 pertanyaan)
2. Learning style (5 pertanyaan) 
3. Personality & career fit (5 pertanyaan)

ATURAN:
- Gunakan bahasa Indonesia yang sederhana dan jelas
- ${formatInstruction}
${hasDisability 
  ? '- Jawaban harus mencerminkan tipe berbeda (visual, auditory, kinesthetic, logical, social)'
  : '- Pertanyaan harus terbuka dan mendorong refleksi mendalam'
}
- Jangan terlalu teknis atau akademis
- Sesuaikan dengan usia user

FORMAT OUTPUT (HARUS JSON VALID):
[
  {
    "id": 1,
    "question": "pertanyaan di sini",
    "options": ${hasDisability ? '["opsi A", "opsi B", "opsi C", "opsi D"]' : '[]'},
    "category": "passion/learning/personality",
    "type": "${questionType}"
  }
]

${hasDisability 
  ? 'CONTOH PILIHAN GANDA:\n{\n  "id": 1,\n  "question": "Ketika belajar hal baru, cara mana yang paling kamu sukai?",\n  "options": ["Melihat gambar atau video", "Mendengar penjelasan guru", "Praktek langsung", "Membaca buku"],\n  "category": "learning",\n  "type": "multiple-choice"\n}'
  : 'CONTOH ESSAY:\n{\n  "id": 1,\n  "question": "Ceritakan pengalaman yang paling membuatmu bersemangat dalam 6 bulan terakhir. Apa yang membuatnya spesial?",\n  "options": [],\n  "category": "passion",\n  "type": "essay"\n}'
}

OUTPUT HARUS JSON ARRAY SAJA, TANPA PENJELASAN TAMBAHAN.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini");
      }

      const questions: Question[] = JSON.parse(jsonMatch[0]);
      return questions;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw new Error("Gagal membuat pertanyaan. Silakan coba lagi.");
    }
  }

  async analyzeAnswers(
    userProfile: UserProfile,
    answers: Answer[]
  ): Promise<TestResult> {
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

FORMAT OUTPUT (HARUS JSON VALID):
{
  "passion": ["passion 1", "passion 2", "passion 3"],
  "learningStyle": "nama gaya belajar (Visual/Auditory/Kinesthetic/Reading-Writing/Social/Solitary/Logical)",
  "careerPotential": ["karir 1", "karir 2", "karir 3", "karir 4"],
  "recommendations": "penjelasan lengkap 2-3 paragraf tentang hasil assessment ini dan kenapa cocok untuk user",
  "tips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "activities": ["aktivitas 1", "aktivitas 2", "aktivitas 3", "aktivitas 4"]
}

ATURAN:
- Berikan analisis yang personal dan spesifik
- Gunakan bahasa Indonesia yang hangat dan supportif
- Passion harus spesifik (misal: "Desain Grafis", "Pemrograman", "Musik")
- Career harus realistis dan beragam
- Tips harus actionable dan praktis
- Activities harus konkret dan bisa dilakukan

OUTPUT HARUS JSON OBJECT SAJA, TANPA PENJELASAN TAMBAHAN.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini");
      }

      const testResult: TestResult = JSON.parse(jsonMatch[0]);
      return testResult;
    } catch (error) {
      console.error("Error analyzing answers:", error);
      throw new Error("Gagal menganalisis jawaban. Silakan coba lagi.");
    }
  }
}