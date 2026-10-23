/**
 * useTheme hook - Access the current theme and theme management functions
 *
 * Re-exported from ThemeProvider for convenience.
 *
 * @example
 * import { useTheme } from '../hooks/useTheme';
 *
 * const MyComponent = () => {
 *   const { colors, isDark, toggleTheme, setTheme } = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: colors.background }}>
 *       <Text style={{ color: colors.text }}>
 *         Current theme: {isDark ? 'Dark' : 'Light'}
 *       </Text>
 *       <Button title="Toggle Theme" onPress={toggleTheme} />
 *       <Button title="Use Dark Coral" onPress={() => setTheme('darkCoral')} />
 *     </View>
 *   );
 * };
 *
 * // For animated theme switching with custom origin point:
 * const handleThemeChange = (event) => {
 *   const { pageX, pageY } = event.nativeEvent;
 *   setTheme('darkCoral', true, { originX: pageX, originY: pageY });
 * };
 *
 * Available properties:
 * - colors: Theme color palette object
 * - isDark: Boolean indicating if current theme is dark
 * - theme: Full theme object with id, name, isDark, colors
 * - themeId: Current theme ID string
 * - themeName: Human-readable theme name
 * - setTheme(themeId, persist, options): Set theme by ID with optional animation origin
 * - toggleTheme(options): Toggle between light and dark with optional animation origin
 * - availableThemes: Array of all theme objects
 * - availableThemeIds: Array of theme ID strings
 * - isLoading: Boolean for initial load state
 *
 * Animation properties (for ThemeTransitionOverlay):
 * - isAnimating: Boolean indicating if theme transition is animating
 * - animationTargetColor: Background color of the new theme
 * - animationOrigin: { x, y } coordinates for animation origin
 * - onAnimationComplete: Callback when animation finishes
 */
export { useTheme } from "../app/providers/ThemeProvider";
