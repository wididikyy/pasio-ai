import { IconSymbol } from "@/components/ui/icon-symbol";
import { GeminiService } from "@/services/gemini-service";
import { Answer, Question, TestResult, UserProfile } from "@/types";
import Constants from 'expo-constants';
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const API_KEY = Constants.expoConfig?.extra?.geminiApiKey || '';
    
    const [currentScreen, setCurrentScreen] = useState<
        "home" | "onboarding" | "quiz" | "result" | "history" | "settings"
    >("home");
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: "",
        age: "",
        disabilities: [],
        preferences: {
            fontSize: "normal",
            contrast: "normal",
        },
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [essayAnswer, setEssayAnswer] = useState(""); // State untuk jawaban essay
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
    const [testHistory, setTestHistory] = useState<TestResult[]>([]);

    // Font sizes
    const fontSizes = {
        normal: { title: 24, body: 16, button: 16 },
        large: { title: 28, body: 18, button: 18 },
        xlarge: { title: 32, body: 20, button: 20 },
    };

    const currentFontSize = fontSizes[userProfile.preferences.fontSize];
    const isHighContrast = userProfile.preferences.contrast === "high";

    // Colors
    const colors = {
        primary: isHighContrast ? "#000000" : "#3b82f6",
        secondary: isHighContrast ? "#ffffff" : "#10b981",
        background: isHighContrast ? "#ffffff" : "#f3f4f6",
        text: isHighContrast ? "#000000" : "#1f2937",
        border: isHighContrast ? "#000000" : "#d1d5db",
        card: isHighContrast ? "#ffffff" : "#ffffff",
    };

    const startQuiz = async () => {
        if (!userProfile.name || !userProfile.age) {
            setError("Lengkapi data profil terlebih dahulu");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const service = new GeminiService(API_KEY);
            setGeminiService(service);

            const generatedQuestions = await service.generateQuestions(userProfile);
            setQuestions(generatedQuestions);
            setCurrentQuestionIndex(0);
            setAnswers([]);
            setEssayAnswer(""); // Reset essay answer
            setCurrentScreen("quiz");
        } catch (err) {
            setError("Gagal generate pertanyaan. Periksa API Key Anda.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMultipleChoiceAnswer = (option: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const newAnswer: Answer = {
            questionId: currentQuestion.id,
            answer: option,
            category: currentQuestion.category,
        };

        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz(updatedAnswers);
        }
    };

    const handleEssaySubmit = () => {
        if (!essayAnswer.trim()) {
            setError("Mohon isi jawaban terlebih dahulu");
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const newAnswer: Answer = {
            questionId: currentQuestion.id,
            answer: essayAnswer.trim(),
            category: currentQuestion.category,
        };

        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        setEssayAnswer(""); // Reset essay input
        setError("");

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz(updatedAnswers);
        }
    };

    const finishQuiz = async (finalAnswers: Answer[]) => {
        setLoading(true);
        setError("");

        try {
            if (!geminiService) throw new Error("Service not initialized");

            const result = await geminiService.analyzeAnswers(userProfile, finalAnswers);
            setTestResult(result);
            setTestHistory([...testHistory, result]);
            setCurrentScreen("result");
        } catch (err) {
            setError("Gagal menganalisis jawaban. Coba lagi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetApp = () => {
        setCurrentScreen("home");
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setEssayAnswer("");
        setTestResult(null);
        setError("");
    };

    const toggleDisability = (disability: string) => {
        if (userProfile.disabilities.includes(disability)) {
            setUserProfile({
                ...userProfile,
                disabilities: userProfile.disabilities.filter((d) => d !== disability),
            });
        } else {
            setUserProfile({
                ...userProfile,
                disabilities: [...userProfile.disabilities, disability],
            });
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: 20,
        },
        header: {
            backgroundColor: colors.primary,
            borderRadius: 16,
            padding: 40,
            alignItems: "center",
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: currentFontSize.title + 8,
            fontWeight: "bold",
            color: "#fff",
            marginTop: 16,
            textAlign: "center",
        },
        headerSubtitle: {
            fontSize: currentFontSize.body,
            color: "#fff",
            marginTop: 12,
            opacity: 0.9,
            textAlign: "center",
        },
        card: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: colors.border,
        },
        label: {
            fontSize: currentFontSize.body,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 8,
        },
        input: {
            width: "100%",
            padding: 12,
            fontSize: currentFontSize.body,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 8,
            backgroundColor: "#fff",
            color: colors.text,
        },
        essayInput: {
            width: "100%",
            padding: 16,
            fontSize: currentFontSize.body,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 8,
            backgroundColor: "#fff",
            color: colors.text,
            minHeight: 150,
            textAlignVertical: "top",
        },
        buttonRow: {
            flexDirection: "row",
            gap: 16,
            marginBottom: 16,
        },
        quickbuttonRow: {
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
        },
        button: {
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 24,
            alignItems: "center",
        },
        buttonSecondary: {
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 24,
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.border,
        },
        buttonText: {
            fontSize: currentFontSize.button,
            fontWeight: "600",
            color: "#fff",
            marginTop: 12,
        },
        buttonTextSecondary: {
            fontSize: currentFontSize.button,
            fontWeight: "600",
            color: colors.text,
            marginTop: 12,
        },
        featureItem: {
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 12,
        },
        featureText: {
            fontSize: currentFontSize.body,
            color: colors.text,
        },
        errorBox: {
            backgroundColor: "#fee2e2",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
        },
        errorText: {
            color: "#dc2626",
            fontSize: currentFontSize.body,
        },
        checkboxRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 4,
            marginRight: 8,
            alignItems: "center",
            justifyContent: "center",
        },
        checkboxChecked: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        progressBar: {
            width: "100%",
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
            overflow: "hidden",
            marginTop: 8,
        },
        progressFill: {
            height: "100%",
            backgroundColor: colors.primary,
        },
        optionButton: {
            backgroundColor: colors.card,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
        },
        optionText: {
            fontSize: currentFontSize.body,
            color: colors.text,
        },
        tag: {
            backgroundColor: colors.primary,
            color: "#fff",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
        },
        tagText: {
            color: "#fff",
            fontSize: currentFontSize.body,
        },
        submitButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            marginTop: 16,
        },
        submitButtonText: {
            fontSize: currentFontSize.button,
            fontWeight: "600",
            color: "#fff",
        },
        charCounter: {
            fontSize: currentFontSize.body - 2,
            color: colors.text,
            textAlign: "right",
            marginTop: 8,
            opacity: 0.6,
        },
    });

    // Home Screen
    if (currentScreen === "home") {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <IconSymbol name="brain.fill" size={48} color="#fff" />
                        <Text style={styles.headerTitle}>E-Kuesioner Adaptif AI</Text>
                        <Text style={styles.headerSubtitle}>
                            Temukan passion, gaya belajar, dan potensi karir Anda dengan AI
                        </Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickbuttonRow}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setCurrentScreen("onboarding")}
                        >
                            <IconSymbol name="brain.fill" size={32} color="#fff" />
                            <Text style={styles.buttonText}>Mulai Assessment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonSecondary}
                            onPress={() => setCurrentScreen("history")}
                        >
                            <IconSymbol name="chart.bar.fill" size={32} color={colors.text} />
                            <Text style={styles.buttonTextSecondary}>
                                Riwayat Tes ({testHistory.length})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonSecondary}
                            onPress={() => setCurrentScreen("settings")}
                        >
                            <IconSymbol name="gear" size={32} color={colors.text} />
                            <Text style={styles.buttonTextSecondary}>Pengaturan</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Features */}
                    <View style={{ marginTop: 16 }}>
                        <Text style={{ fontSize: currentFontSize.title, marginBottom: 16, color: colors.text }}>
                            ✨ Fitur Utama
                        </Text>
                        {[
                            "🎯 Assessment adaptif berbasis AI",
                            "📝 Essay untuk user normal, pilihan ganda untuk disabilitas",
                            "🧠 Analisis passion & gaya belajar",
                            "💼 Rekomendasi karir personal",
                            "♿ Aksesibilitas penuh (font, kontras)",
                            "📊 Tracking progress & riwayat",
                        ].map((feature, i) => (
                            <View key={i} style={styles.featureItem}>
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Onboarding Screen
    if (currentScreen === "onboarding") {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setCurrentScreen("home")} style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: currentFontSize.body, color: colors.primary }}>← Kembali</Text>
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <Text style={{ fontSize: currentFontSize.title, marginBottom: 24, color: colors.text }}>
                            👋 Kenalan Dulu Yuk!
                        </Text>

                        <Text style={styles.label}>Nama Lengkap</Text>
                        <TextInput
                            style={[styles.input, { marginBottom: 20 }]}
                            value={userProfile.name}
                            onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
                            placeholder="Masukkan nama Anda"
                            placeholderTextColor="#9ca3af"
                        />

                        <Text style={styles.label}>Usia</Text>
                        <TextInput
                            style={[styles.input, { marginBottom: 20 }]}
                            value={userProfile.age}
                            onChangeText={(text) => setUserProfile({ ...userProfile, age: text })}
                            placeholder="Berapa usia Anda?"
                            keyboardType="numeric"
                            placeholderTextColor="#9ca3af"
                        />

                        <Text style={[styles.label, { marginBottom: 12 }]}>Kondisi Khusus (opsional)</Text>
                        <View style={{ backgroundColor: colors.background, padding: 12, borderRadius: 8, marginBottom: 16 }}>
                            <Text style={{ fontSize: currentFontSize.body - 2, color: colors.text, opacity: 0.7 }}>
                                💡 Jika Anda memiliki disabilitas, pertanyaan akan menggunakan format pilihan ganda.
                                Jika tidak, pertanyaan akan berbentuk essay reflektif.
                            </Text>
                        </View>
                        {["Disabilitas Visual", "Disabilitas Audio", "Disabilitas Kognitif", "Disabilitas Motorik"].map(
                            (disability) => (
                                <TouchableOpacity
                                    key={disability}
                                    style={styles.checkboxRow}
                                    onPress={() => toggleDisability(disability)}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            userProfile.disabilities.includes(disability) && styles.checkboxChecked,
                                        ]}
                                    >
                                        {userProfile.disabilities.includes(disability) && (
                                            <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>{disability}</Text>
                                </TouchableOpacity>
                            )
                        )}

                        {error && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
                            onPress={startQuiz}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>🚀 Mulai Assessment</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Quiz Screen
    if (currentScreen === "quiz" && questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        const isEssay = currentQuestion.type === "essay";

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Progress */}
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>
                                Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
                            </Text>
                            <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>
                                {Math.round(progress)}%
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                    </View>

                    {/* Question Card */}
                    <View style={styles.card}>
                        <View
                            style={{
                                backgroundColor: colors.primary,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 6,
                                alignSelf: "flex-start",
                                marginBottom: 16,
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: currentFontSize.body - 2 }}>
                                {currentQuestion.category} • {isEssay ? "Essay" : "Pilihan Ganda"}
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: currentFontSize.title,
                                marginBottom: 24,
                                color: colors.text,
                                lineHeight: currentFontSize.title * 1.4,
                            }}
                        >
                            {currentQuestion.question}
                        </Text>

                        {isEssay ? (
                            // Essay Input
                            <>
                                <TextInput
                                    style={styles.essayInput}
                                    value={essayAnswer}
                                    onChangeText={setEssayAnswer}
                                    placeholder="Tulis jawaban Anda di sini..."
                                    placeholderTextColor="#9ca3af"
                                    multiline
                                    numberOfLines={6}
                                />
                                <Text style={styles.charCounter}>
                                    {essayAnswer.length} karakter
                                </Text>

                                {error && (
                                    <View style={styles.errorBox}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={[styles.submitButton, { opacity: !essayAnswer.trim() ? 0.5 : 1 }]}
                                    onPress={handleEssaySubmit}
                                    disabled={!essayAnswer.trim()}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {currentQuestionIndex < questions.length - 1 ? "Lanjut ➡️" : "Selesai ✓"}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            // Multiple Choice Options
                            currentQuestion.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionButton}
                                    onPress={() => handleMultipleChoiceAnswer(option)}
                                >
                                    <Text style={styles.optionText}>
                                        <Text style={{ fontWeight: "600" }}>{String.fromCharCode(65 + index)}. </Text>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {loading && (
                        <View style={{ alignItems: "center", padding: 20 }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{ marginTop: 12, fontSize: currentFontSize.body, color: colors.text }}>
                                Menganalisis jawaban Anda...
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Result Screen
    if (currentScreen === "result" && testResult) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="checkmark.circle" size={48} color="#fff" />
                        <Text style={styles.headerTitle}>🎉 Assessment Selesai!</Text>
                        <Text style={styles.headerSubtitle}>Hai {userProfile.name}, ini hasil assessment kamu</Text>
                    </View>

                    {/* Passion */}
                    <View style={styles.card}>
                        <Text style={{ fontSize: currentFontSize.title - 4, marginBottom: 16, color: colors.text }}>
                            💡 Passion & Minat Utama
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {testResult.passion.map((item, i) => (
                                <View key={i} style={styles.tag}>
                                    <Text style={styles.tagText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Learning Style */}
                    <View style={styles.card}>
                        <Text style={{ fontSize: currentFontSize.title - 4, marginBottom: 16, color: colors.text }}>
                            📚 Gaya Belajar Kamu
                        </Text>
                        <View
                            style={{
                                backgroundColor: colors.background,
                                padding: 16,
                                borderRadius: 8,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: currentFontSize.body + 2,
                                    fontWeight: "600",
                                    color: colors.primary,
                                }}
                            >
                                {testResult.learningStyle}
                            </Text>
                        </View>
                    </View>

                    {/* Career Potential */}
                    <View style={styles.card}>
                        <Text style={{ fontSize: currentFontSize.title - 4, marginBottom: 16, color: colors.text }}>
                            💼 Potensi Karir
                        </Text>
                        {testResult.careerPotential.map((career, i) => (
                            <View
                                key={i}
                                style={{
                                    backgroundColor: colors.background,
                                    padding: 16,
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <Text style={{ fontSize: currentFontSize.body, color: colors.text, textAlign: "center" }}>
                                    {career}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Recommendations */}
                    <View style={styles.card}>
                        <Text style={{ fontSize: currentFontSize.title - 4, marginBottom: 16, color: colors.text }}>
                            🎯 Rekomendasi untuk Kamu
                        </Text>
                        <Text style={{ fontSize: currentFontSize.body, lineHeight: currentFontSize.body * 1.6, color: colors.text }}>
                            {testResult.recommendations}
                        </Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.buttonSecondary} onPress={resetApp}>
                            <Text style={styles.buttonTextSecondary}>🏠 Kembali ke Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setCurrentScreen("onboarding");
                                setTestResult(null);
                                setAnswers([]);
                                setEssayAnswer("");
                            }}
                        >
                            <Text style={styles.buttonText}>🔄 Tes Lagi</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // History Screen
    if (currentScreen === "history") {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setCurrentScreen("home")} style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: currentFontSize.body, color: colors.primary }}>← Kembali</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: currentFontSize.title, marginBottom: 24, color: colors.text }}>
                        📊 Riwayat Assessment
                    </Text>

                    {testHistory.length === 0 ? (
                        <View style={[styles.card, { padding: 48, alignItems: "center" }]}>
                            <IconSymbol name="folder.fill" size={48} color={colors.border} />
                            <Text style={{ fontSize: currentFontSize.body, color: colors.text, marginTop: 16 }}>
                                Belum ada riwayat assessment. Mulai tes pertama kamu!
                            </Text>
                        </View>
                    ) : (
                        testHistory.map((result, index) => (
                            <View key={index} style={styles.card}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                                    <Text style={{ fontSize: currentFontSize.body + 2, color: colors.text, fontWeight: "600" }}>
                                        Assessment #{testHistory.length - index}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: colors.primary,
                                            paddingHorizontal: 12,
                                            paddingVertical: 4,
                                            borderRadius: 12,
                                        }}
                                    >
                                        <Text style={{ color: "#fff", fontSize: currentFontSize.body - 2 }}>
                                            {result.learningStyle}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: currentFontSize.body - 2, color: colors.text }}>
                                    <Text style={{ fontWeight: "600" }}>Passion:</Text> {result.passion.join(", ")}
                                </Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Settings Screen
    if (currentScreen === "settings") {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setCurrentScreen("home")} style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: currentFontSize.body, color: colors.primary }}>← Kembali</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: currentFontSize.title, marginBottom: 24, color: colors.text }}>
                        ⚙️ Pengaturan Aplikasi
                    </Text>
                    {/* Pengaturan Aksesibilitas */}
                    <View style={styles.card}>
                        <Text style={{ fontSize: currentFontSize.title - 4, marginBottom: 16, color: colors.text }}>
                            Aksesibilitas
                        </Text>
                        <Text style={styles.label}>Ukuran Font</Text>
                        {["normal", "large", "xlarge"].map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={styles.checkboxRow}
                                onPress={() =>
                                    setUserProfile({
                                        ...userProfile,
                                        preferences: { ...userProfile.preferences, fontSize: size as 'normal' | 'large' | 'xlarge' },
                                    })
                                }
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        userProfile.preferences.fontSize === size && styles.checkboxChecked,
                                    ]}
                                >
                                    {userProfile.preferences.fontSize === size && (
                                        <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                                    )}
                                </View>
                                <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Text style={[styles.label, { marginTop: 16 }]}>Kontras Warna</Text>
                        {["normal", "high"].map((contrast) => (
                            <TouchableOpacity
                                key={contrast}
                                style={styles.checkboxRow}
                                onPress={() =>
                                    setUserProfile({
                                        ...userProfile,
                                        preferences: { ...userProfile.preferences, contrast: contrast as 'normal' | 'high' },
                                    })
                                }
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        userProfile.preferences.contrast === contrast && styles.checkboxChecked,
                                    ]}
                                >
                                    {userProfile.preferences.contrast === contrast && (
                                        <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                                    )}
                                </View>
                                <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>
                                    {contrast.charAt(0).toUpperCase() + contrast.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return null;
}