/**
 * Color constants for AppBoost
 *
 * This file exports the default (light) theme colors for backward compatibility.
 * For theme-aware colors, use the useTheme() hook instead:
 *
 * @example
 * // Recommended usage (theme-aware):
 * import { useTheme } from '../hooks/useTheme';
 * const { colors } = useTheme();
 * <View style={{ backgroundColor: colors.background }} />
 *
 * Color resources:
 * - https://flatuicolors.com/ - Nice color palettes
 * - https://coolors.co/ - Color combinations and shades
 */

import { lightTealTheme, darkCoralTheme } from "./themes";

/**
 * Default colors (light teal theme)
 * For backward compatibility with existing code
 */
export const Colors = lightTealTheme.colors;

/**
 * Light Teal theme colors
 * Explicit export for when you need light theme specifically
 */
export const LightTealColors = lightTealTheme.colors;

/**
 * Dark coral theme colors
 * Explicit export for when you need dark theme specifically
 */
export const DarkCoralColors = darkCoralTheme.colors;

/**
 * Get colors for a specific theme by ID
 * @param {string} themeId - 'lightTeal' or 'darkCoral'
 * @returns {object} Theme colors object
 */
export const getColorsForTheme = (themeId) => {
  switch (themeId) {
    case "darkCoral":
      return darkCoralTheme.colors;
    case "lightTeal":
    default:
      return lightTealTheme.colors;
  }
};
