import { IconSymbol } from "@/components/ui/icon-symbol";
import { useApp } from "@/context/app-context";
import { useTheme } from "@/hooks/use-theme";
import { Answer } from "@/types";
import { router } from "expo-router";
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

export default function QuizScreen() {
  const { userProfile, questions, groqService, setTestResult, addToHistory } = useApp();
  const { colors, currentFontSize } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isEssay = currentQuestion?.type === "essay";

  const finishQuiz = async (finalAnswers: Answer[]) => {
    setLoading(true);
    setError("");
    try {
      if (!groqService) throw new Error("Service not initialized");
      const result = await groqService.analyzeAnswers(userProfile, finalAnswers);
      setTestResult(result);
      addToHistory(result);
      router.push("/result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("finishQuiz error:", msg);
      setError(`Gagal menganalisis jawaban: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const advance = (newAnswers: Answer[]) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const handleMultipleChoiceAnswer = (option: string) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: option,
      category: currentQuestion.category,
    };
    const updated = [...answers, newAnswer];
    setAnswers(updated);
    advance(updated);
  };

  const handleEssaySubmit = () => {
    if (!essayAnswer.trim()) {
      setError("Mohon isi jawaban terlebih dahulu");
      return;
    }
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: essayAnswer.trim(),
      category: currentQuestion.category,
    };
    const updated = [...answers, newAnswer];
    setAnswers(updated);
    setEssayAnswer("");
    setError("");
    advance(updated);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20 },
    progressBar: {
      width: "100%",
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 8,
    },
    progressFill: { height: "100%", backgroundColor: colors.primary },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    categoryBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      alignSelf: "flex-start",
      marginBottom: 16,
    },
    optionButton: {
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
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
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 16,
    },
    errorBox: { backgroundColor: "#fee2e2", padding: 12, borderRadius: 8, marginBottom: 16 },
    errorText: { color: "#dc2626", fontSize: currentFontSize.body },
  });

  if (!currentQuestion) return null;

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
          <View style={styles.categoryBadge}>
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
              <Text
                style={{
                  fontSize: currentFontSize.body - 2,
                  color: colors.text,
                  textAlign: "right",
                  marginTop: 8,
                  opacity: 0.6,
                }}
              >
                {essayAnswer.length} karakter
              </Text>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.submitButton, { opacity: !essayAnswer.trim() ? 0.5 : 1 }]}
                onPress={handleEssaySubmit}
                disabled={!essayAnswer.trim()}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: currentFontSize.button, fontWeight: "600", color: "#fff" }}>
                    {currentQuestionIndex < questions.length - 1 ? "Lanjut" : "Selesai"}
                  </Text>
                  <IconSymbol
                    name={currentQuestionIndex < questions.length - 1 ? "arrow.right" : "checkmark"}
                    size={18}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            </>
          ) : (
            currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleMultipleChoiceAnswer(option)}
              >
                <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>
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
