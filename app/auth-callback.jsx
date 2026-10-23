import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import appConfig from "../config/appConfig";
import { authConfig } from "../config/auth";

/**
 * Auth Callback Handler
 *
 * This is a loading screen shown when the magic link is clicked.
 * The actual authentication is handled automatically by SupabaseProvider
 * which listens for deep links and extracts the auth tokens.
 *
 * Deep link format: myapp://auth-callback#access_token=...&refresh_token=...
 */
export default function AuthCallback() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    // Redirect to configured route immediately
    // SupabaseProvider handles the auth token extraction and shows the toast
    const redirectTo = authConfig.redirectAfterLogin || "/(tabs)";
    router.replace(redirectTo);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={require("../assets/images/auth/background.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {/* Logo & Brand */}
          <View style={styles.brandContainer}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.logo}
            />
            <Text style={[styles.brandName, { color: colors.text }]}>{appConfig.appName}</Text>
          </View>

          {/* Loading Card */}
          <View style={[styles.loadingCard, { backgroundColor: colors.card }]}>
            <View style={[styles.spinnerContainer, { backgroundColor: colors.cardLight }]}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Completing authentication</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Just a moment...</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  brandContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
    paddingHorizontal: 20,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 14,
    borderRadius: 16,
  },
  brandName: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  loadingCard: {
    borderRadius: 32,
    marginHorizontal: 24,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
});
