import { useApp } from "@/context/app-context";

const fontSizeMap = {
  normal: { title: 24, body: 16, button: 16 },
  large: { title: 28, body: 18, button: 18 },
  xlarge: { title: 32, body: 20, button: 20 },
};

export function useTheme() {
  const { userProfile } = useApp();
  const isHighContrast = userProfile.preferences.contrast === "high";

  const colors = {
    primary: isHighContrast ? "#000000" : "#3b82f6",
    secondary: isHighContrast ? "#ffffff" : "#10b981",
    background: isHighContrast ? "#ffffff" : "#f3f4f6",
    text: isHighContrast ? "#000000" : "#1f2937",
    border: isHighContrast ? "#000000" : "#d1d5db",
    card: "#ffffff",
  };

  const currentFontSize = fontSizeMap[userProfile.preferences.fontSize];

  return { colors, currentFontSize };
}
