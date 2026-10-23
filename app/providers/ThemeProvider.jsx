import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useSystemColorScheme, Dimensions } from "react-native";
import {
  themes,
  defaultThemeId,
  getTheme,
  getThemeIds,
  getThemesArray,
} from "../../constants/themes";

const THEME_STORAGE_KEY = "@appboost_theme";
const { width, height } = Dimensions.get("window");

const ThemeContext = createContext(undefined);

/**
 * ThemeProvider - Manages app-wide theming
 *
 * Features:
 * - Persists theme selection to AsyncStorage
 * - Provides theme colors and metadata via context
 * - Supports system theme detection (optional)
 * - Hot-swappable themes without app restart
 *
 * Usage:
 *   <ThemeProvider defaultTheme="darkCoral">
 *     <App />
 *   </ThemeProvider>
 */
export const ThemeProvider = ({
  children,
  defaultTheme = defaultThemeId,
  followSystem = false, // When true, follows system light/dark preference
}) => {
  const [themeId, setThemeId] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useSystemColorScheme();

  // Load saved theme on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeId && themes[savedThemeId]) {
          setThemeId(savedThemeId);
        } else if (followSystem) {
          // Use system preference if no saved theme and followSystem is enabled
          setThemeId(systemColorScheme === "dark" ? "darkCoral" : "light");
        }
      } catch (error) {
        console.warn("Failed to load saved theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, [followSystem, systemColorScheme]);

  // Update theme when system changes (if followSystem is enabled and no manual override)
  useEffect(() => {
    const handleSystemThemeChange = async () => {
      if (!followSystem) return;

      try {
        const savedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        // Only follow system if user hasn't manually selected a theme
        if (!savedThemeId) {
          setThemeId(systemColorScheme === "dark" ? "darkCoral" : "light");
        }
      } catch (error) {
        console.warn("Failed to check theme preference:", error);
      }
    };

    handleSystemThemeChange();
  }, [systemColorScheme, followSystem]);

  /**
   * Set the active theme
   * @param {string} newThemeId - Theme ID from available themes
   * @param {boolean} persist - Whether to save to AsyncStorage (default: true)
   */
  const setTheme = useCallback(async (newThemeId, persist = true) => {
    if (!themes[newThemeId]) {
      console.warn(`Theme "${newThemeId}" not found. Available themes: ${getThemeIds().join(", ")}`);
      return;
    }

    setThemeId(newThemeId);

    if (persist) {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeId);
      } catch (error) {
        console.warn("Failed to save theme preference:", error);
      }
    }
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    const currentTheme = getTheme(themeId);
    const newThemeId = currentTheme.isDark ? "light" : "darkCoral";
    setTheme(newThemeId);
  }, [themeId, setTheme]);

  /**
   * Clear saved theme preference (will use default or system preference)
   */
  const clearThemePreference = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      if (followSystem) {
        setThemeId(systemColorScheme === "dark" ? "darkCoral" : "light");
      } else {
        setThemeId(defaultTheme);
      }
    } catch (error) {
      console.warn("Failed to clear theme preference:", error);
    }
  }, [followSystem, systemColorScheme, defaultTheme]);

  const currentTheme = getTheme(themeId);

  const value = {
    // Current theme data
    theme: currentTheme,
    themeId: currentTheme.id,
    themeName: currentTheme.name,
    isDark: currentTheme.isDark,
    colors: currentTheme.colors,

    // Theme management
    setTheme,
    toggleTheme,
    clearThemePreference,

    // Available themes
    availableThemes: getThemesArray(),
    availableThemeIds: getThemeIds(),

    // Loading state
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 *
 * @returns {Object} Theme context with colors, theme info, and management functions
 *
 * @example
 * const { colors, isDark, toggleTheme } = useTheme();
 *
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text }}>Hello</Text>
 *   <Button title={isDark ? "Light Mode" : "Dark Mode"} onPress={toggleTheme} />
 * </View>
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default ThemeProvider;
