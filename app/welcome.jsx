import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import Button from "../components/Button";
import { IconArrowRight, IconCheck } from "@tabler/icons-react-native";
import appConfig from "../config/appConfig";
import { useSupabase } from "./providers/SupabaseProvider";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useSupabase();
  const { colors, isDark } = useTheme();
  const screenHeight = Dimensions.get("screen").height;
  const screenWidth = Dimensions.get("screen").width;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  // Get user's name from email or metadata
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0];
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "there";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={require("../assets/images/auth/background.jpg")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: screenWidth,
          height: screenHeight,
        }}
        resizeMode="cover"
      />

      <View style={styles.content}>
        {/* Logo & Brand */}
        <View style={styles.brandContainer}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={[styles.brandName, { color: colors.text }]}>{appConfig.appName}</Text>
        </View>

        {/* Welcome Card */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Success Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.cardLight }]}>
            <IconCheck size={40} color={colors.primary} strokeWidth={3} />
          </View>

          {/* Welcome Text */}
          <Text style={[styles.title, { color: colors.text }]}>Welcome, {getUserName()}!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You're all set. Let's get started on your journey.
          </Text>

          {/* Continue Button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            fullWidth
            icon={<IconArrowRight size={20} color={colors.white} />}
            iconPosition="right"
            style={styles.continueButton}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  card: {
    borderRadius: 32,
    marginHorizontal: 24,
    paddingVertical: 40,
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  continueButton: {
    width: "100%",
  },
});
