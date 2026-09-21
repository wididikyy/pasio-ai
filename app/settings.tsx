import { IconSymbol } from "@/components/ui/icon-symbol";
import { useApp } from "@/context/app-context";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { userProfile, setUserProfile } = useApp();
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
    label: { fontSize: currentFontSize.body, fontWeight: "600", color: colors.text, marginBottom: 8 },
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: currentFontSize.body, color: colors.primary }}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.pageTitle}>
          <IconSymbol name="gear" size={24} color={colors.primary} />
          <Text style={{ fontSize: currentFontSize.title, color: colors.text, fontWeight: "600" }}>
            Pengaturan Aplikasi
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={{ fontSize: currentFontSize.title - 4, marginBottom: 16, color: colors.text, fontWeight: "600" }}>
            Aksesibilitas
          </Text>

          <Text style={styles.label}>Ukuran Font</Text>
          {(["normal", "large", "xlarge"] as const).map((size) => (
            <TouchableOpacity
              key={size}
              style={styles.checkboxRow}
              onPress={() =>
                setUserProfile({ ...userProfile, preferences: { ...userProfile.preferences, fontSize: size } })
              }
            >
              <View style={[styles.checkbox, userProfile.preferences.fontSize === size && styles.checkboxChecked]}>
                {userProfile.preferences.fontSize === size && (
                  <IconSymbol name="checkmark" size={12} color="#fff" />
                )}
              </View>
              <Text style={{ fontSize: currentFontSize.body, color: colors.text }}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.label, { marginTop: 16 }]}>Kontras Warna</Text>
          {(["normal", "high"] as const).map((contrast) => (
            <TouchableOpacity
              key={contrast}
              style={styles.checkboxRow}
              onPress={() =>
                setUserProfile({ ...userProfile, preferences: { ...userProfile.preferences, contrast } })
              }
            >
              <View style={[styles.checkbox, userProfile.preferences.contrast === contrast && styles.checkboxChecked]}>
                {userProfile.preferences.contrast === contrast && (
                  <IconSymbol name="checkmark" size={12} color="#fff" />
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
