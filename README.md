# 🧠 E-Kuesioner Adaptif AI

Aplikasi mobile berbasis React Native untuk assessment adaptif yang menentukan passion, gaya belajar, dan potensi karir menggunakan AI (Google Gemini).

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Arsitektur Modul](#arsitektur-modul)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Penggunaan](#cara-penggunaan)
- [Struktur Proyek](#struktur-proyek)

---

## ✨ Fitur Utama

- 🎯 **Assessment Adaptif Berbasis AI** - Pertanyaan disesuaikan dengan profil user
- 📝 **Dual Question Mode**:
  - Essay reflektif untuk user normal
  - Pilihan ganda untuk user dengan disabilitas
- 🧠 **Analisis Komprehensif** - Mengidentifikasi passion, gaya belajar, dan potensi karir
- ♿ **Aksesibilitas Penuh**:
  - Pengaturan ukuran font (Normal, Large, X-Large)
  - Mode kontras tinggi untuk disabilitas visual
  - Format pertanyaan adaptif untuk berbagai disabilitas
- 📊 **Tracking & History** - Menyimpan riwayat semua assessment
- 🎨 **UI/UX Modern** - Interface yang clean, intuitif, dan responsif

---

## 🛠️ Teknologi

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **AI Engine**: Google Gemini 2.0 Flash
- **UI Components**: React Native built-in + Safe Area Context
- **State Management**: React Hooks (useState)
- **API**: Google Generative AI SDK

---

## 🏗️ Arsitektur Modul

### 1. **Core Modules**

#### 📱 `HomeScreen.tsx`
**Komponen Utama Aplikasi**

**Responsibilities:**
- Mengelola navigasi antar screen (Home, Onboarding, Quiz, Result, History)
- State management untuk seluruh aplikasi
- Rendering UI adaptif berdasarkan preferensi user

**Key Features:**
- Multi-screen navigation system
- Responsive font sizing (normal/large/xlarge)
- High contrast mode support
- Progress tracking
- Error handling & validation

**State Management:**
```typescript
- currentScreen: 'home' | 'onboarding' | 'quiz' | 'result' | 'history' | 'settings'
- userProfile: UserProfile
- questions: Question[]
- currentQuestionIndex: number
- answers: Answer[]
- essayAnswer: string
- testResult: TestResult | null
- testHistory: TestResult[]
```

**Main Functions:**
- `startQuiz()` - Inisialisasi quiz dengan generate pertanyaan dari AI
- `handleMultipleChoiceAnswer()` - Handle jawaban pilihan ganda
- `handleEssaySubmit()` - Handle & validasi jawaban essay
- `finishQuiz()` - Analisis jawaban dan generate hasil
- `resetApp()` - Reset state ke kondisi awal
- `toggleDisability()` - Toggle disability options

---

#### 🤖 `gemini-service.ts`
**Service Layer untuk Google Gemini AI**

**Responsibilities:**
- Komunikasi dengan Google Gemini API
- Generate pertanyaan adaptif
- Analisis jawaban user

**Main Methods:**

##### `generateQuestions(userProfile: UserProfile): Promise<Question[]>`
**Generate 15 pertanyaan adaptif berdasarkan profil user**

**Logic Flow:**
```typescript
1. Deteksi disability status
   - Jika ada disability → Multiple Choice (4 options)
   - Jika tidak ada → Essay (open-ended)

2. Generate prompt dengan context:
   - Nama, usia user
   - Kondisi disabilitas
   - Tipe pertanyaan yang sesuai

3. Request ke Gemini API dengan prompt terstruktur

4. Parse JSON response:
   [
     {
       id: number,
       question: string,
       options: string[], // kosong untuk essay
       category: 'passion' | 'learning' | 'personality',
       type: 'essay' | 'multiple-choice'
     }
   ]

5. Return array of questions
```

**Question Distribution:**
- 5 pertanyaan Passion & Interest
- 5 pertanyaan Learning Style
- 5 pertanyaan Personality & Career Fit

##### `analyzeAnswers(userProfile: UserProfile, answers: Answer[]): Promise<TestResult>`
**Analisis jawaban user dan generate hasil assessment**

**Logic Flow:**
```typescript
1. Compile answers summary:
   Q1 (passion): "jawaban user..."
   Q2 (learning): "jawaban user..."
   ...

2. Send to Gemini for analysis

3. Parse JSON response:
   {
     passion: string[],           // 3 passion utama
     learningStyle: string,       // 1 gaya belajar dominan
     careerPotential: string[],   // 4 rekomendasi karir
     recommendations: string,     // 2-3 paragraf penjelasan
     tips: string[],              // 4 tips praktis
     activities: string[]         // 4 aktivitas konkret
   }

4. Return TestResult object
```

**AI Prompt Strategy:**
- Personal & contextual analysis
- Bahasa Indonesia yang supportif
- Rekomendasi spesifik dan actionable
- Mempertimbangkan usia dan kondisi user

---

### 2. **Type Definitions**

#### 📝 `types.ts`
**Type System untuk Type Safety**

**Interfaces:**

```typescript
// Profil lengkap user
export interface UserProfile {
  name: string;
  age: string;
  disabilities: string[];  // Array of disability types
  preferences: {
    fontSize: 'normal' | 'large' | 'xlarge';
    contrast: 'normal' | 'high';
  };
}

// Struktur pertanyaan
export interface Question {
  id: number;
  question: string;
  options: string[];  // Kosong [] untuk essay
  category: string;   // 'passion' | 'learning' | 'personality'
  type: 'multiple-choice' | 'essay';
}

// Jawaban user
export interface Answer {
  questionId: number;
  answer: string;     // Text jawaban (pilihan atau essay)
  category: string;
}

// Hasil assessment
export interface TestResult {
  passion: string[];           // 3 passion utama
  learningStyle: string;       // Dominant learning style
  careerPotential: string[];   // 4 career recommendations
  recommendations: string;     // Detailed analysis
  tips: string[];              // Actionable tips
  activities: string[];        // Concrete activities
}
```

---

### 3. **UI Components**

#### 🎨 `IconSymbol`
**Custom icon component untuk visual elements**

**Usage:**
```typescript
<IconSymbol name="brain.fill" size={48} color="#fff" />
```

---

### 4. **Screen Modules**

#### 🏠 **Home Screen**
**Landing page dengan overview fitur**

**Components:**
- Header dengan branding
- Quick action buttons (Mulai Assessment, Riwayat)
- Feature list showcase

#### 👤 **Onboarding Screen**
**Form input profil user**

**Input Fields:**
- Nama Lengkap (TextInput)
- Usia (Numeric input)
- Kondisi Khusus (Checkbox multiple)
  - Disabilitas Visual
  - Disabilitas Audio
  - Disabilitas Kognitif
  - Disabilitas Motorik

**Validation:**
- Nama & usia wajib diisi
- Info tooltip tentang format pertanyaan

#### 📝 **Quiz Screen**
**Adaptive question interface**

**Features:**
- Progress bar visual
- Question counter (X dari 15)
- Category badge
- Question type indicator

**Dual Mode UI:**

**Essay Mode (No Disability):**
```typescript
- Multiline TextInput (min 150px height)
- Character counter
- Submit button dengan validasi
- Placeholder hint
```

**Multiple Choice Mode (With Disability):**
```typescript
- 4 option buttons (A, B, C, D)
- Auto-proceed on selection
- Clear visual hierarchy
```

#### 🎉 **Result Screen**
**Display assessment results**

**Sections:**
1. **Header Celebration**
   - Success icon
   - Personal greeting

2. **Passion & Interest**
   - Tag chips display
   - Visual grouping

3. **Learning Style**
   - Highlighted card
   - Single dominant style

4. **Career Potential**
   - List of 4 careers
   - Equal visual weight

5. **Recommendations**
   - Detailed paragraph
   - Personal & supportive tone

**Actions:**
- Kembali ke Home
- Tes Lagi (retake)

#### 📊 **History Screen**
**List of past assessments**

**Features:**
- Reverse chronological order
- Assessment numbering
- Learning style badge
- Passion preview
- Empty state handling

---

## 📦 Instalasi

### Prerequisites
```bash
- Node.js >= 16.x
- npm atau yarn
- Expo CLI
- React Native development environment
```

### Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd e-kuesioner-adaptif-ai
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

3. **Install Expo Dependencies**
```bash
npx expo install react-native-safe-area-context
npx expo install @google/generative-ai
```

---

## ⚙️ Konfigurasi

### 1. Google Gemini API Key

Dapatkan API Key dari [Google AI Studio](https://makersuite.google.com/app/apikey)

**Update di `HomeScreen.tsx`:**
```typescript
const service = new GeminiService('YOUR_API_KEY_HERE');
```

**⚠️ Security Note:**
Untuk production, simpan API key di environment variable:

```typescript
// .env
GEMINI_API_KEY=your_key_here

// HomeScreen.tsx
const service = new GeminiService(process.env.GEMINI_API_KEY);
```

### 2. Font Size Configuration

Edit di `HomeScreen.tsx`:
```typescript
const fontSizes = {
  normal: { title: 24, body: 16, button: 16 },
  large: { title: 28, body: 18, button: 18 },
  xlarge: { title: 32, body: 20, button: 20 },
};
```

### 3. Color Theme

```typescript
const colors = {
  primary: isHighContrast ? "#000000" : "#3b82f6",
  secondary: isHighContrast ? "#ffffff" : "#10b981",
  background: isHighContrast ? "#ffffff" : "#f3f4f6",
  text: isHighContrast ? "#000000" : "#1f2937",
  border: isHighContrast ? "#000000" : "#d1d5db",
  card: isHighContrast ? "#ffffff" : "#ffffff",
};
```

---

## 🚀 Cara Penggunaan

### Development Mode

```bash
# Start Expo development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on Web
npx expo start --web
```

### User Flow

```
1. Home Screen
   ↓
2. Tap "Mulai Assessment"
   ↓
3. Onboarding Screen
   - Isi nama & usia
   - Pilih disabilitas (opsional)
   - Tap "Mulai Assessment"
   ↓
4. Quiz Screen (15 pertanyaan)
   - Essay mode: Tulis jawaban → Submit
   - Multiple choice: Pilih opsi (auto-proceed)
   ↓
5. AI Analysis (loading)
   ↓
6. Result Screen
   - Lihat passion, learning style, career potential
   - Baca recommendations
   - Kembali atau Tes Lagi
```

---

## 🎯 Key Features Deep Dive

### Adaptive Question Generation

**Algorithm:**
```typescript
IF user.disabilities.length > 0 THEN
  questionType = "multiple-choice"
  options = ["Option A", "Option B", "Option C", "Option D"]
ELSE
  questionType = "essay"
  options = []
END IF
```

### Accessibility Features

1. **Visual Accessibility**
   - Font size adjustment (3 levels)
   - High contrast mode
   - Clear visual hierarchy

2. **Cognitive Accessibility**
   - Simple language
   - Clear instructions
   - Progress indicators

3. **Motor Accessibility**
   - Large touch targets (24px minimum)
   - Essay mode for fine motor control

### AI Analysis Engine

**Learning Styles Detected:**
- Visual
- Auditory
- Kinesthetic
- Reading-Writing
- Social
- Solitary
- Logical

**Career Matching Algorithm:**
- Cross-reference passion + learning style
- Age-appropriate recommendations
- Diverse career paths (4 options)

---

## 🔒 Data Privacy

- **No server storage**: Data hanya disimpan lokal di device
- **API only**: Komunikasi hanya dengan Google Gemini API
- **User control**: User bisa reset history kapan saja

---

## 🐛 Troubleshooting

### Common Issues

**1. API Key Error**
```
Error: "Gagal generate pertanyaan"
Solution: Periksa API key Anda di HomeScreen.tsx
```

**2. JSON Parse Error**
```
Error: "Invalid response format"
Solution: Gemini response tidak valid, coba lagi
```

**3. Empty Questions Array**
```
Error: Questions.length === 0
Solution: Pastikan API key valid dan ada internet
```

---

## 📝 Development Notes

### Adding New Question Categories

Edit `gemini-service.ts`:
```typescript
// Tambah di distribution
1. CategoryName (5 pertanyaan)
2. Learning style (5 pertanyaan)
3. Personality (5 pertanyaan)
```

### Customizing Question Count

Edit `generateQuestions()`:
```typescript
const prompt = `Generate TEPAT 20 pertanyaan...`; // Ganti 15 → 20
```

### Adding New Disabilities

Edit `HomeScreen.tsx`:
```typescript
["Disabilitas Visual", "Disabilitas Audio", "New Disability"].map(...)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful language model
- React Native community
- Expo team for amazing developer experience

---

## 📞 Support

Untuk pertanyaan atau dukungan:
- Email: support@example.com
- Issues: [GitHub Issues](https://github.com/yourusername/repo/issues)

---

**Made with ❤️ using React Native & Google Gemini AI**