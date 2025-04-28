// Path: src/hooks/use-status-bar-color.ts
import { useEffect } from "react";
import { StatusBar, Platform } from "react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Custom hook to manage status bar color
 * Sets color when screen is focused and resets to default when unfocused
 * @param color The color to set when screen is focused
 */
export function useStatusBarColor(color: string) {
  // Using useFocusEffect to handle navigation focus/blur events
  useFocusEffect(() => {
    // Set status bar color when screen comes into focus
    let previousColor: string | undefined;

    if (Platform.OS === "android") {
      previousColor = THEME_COLORS.primary; // Replace with your app's default color
    }

    // Set the status bar color and style
    StatusBar.setBackgroundColor(color);
    StatusBar.setBarStyle(
      shouldUseDarkText(color) ? "dark-content" : "light-content"
    );

    // Clean up function - reset to app's default color when screen loses focus
    return () => {
      StatusBar.setBackgroundColor(THEME_COLORS.primary);
      StatusBar.setBarStyle("light-content");
    };
  });
}

/**
 * Determines if text should be dark or light based on background color luminance
 * @param backgroundColor Color in hex format
 * @returns true if text should be dark, false if text should be light
 */
function shouldUseDarkText(backgroundColor: string): boolean {
  // Handle non-hex colors or empty values
  if (!backgroundColor || !backgroundColor.startsWith("#")) return false;

  // Convert hex to RGB
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);

  // Calculate perceived brightness (luminance)
  // Formula: https://www.w3.org/TR/WCAG20-TECHS/G18.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // If luminance > 0.5, background is considered light and should use dark text
  return luminance > 0.5;
}
