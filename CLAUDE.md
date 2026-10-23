# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native starter template for building mobile apps with monetization and user engagement features. It includes RevenueCat for in-app purchases/subscriptions, push notifications via Expo, and Supabase for authentication, database, and real-time features.

## Development Commands

### Running the App
```bash
npx expo start --dev-client  # Start development server with dev client
npm run android              # Run on Android
npm run ios                  # Run on iOS
npm run web                  # Run on web
```

### Testing and Quality
```bash
npm test                     # Run Jest tests in watch mode
npm run lint                 # Run Expo linter
```

### Building and Deployment
```bash
# EAS builds (requires EAS CLI: npm install -g eas-cli)
eas build --platform android --profile preview    # APK for testing
eas build --platform android --profile internal   # Internal test build (AAB)
eas build --platform android --profile production # Production build (AAB)
eas build --platform ios --profile [profile-name] # iOS builds
```

Available build profiles: `preview`, `internal`, `development`, `production`

## Architecture

### File-Based Routing (Expo Router)
The app uses Expo Router for navigation with a file-based routing structure:
- `app/_layout.jsx` - Root layout with providers and theme setup
- `app/(tabs)/` - Tab-based navigation screens (index, explore, profile)
- `app/paywall.jsx` - Standalone paywall screen
- `app/onboardingScreen.jsx` - First-time user onboarding

Navigation is handled automatically based on file structure. Use `router.push()`, `router.back()`, etc. from `expo-router` for programmatic navigation.

### Provider Architecture
The app uses a hierarchical context provider structure (outermost to innermost in `app/_layout.jsx`):

1. **SupabaseProvider** (`app/providers/SupabaseProvider.jsx`) - Backend for authentication, database, and real-time features
   - **Authentication**: Built-in magic link and OAuth (Google, Apple) support
   - **User Management**: Exposes `user` object with email, id, and metadata
   - **Auth Methods**: `sendMagicLink()`, `signInWithOAuth()`, `logout()`
   - **Database Operations**: `insertData()`, `getData()`, `updateData()`, `deleteData()`
   - **Real-time**: `subscribeToTable()`, `unsubscribe()`
   - **Automatic Push Token Sync**: When configured, automatically saves push tokens to `expo_push_tokens` table
   - **Automatic Subscription Sync**: When RevenueCat is also configured, syncs subscription data to `user_profiles` table
   - Access via `useSupabase()` hook
2. **PushNotificationProvider** - Handles push notification setup and permissions
   - Automatically saves push tokens to Supabase (if configured) with both `user_id` (Supabase auth) and `revenuecat_id` (RevenueCat app user ID)
   - If no Supabase auth is used, RevenueCat ID serves as the user identifier for push tokens
3. **RevenueCatProvider** (`app/providers/RevenueCatProvider.jsx`)
   - Manages subscription state and in-app purchases
   - Exposes: `user` (isPremium, willRenew), `packages`, `purchasePackage()`, `restorePermissions()`, `isReady`, `isConfigured`, `trialAvailable`
   - Access via `useRevenueCat()` hook
   - **Automatic Supabase Sync**: When Supabase is configured, automatically syncs subscription data to `user_profiles` table on any RevenueCat state change
4. **UserDataProvider** (`app/providers/userDataProvider.jsx`)
   - Manages user state flags with AsyncStorage
   - Tracks: `isFirstTimeUser`, `hasReviewedApp`, `hasFinishedOnboarding`
   - Access via `useUserData()` hook
5. **PostHogProvider** (`app/providers/PostHogProvider.jsx`)
   - Analytics, event tracking, and feature flags
   - Exposes: `capture()`, `identify()`, `reset()`, `isFeatureEnabled()`, `getFeatureFlag()`, `reloadFeatureFlags()`, `isConfigured`
   - Access via `usePostHogAnalytics()` hook
   - Gracefully disabled when `EXPO_PUBLIC_POSTHOG_KEY` is not set
6. **ThemeProvider** (`app/providers/ThemeProvider.jsx`)
   - Manages app-wide theming with preconfigured theme presets
   - Persists theme selection to AsyncStorage
   - Exposes: `colors`, `isDark`, `theme`, `themeId`, `themeName`, `setTheme()`, `toggleTheme()`, `availableThemes`
   - Access via `useTheme()` hook from `hooks/useTheme.js`

### Configuration Files
- `config/paywall.js` - Paywall UI text, behavior (closable/non-closable), testimonials, and purchase completion callback
- `config/revenueCat.js` - RevenueCat product IDs and entitlement IDs
- `config/appConfig.js` - App metadata, package IDs, and **deep link scheme** (must match `app.json`)
- `config/supabase.js` - Supabase backend configuration
- `config/auth.js` - Authentication screen configuration (uses `appConfig.scheme` for redirect URI)
- `config/toastConfig.js` - Toast notification styling
- `config/posthog.js` - PostHog analytics configuration (API key and host)

### Deep Linking Configuration
The app uses a **single scheme** for deep linking (auth redirects, etc.):
- **Scheme source**: `expo.scheme` in `app.json` (automatically read at runtime via `expo-constants`)
- **Auth redirect format**: `{scheme}://auth-callback`
- **Example**: If scheme is `myapp`, redirect is `myapp://auth-callback`

**Configuration**: Only set the scheme in `app.json` - the app reads it automatically. See `DEEP_LINKING_EXPLAINED.md` for details.

