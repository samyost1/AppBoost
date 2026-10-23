/**
 * Theme presets for AppBoost
 *
 * Each theme defines a complete color palette that can be used throughout the app.
 * The active theme is set via ThemeProvider and consumed via useTheme() hook.
 *
 * Usage:
 *   import { useTheme } from '../hooks/useTheme';
 *   const { colors } = useTheme();
 *   <View style={{ backgroundColor: colors.background }} />
 */

/**
 * Light Teal theme - Clean, bright appearance
 * Default theme with teal/green accents
 */
export const lightTealTheme = {
  id: "lightTeal",
  name: "Light Teal",
  isDark: false,

  colors: {
    // Primary accent - teal
    primary: "#0B4650",
    primaryLight: "#1A6B7A",
    primaryDark: "#051F24",

    // Secondary accent - soft green
    secondary: "#B3D0C1",
    secondaryLight: "#E6F1F0",
    secondaryDark: "#8FAD88",

    // Tertiary
    tertiary: "#7F9C96",
    tertiaryLight: "#A5BCB6",

    // Backgrounds
    background: "#FFFFFF",
    backgroundSecondary: "#F6F8FA",
    backgroundTertiary: "#ECF0F1",

    // Card/Surface colors
    card: "#FFFFFF",
    cardLight: "#F6F8FA",
    cardBorder: "#E1E5E8",

    // Text colors
    text: "#11181C",
    textSecondary: "#687076",
    textMuted: "#9BA1A6",

    // Status colors
    success: "#28a745",
    successLight: "#5DD879",
    error: "#ED4337",
    errorLight: "#F87171",
    warning: "#F59E0B",

    // Accent colors
    gold: "#FABC3F",
    goldLight: "#FFCA28",

    // Basic colors
    black: "#000000",
    white: "#FFFFFF",

    // Gray scale
    gray: "#ECF0F1",
    lightGray: "#F6F8FA",
    darkGray: "#666666",

    // Gradient colors (for LinearGradient usage)
    gradientStart: "#0B4650",
    gradientEnd: "#1A6B7A",
    gradientSecondaryStart: "#B3D0C1",
    gradientSecondaryEnd: "#8FAD88",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.5)",
    overlayLight: "rgba(0, 0, 0, 0.3)",

    // Tab bar
    tabBarBackground: "#F2F2F2",
    tabBarInactiveTintColor: "#687076",

    // Input
    inputBackground: "#F6F8FA",
    inputBorder: "#E1E5E8",
    inputText: "#11181C",
    inputPlaceholder: "#9BA1A6",
  },
};

/**
 * Dark Coral theme - Modern dark appearance
 * Inspired by Zirka UI with vibrant coral/orange accents
 */
export const darkCoralTheme = {
  id: "darkCoral",
  name: "Dark Coral",
  isDark: true,

  colors: {
    // Primary accent - vibrant coral/orange
    primary: "#FF6B4A",
    primaryLight: "#FF8A6B",
    primaryDark: "#E85A3A",

    // Secondary accent - purple
    secondary: "#A855F7",
    secondaryLight: "#C084FC",
    secondaryDark: "#9333EA",

    // Tertiary - cyan/teal
    tertiary: "#06B6D4",
    tertiaryLight: "#22D3EE",

    // Backgrounds - deep dark tones
    background: "#0A0A0F",
    backgroundSecondary: "#12121A",
    backgroundTertiary: "#1A1A24",

    // Card/Surface colors
    card: "#1E1E28",
    cardLight: "#252532",
    cardBorder: "#2A2A3A",

    // Text colors
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",

    // Status colors
    success: "#10B981",
    successLight: "#34D399",
    error: "#EF4444",
    errorLight: "#F87171",
    warning: "#F59E0B",

    // Accent colors
    gold: "#FFB800",
    goldLight: "#FFCA28",

    // Live indicator
    live: "#FF3B5C",

    // Basic colors
    black: "#000000",
    white: "#FFFFFF",

    // Gray scale
    gray: "#374151",
    lightGray: "#4B5563",
    darkGray: "#9CA3AF",

    // Gradient colors (for LinearGradient usage)
    gradientStart: "#FF6B4A",
    gradientEnd: "#FF3B5C",
    gradientSecondaryStart: "#A855F7",
    gradientSecondaryEnd: "#6366F1",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.6)",
    overlayLight: "rgba(0, 0, 0, 0.4)",

    // Tab bar
    tabBarBackground: "#12121A",
    tabBarInactiveTintColor: "#6B7280",

    // Input
    inputBackground: "#1E1E28",
    inputBorder: "#2A2A3A",
    inputText: "#FFFFFF",
    inputPlaceholder: "#6B7280",
  },
};

/**
 * All available themes
 * Add new themes here and they will be automatically available
 */
export const themes = {
  lightTeal: lightTealTheme,
  darkCoral: darkCoralTheme,
};

/**
 * Default theme ID
 */
export const defaultThemeId = "lightTeal";

/**
 * Get a theme by ID
 */
export const getTheme = (themeId) => {
  return themes[themeId] || themes[defaultThemeId];
};

/**
 * Get all theme IDs
 */
export const getThemeIds = () => Object.keys(themes);

/**
 * Get all themes as an array
 */
export const getThemesArray = () => Object.values(themes);
