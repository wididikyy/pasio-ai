import { IconSymbol } from "@/components/ui/icon-symbol";
import { useApp } from "@/context/app-context";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultScreen() {
  const { userProfile, testResult, resetQuiz } = useApp();
  const { colors, currentFontSize } = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20 },
    header: {
      backgroundColor: colors.secondary,
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
    cardTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    cardTitleText: { fontSize: currentFontSize.title - 4, color: colors.text, fontWeight: "600" },
    tag: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: { color: "#fff", fontSize: currentFontSize.body },
    careerItem: {
      backgroundColor: colors.background,
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonRow: { flexDirection: "row", gap: 16, marginBottom: 16 },
    button: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 20,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    buttonSecondary: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.border,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    buttonText: { fontSize: currentFontSize.button, fontWeight: "600", color: "#fff" },
    buttonTextSecondary: { fontSize: currentFontSize.button, fontWeight: "600", color: colors.text },
  });

  if (!testResult) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconSymbol name="party.popper" size={48} color="#fff" />
          <Text style={styles.headerTitle}>Assessment Selesai!</Text>
          <Text style={styles.headerSubtitle}>Hai {userProfile.name}, ini hasil assessment kamu</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <IconSymbol name="lightbulb.fill" size={20} color={colors.primary} />
            <Text style={styles.cardTitleText}>Passion & Minat Utama</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {testResult.passion.map((item, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <IconSymbol name="books.vertical.fill" size={20} color={colors.primary} />
            <Text style={styles.cardTitleText}>Gaya Belajar Kamu</Text>
          </View>
          <View style={{ backgroundColor: colors.background, padding: 16, borderRadius: 8, alignItems: "center" }}>
            <Text style={{ fontSize: currentFontSize.body + 2, fontWeight: "600", color: colors.primary }}>
              {testResult.learningStyle}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <IconSymbol name="briefcase.fill" size={20} color={colors.primary} />
            <Text style={styles.cardTitleText}>Potensi Karir</Text>
          </View>
          {testResult.careerPotential.map((career, i) => (
            <View key={i} style={styles.careerItem}>
              <Text style={{ fontSize: currentFontSize.body, color: colors.text, textAlign: "center" }}>
                {career}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <IconSymbol name="scope" size={20} color={colors.primary} />
            <Text style={styles.cardTitleText}>Rekomendasi untuk Kamu</Text>
          </View>
          <Text style={{ fontSize: currentFontSize.body, lineHeight: currentFontSize.body * 1.6, color: colors.text }}>
            {testResult.recommendations}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => { resetQuiz(); router.push("/"); }}
          >
            <IconSymbol name="house.fill" size={18} color={colors.text} />
            <Text style={styles.buttonTextSecondary}>Kembali ke Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { resetQuiz(); router.push("/onboarding"); }}
          >
            <IconSymbol name="arrow.clockwise" size={18} color="#fff" />
            <Text style={styles.buttonText}>Tes Lagi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