### Component Organization
- **`/components`** - Reusable UI components that MUST be used instead of recreated
  - Generic components: Button, Input, Switch, Checkbox, Dialog, Tabs, etc.
  - `/components/paywall` - Paywall-specific components (Header, Footer, Testimonials, PromoText)
  - When creating new generic UI elements, save them here for reusability
- **`/constants`** - Theme constants (Colors.js, Fonts.js)
- **`/hooks`** - Custom hooks (useColorScheme, useFetch, usePaywall)

### Environment Variables (.env)
Required environment variables:
```
EXPO_PUBLIC_RC_APPLE_KEY=         # RevenueCat Apple key (required for payments)
EXPO_PUBLIC_RC_GOOGLE_KEY=        # RevenueCat Google key (required for payments)
EXPO_PUBLIC_PROJECT_ID=           # Expo project ID (optional, for push notifications)
EXPO_PUBLIC_POSTHOG_KEY=          # PostHog project API key (optional, for analytics)
EXPO_PUBLIC_POSTHOG_HOST=         # PostHog host (optional, defaults to US cloud)
```


The app gracefully handles missing optional configurations with console warnings.

## Code Style Guidelines

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `isFetchingData`, `handleUserInput`)
- **Components**: PascalCase (e.g., `UserProfile`, `Paywall`)
- **Directories**: lowercase-hyphenated (e.g., `user-profile`, `paywall`)

### Component Standards
- Use functional components with hooks (useState, useEffect)
- Prefer component modularity - single responsibility principle
- Use React.memo() for components to prevent unnecessary re-renders
- Avoid anonymous functions in renderItem or event handlers
- Organize files by feature in feature-based directories

### Performance
- Use FlashList for large lists (already included: `@shopify/flash-list`)
- Optimize state management - avoid unnecessary state updates, use local state when possible
- Use optimized image libraries (expo-image is configured)

### Styling
- Use StyleSheet.create() for consistent styling
- Design must adapt to various screen sizes and orientations
- The app supports both light and dark themes via the custom ThemeProvider

### Theming System
The app includes a comprehensive theming system with preconfigured theme presets:

**Available Themes:**
- `light` - Clean, bright appearance with teal/green accents (default)
- `darkCoral` - Modern dark theme with vibrant coral/orange accents

**Theme Files:**
- `constants/themes.js` - Theme preset definitions (colors, metadata)
- `app/providers/ThemeProvider.jsx` - Theme context provider
- `hooks/useTheme.js` - Hook to access theme in components

**Usage in Components:**
```javascript
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const { colors, isDark, toggleTheme, setTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
      <Button title="Use Dark" onPress={() => setTheme('darkCoral')} />
    </View>
  );
};
```

**Key Color Properties:**
- `primary`, `primaryLight`, `primaryDark` - Primary accent colors
- `secondary`, `secondaryLight` - Secondary accent colors
- `background`, `backgroundSecondary`, `backgroundTertiary` - Background colors
- `card`, `cardLight`, `cardBorder` - Card/surface colors
- `text`, `textSecondary`, `textMuted` - Text colors
- `success`, `error`, `warning` - Status colors
- `gradientStart`, `gradientEnd` - Gradient colors for LinearGradient

**Adding New Themes:**
Add new theme presets in `constants/themes.js` following the existing structure. The theme will automatically appear in `availableThemes`.

**Setting Default Theme:**
In `app/_layout.jsx`, set the `defaultTheme` prop on ThemeProvider:
```javascript
<ThemeProvider defaultTheme="darkCoral">
```

## Key Dependencies
- **Expo SDK 52** with new architecture enabled
- **RevenueCat** (`react-native-purchases`, `react-native-purchases-ui`) - Subscriptions
- **Expo Router 4** - File-based navigation
- **React Native Reanimated** - Animations
- **Supabase** (`@supabase/supabase-js`) - Backend, auth, database
- **PostHog** (`posthog-react-native`) - Analytics, feature flags, session replay
- **FlashList** - High-performance lists
- **Toast Messages** (`react-native-toast-message`) - User feedback

## RevenueCat Integration Notes
- Products must be configured in App Store Connect, Play Store, and RevenueCat dashboard
- Update `config/revenueCat.js` with actual product IDs and entitlements
- The paywall automatically detects free trial availability
- Premium status is checked on app start and updated via listener
- App functions without RevenueCat keys but shows console warnings

### Paywall Options
The app supports two paywall types, configured via `paywallType` in `config/revenueCat.js`:

1. **Code Paywall** (`paywallType: 'code'`) - Default
   - Custom paywall built with React Native components
   - Fully customizable via `config/paywall.js` and `/components/paywall`
   - Navigate with `router.push("/paywall")`

2. **Remote Paywall** (`paywallType: 'remote'`)
   - RevenueCat's remote paywall configured in the RevenueCat dashboard
   - Uses `react-native-purchases-ui` to present native paywall modal
   - Design and content managed in RevenueCat dashboard (no code changes needed)

**Usage**: Use the `usePaywall()` hook for automatic paywall selection:
```javascript
import { usePaywall } from "../hooks/usePaywall";

const { showPaywall } = usePaywall();

// Automatically shows the correct paywall based on config
const handleUpgrade = () => {
  showPaywall();
};
```

## Testing Setup
- Jest configured with `jest-expo` preset
- Run tests with `npm test` for watch mode
