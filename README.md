# E-Kuesioner Adaptif AI (pasio-ai)

Aplikasi mobile berbasis React Native untuk assessment adaptif yang menentukan passion, gaya belajar, dan potensi karir menggunakan AI (Groq).

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Penggunaan](#cara-penggunaan)
- [Arsitektur](#arsitektur)

---

## Fitur Utama

- **Assessment Adaptif Berbasis AI** — Pertanyaan disesuaikan dengan profil user
- **Dual Question Mode**:
  - Essay reflektif untuk user normal
  - Pilihan ganda untuk user dengan disabilitas
- **Analisis Komprehensif** — Mengidentifikasi passion, gaya belajar, dan potensi karir
- **Aksesibilitas Penuh**:
  - Pengaturan ukuran font (Normal, Large, X-Large)
  - Mode kontras tinggi untuk disabilitas visual
  - Format pertanyaan adaptif untuk berbagai disabilitas
- **Tracking & History** — Menyimpan riwayat semua assessment
- **UI/UX Modern** — Interface yang clean, intuitif, dan responsif

---

## Teknologi

| Teknologi | Versi |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54.0.25 |
| Expo Router | ~6.0.15 |
| TypeScript | ~5.9.2 |
| React | 19.1.0 |
| Groq SDK | ^1.6.0 |
| AI Model | `openai/gpt-oss-20b` via Groq |

---

## Struktur Proyek

```
pasio-ai/
├── app/
│   ├── _layout.tsx          # Root layout (AppProvider)
│   ├── index.tsx            # Home Screen
│   ├── onboarding.tsx       # Input profil user
│   ├── quiz.tsx             # Pertanyaan adaptif
│   ├── result.tsx           # Hasil assessment
│   ├── history.tsx          # Riwayat tes
│   ├── settings.tsx         # Pengaturan aksesibilitas
│   └── (tabs)/              # Tab navigasi (hidden)
├── context/
│   └── app-context.tsx      # Global state (React Context)
├── services/
│   └── groq-service.ts      # Integrasi Groq AI API
├── types/
│   └── index.ts             # TypeScript interfaces
├── hooks/
│   ├── use-theme.ts         # Hook tema & font size
│   └── use-color-scheme.ts  # Hook dark/light mode
├── constants/
│   └── theme.ts             # Warna & font constants
└── components/              # UI components reusable
```

---

## Instalasi

### Prerequisites

- Node.js >= 18.x
- npm atau yarn
- Expo CLI (`npm install -g expo-cli`)
- Aplikasi Expo Go di device (opsional, untuk testing)

### Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd pasio-ai
```

2. **Install Dependencies**
```bash
npm install
```

3. **Konfigurasi API Key** (lihat bagian [Konfigurasi](#konfigurasi))

4. **Jalankan Aplikasi**
```bash
npx expo start
```

---

## Konfigurasi

### Groq API Key

Dapatkan API key gratis dari [console.groq.com](https://console.groq.com).

Buat file `app.config.js` atau tambahkan ke `app.json`:

```js
// app.config.js
export default {
  expo: {
    name: "pasio-ai",
    // ...
    extra: {
      groqApiKey: "your_groq_api_key_here",
    },
  },
};
```

API key dibaca otomatis di `context/app-context.tsx` via `expo-constants`:

```typescript
const apiKey = Constants.expoConfig?.extra?.groqApiKey || "";
```

> **Security Note:** Untuk production, gunakan environment variable dan jangan commit API key ke repository.

---

## Cara Penggunaan

### Development

```bash
# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web
npx expo start --web
```

### User Flow

```
Home Screen
  ↓ Tap "Mulai Assessment"
Onboarding Screen
  - Isi nama & usia
  - Pilih disabilitas (opsional)
  ↓ Tap "Mulai Assessment"
Quiz Screen (15 pertanyaan)
  - Essay mode: Tulis jawaban → Submit
  - Multiple choice: Pilih opsi (auto-proceed)
  ↓ AI Analysis
Result Screen
  - Passion, learning style, career potential
  - Rekomendasi personal
  ↓ Kembali atau Tes Lagi
History Screen (opsional)
  - Lihat semua riwayat assessment
```

---

## Arsitektur

### State Management

State global dikelola via React Context di `context/app-context.tsx`:

```typescript
interface AppContextType {
  userProfile: UserProfile;       // Profil & preferensi user
  questions: Question[];          // 15 pertanyaan dari AI
  answers: Answer[];              // Jawaban user
  testResult: TestResult | null;  // Hasil assessment
  testHistory: TestResult[];      // Riwayat semua tes
  groqService: GroqService | null;
}
```

### AI Service (`services/groq-service.ts`)

**`generateQuestions(userProfile)`** — Generate 15 pertanyaan adaptif:
- User tanpa disabilitas → Essay (pertanyaan terbuka)
- User dengan disabilitas → Multiple choice (4 opsi)
- Distribusi: 5 passion, 5 learning style, 5 personality

**`analyzeAnswers(userProfile, answers)`** — Analisis jawaban dan hasilkan:
```typescript
{
  passion: string[];          // 3 passion utama
  learningStyle: string;      // Gaya belajar dominan
  careerPotential: string[];  // 4 rekomendasi karir
  recommendations: string;    // Analisis personal
  tips: string[];             // 4 tips praktis
  activities: string[];       // 4 aktivitas konkret
}
```

### Aksesibilitas

Dikelola via `settings.tsx` dan `hooks/use-theme.ts`:

| Fitur | Opsi |
|---|---|
| Ukuran font | Normal / Large / X-Large |
| Kontras warna | Normal / High |
| Tipe pertanyaan | Essay / Multiple choice (otomatis) |

---

## Troubleshooting

**API Key Error**
```
Error: "Gagal generate pertanyaan"
```
Pastikan `groqApiKey` sudah diisi di `app.config.js` dan nilainya valid.

**JSON Parse Error**
```
Error: "Tidak ada JSON valid dalam response"
```
Response dari Groq tidak valid. Coba lagi atau periksa koneksi internet.

**Questions Array Kosong**
Pastikan API key valid, ada koneksi internet, dan model `openai/gpt-oss-20b` tersedia di akun Groq Anda.

---

## Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/NamaFitur`)
3. Commit perubahan (`git commit -m 'feat: tambah NamaFitur'`)
4. Push ke branch (`git push origin feature/NamaFitur`)
5. Buat Pull Request

---

## License

MIT License

---

**Made with React Native, Expo, and Groq AI**
