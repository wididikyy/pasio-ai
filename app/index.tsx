import { IconSymbol } from "@/components/ui/icon-symbol";
import { useApp } from "@/context/app-context";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = [
  { icon: "scope", text: "Assessment adaptif berbasis AI" },
  { icon: "doc.text.fill", text: "Essay untuk user normal, pilihan ganda untuk disabilitas" },
  { icon: "brain.fill", text: "Analisis passion & gaya belajar" },
  { icon: "briefcase.fill", text: "Rekomendasi karir personal" },
  { icon: "figure.roll", text: "Aksesibilitas penuh (font, kontras)" },
  { icon: "chart.bar.fill", text: "Tracking progress & riwayat" },
] as const;

export default function HomeScreen() {
  const { testHistory } = useApp();
  const { colors, currentFontSize } = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20 },
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
    buttonColumn: { flexDirection: "column", gap: 8, marginBottom: 16 },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
    },
    buttonSecondary: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.border,
    },
    buttonText: { fontSize: currentFontSize.button, fontWeight: "600", color: "#fff", marginTop: 12 },
    buttonTextSecondary: { fontSize: currentFontSize.button, fontWeight: "600", color: colors.text, marginTop: 12 },
    sectionTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
      marginTop: 16,
    },
    featureItem: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    featureText: { fontSize: currentFontSize.body, color: colors.text, flex: 1 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconSymbol name="brain.fill" size={48} color="#fff" />
          <Text style={styles.headerTitle}>E-Kuesioner Adaptif AI</Text>
          <Text style={styles.headerSubtitle}>
            Temukan passion, gaya belajar, dan potensi karir Anda dengan AI
          </Text>
        </View>

        <View style={styles.buttonColumn}>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding")}>
            <IconSymbol name="brain.fill" size={32} color="#fff" />
            <Text style={styles.buttonText}>Mulai Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push("/history")}>
            <IconSymbol name="chart.bar.fill" size={32} color={colors.text} />
            <Text style={styles.buttonTextSecondary}>Riwayat Tes ({testHistory.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push("/settings")}>
            <IconSymbol name="gear" size={32} color={colors.text} />
            <Text style={styles.buttonTextSecondary}>Pengaturan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitle}>
          <IconSymbol name="sparkles" size={22} color={colors.primary} />
          <Text style={{ fontSize: currentFontSize.title, color: colors.text, fontWeight: "600" }}>
            Fitur Utama
          </Text>
        </View>

        {FEATURES.map((feature, i) => (
          <View key={i} style={styles.featureItem}>
            <IconSymbol name={feature.icon} size={20} color={colors.primary} />
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
