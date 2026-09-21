import { IconSymbol } from "@/components/ui/icon-symbol";
import { useApp } from "@/context/app-context";
import { useTheme } from "@/hooks/use-theme";
import { GroqService } from "@/services/groq-service";
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

const DISABILITIES = [
  "Disabilitas Visual",
  "Disabilitas Audio",
  "Disabilitas Kognitif",
  "Disabilitas Motorik",
];

export default function OnboardingScreen() {
  const { userProfile, setUserProfile, setQuestions, setGroqService, apiKey } = useApp();
  const { colors, currentFontSize } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleDisability = (disability: string) => {
    const updated = userProfile.disabilities.includes(disability)
      ? userProfile.disabilities.filter((d) => d !== disability)
      : [...userProfile.disabilities, disability];
    setUserProfile({ ...userProfile, disabilities: updated });
  };

  const startQuiz = async () => {
    if (!userProfile.name || !userProfile.age) {
      setError("Lengkapi data profil terlebih dahulu");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const service = new GroqService(apiKey);
      setGroqService(service);
      const generatedQuestions = await service.generateQuestions(userProfile);
      setQuestions(generatedQuestions);
      router.push("/quiz");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("startQuiz error:", msg);
      setError(`Gagal generate pertanyaan: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    cardTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 24,
    },
    label: { fontSize: currentFontSize.body, fontWeight: "600", color: colors.text, marginBottom: 8 },
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
    hintBox: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
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
    checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    errorBox: { backgroundColor: "#fee2e2", padding: 12, borderRadius: 8, marginBottom: 16 },
    errorText: { color: "#dc2626", fontSize: currentFontSize.body },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: currentFontSize.body, color: colors.primary }}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <IconSymbol name="person.fill" size={28} color={colors.primary} />
            <Text style={{ fontSize: currentFontSize.title, color: colors.text, fontWeight: "600" }}>
              Kenalan Dulu Yuk!
            </Text>
          </View>

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
          <View style={styles.hintBox}>
            <IconSymbol name="lightbulb.fill" size={16} color={colors.primary} />
            <Text style={{ fontSize: currentFontSize.body - 2, color: colors.text, opacity: 0.7, flex: 1 }}>
              Jika Anda memiliki disabilitas, pertanyaan akan menggunakan format pilihan ganda.
              Jika tidak, pertanyaan akan berbentuk essay reflektif.
            </Text>
          </View>

          {DISABILITIES.map((disability) => (
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
                  <IconSymbol name="checkmark" size={12} color="#fff" />
                )}
              </View>
              <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>{disability}</Text>
            </TouchableOpacity>
          ))}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
            onPress={startQuiz}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <IconSymbol name="paperplane.fill" size={20} color="#fff" />
                <Text style={{ fontSize: currentFontSize.button, fontWeight: "600", color: "#fff" }}>
                  Mulai Assessment
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
