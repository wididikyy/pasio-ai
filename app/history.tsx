import { IconSymbol } from "@/components/ui/icon-symbol";
import { useApp } from "@/context/app-context";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const { testHistory } = useApp();
  const { colors, currentFontSize } = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 20 },
    pageTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 24,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    badge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: currentFontSize.body, color: colors.primary }}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.pageTitle}>
          <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
          <Text style={{ fontSize: currentFontSize.title, color: colors.text, fontWeight: "600" }}>
            Riwayat Assessment
          </Text>
        </View>

        {testHistory.length === 0 ? (
          <View style={[styles.card, { padding: 48, alignItems: "center" }]}>
            <IconSymbol name="folder.fill" size={48} color={colors.border} />
            <Text style={{ fontSize: currentFontSize.body, color: colors.text, marginTop: 16, textAlign: "center" }}>
              Belum ada riwayat assessment. Mulai tes pertama kamu!
            </Text>
          </View>
        ) : (
          [...testHistory].reverse().map((result, index) => (
            <View key={index} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                <Text style={{ fontSize: currentFontSize.body + 2, color: colors.text, fontWeight: "600" }}>
                  Assessment #{testHistory.length - index}
                </Text>
                <View style={styles.badge}>
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
