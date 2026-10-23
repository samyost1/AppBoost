import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "./providers/ThemeProvider";
import { RevenueCatProvider } from "./providers/RevenueCatProvider";
import { UserDataProvider } from "./providers/userDataProvider";
import { SupabaseProvider } from "./providers/SupabaseProvider";
import { PushNotificationProvider } from "./providers/PushNotificationProvider";
import { PostHogProvider } from "./providers/PostHogProvider";
import createToastConfig from "../config/toastConfig";
import ThemeTransitionOverlay from "../components/ThemeTransitionOverlay";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Inner component that uses the theme
function AppContent() {
  const { isDark, colors } = useTheme();

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="fetchDemo" options={{ title: "Products Grid" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Toast config={createToastConfig(colors)} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    DBBlack: require("../assets/fonts/DMSans-Black.ttf"),
    DBBlackItalic: require("../assets/fonts/DMSans-BlackItalic.ttf"),
    DBBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DBBoldItalic: require("../assets/fonts/DMSans-BoldItalic.ttf"),
    DBExtraBold: require("../assets/fonts/DMSans-ExtraBold.ttf"),
    DBExtraBoldItalic: require("../assets/fonts/DMSans-ExtraBoldItalic.ttf"),
    DBExtraLight: require("../assets/fonts/DMSans-ExtraLight.ttf"),
    DBExtraLightItalic: require("../assets/fonts/DMSans-ExtraLightItalic.ttf"),
    DBItalic: require("../assets/fonts/DMSans-Italic.ttf"),
    DBLight: require("../assets/fonts/DMSans-Light.ttf"),
    DBLightItalic: require("../assets/fonts/DMSans-LightItalic.ttf"),
    DBMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DBMediumItalic: require("../assets/fonts/DMSans-MediumItalic.ttf"),
    DBRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    DBSemiBold: require("../assets/fonts/DMSans-SemiBold.ttf"),
    DBSemiBoldItalic: require("../assets/fonts/DMSans-SemiBoldItalic.ttf"),
    DBThin: require("../assets/fonts/DMSans-Thin.ttf"),
    DBThinItalic: require("../assets/fonts/DMSans-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SupabaseProvider>
      <RevenueCatProvider>
        <PushNotificationProvider>
          <UserDataProvider>
            <PostHogProvider>
              <ThemeProvider defaultTheme="lightTeal">
                <AppContent />
              </ThemeProvider>
            </PostHogProvider>
          </UserDataProvider>
        </PushNotificationProvider>
      </RevenueCatProvider>
    </SupabaseProvider>
  );
}
