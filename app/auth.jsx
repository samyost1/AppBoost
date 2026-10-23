import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
  Image,
  ImageBackground,
  Animated,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import Button from "../components/Button";
import Input from "../components/Input";
import { IconBrandGoogleFilled, IconX, IconMail, IconSend, IconSparkles, IconLink, IconUserCircle } from "@tabler/icons-react-native";
import Constants from "expo-constants";
import { authConfig } from "../config/auth";
import appConfig from "../config/appConfig";
import { useSupabase } from "./providers/SupabaseProvider";
import { usePostHogAnalytics } from "./providers/PostHogProvider";
import Toast from "react-native-toast-message";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// User-friendly error toast - hides technical details from users
const showAuthError = () => {
  Toast.show({
    type: "error",
    text1: "Something went wrong",
    text2: "Please try again. If the problem persists, contact support.",
  });
};

const AuthScreen = () => {
  const router = useRouter();
  const { sendMagicLink, supabase, isConfigured, user } = useSupabase();
  const { capture, identify } = usePostHogAnalytics();
  const { colors, isDark } = useTheme();
  const screenHeight = Dimensions.get("screen").height;
  const screenWidth = Dimensions.get("screen").width;
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const emailSentAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const keyboardPadding = useRef(new Animated.Value(0)).current;

  // Track auth screen viewed
  useEffect(() => {
    capture("auth_screen_viewed");
  }, []);

  // Handle keyboard - adjust bottom card position
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        // Calculate how much to move the card up
        // The card needs to move up so the input stays visible above keyboard
        // We subtract the space already at the bottom (card's original margin + some buffer)
        const keyboardHeight = e.endCoordinates.height;
        const bottomBuffer = 50; // Space to keep between input and keyboard
        const adjustment = keyboardHeight - bottomBuffer;

        Animated.timing(keyboardPadding, {
          toValue: Math.max(0, adjustment),
          duration: Platform.OS === "ios" ? 250 : 100,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(keyboardPadding, {
          toValue: 0,
          duration: Platform.OS === "ios" ? 250 : 100,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // Prevent back button if auth is not closable
  useEffect(() => {
    if (!authConfig.isClosable) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );

      return () => backHandler.remove();
    }
  }, [authConfig.isClosable]);

  // Redirect when user logs in (e.g., after Google Sign-In)
  useEffect(() => {
    if (user) {
      // Identify user in PostHog
      identify(user.id, {
        email: user.email,
        created_at: user.created_at,
      });
      capture("user_logged_in", {
        method: "magic_link_or_oauth",
      });
      const redirectTo = authConfig.redirectAfterLogin || "/(tabs)";
      router.replace(redirectTo);
    }
  }, [user]);

  const handleClose = () => {
    router.back();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleMagicLink = async () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!isConfigured) {
        Toast.show({
          type: "error",
          text1: "Configuration Error",
          text2: "Supabase is not configured. Please check your settings.",
        });
        return;
      }

      setLoading(true);
      capture("magic_link_requested");

      try {
        // Generate redirect URI from app.json scheme (e.g., "appboost://auth-callback")
        const scheme = Constants.expoConfig?.scheme || "myapp";
        const redirectUrl = `${scheme}://auth-callback`;

        await sendMagicLink(email, redirectUrl);

        capture("magic_link_sent");

        // Show the email sent confirmation with animation
        setShowEmailForm(false);
        setShowEmailSent(true);

        // Animate in the email sent screen
        Animated.spring(emailSentAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      } catch (error) {
        console.error("Magic link error:", error);
        capture("magic_link_failed", {
          error: error.message || "Unknown error",
        });
        showAuthError();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      Toast.show({
        type: "error",
        text1: "Supabase Not Configured",
        text2: "Please set up Supabase credentials to use Google Sign-In",
      });
      return;
    }

    setLoading(true);
    capture("google_sign_in_started");

    try {
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      });

      // Check if Google Play Services are available (Android)
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const response = await GoogleSignin.signIn();
      console.log("Google Sign-In response:", JSON.stringify(response, null, 2));

      // Handle the response - check for idToken in different possible locations
      const idToken = response.data?.idToken || response.idToken;

      if (idToken) {
        console.log("Got ID token, signing in to Supabase...");
        // Sign in to Supabase with the ID token
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });

        if (error) {
          console.error("Supabase signInWithIdToken error:", error);
          capture("google_sign_in_failed", {
            error: error.message || "Supabase auth error",
          });
          throw error;
        }
        console.log("Supabase sign-in successful:", data?.user?.email);
        capture("google_sign_in_completed");
      } else {
        console.error("No ID token in Google Sign-In response");
        capture("google_sign_in_failed", {
          error: "No ID token received",
        });
        showAuthError();
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);

      // Don't show error if user cancelled
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        capture("google_sign_in_cancelled");
        return;
      }

      capture("google_sign_in_failed", {
        error: error.message || "Unknown error",
        code: error.code,
      });

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: "error",
          text1: "Google Play Services Required",
          text2: "Please update Google Play Services and try again.",
        });
      } else {
        showAuthError();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithEmail = () => {
    setShowEmailForm(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    });
  };

  const handleBackToButtons = () => {
    Keyboard.dismiss();
    // Animate out email sent screen if showing
    if (showEmailSent) {
      Animated.timing(emailSentAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowEmailSent(false);
        setEmail("");
        setErrors({});
        // Reset slideAnim to ensure OAuth buttons are visible
        slideAnim.setValue(0);
      });
    } else {
      // Animate out email form
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowEmailForm(false);
        setEmail("");
        setErrors({});
      });
    }
  };

  const handleUseAnotherAccount = () => {
    // Animate out email sent, then show email form
    Animated.timing(emailSentAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowEmailSent(false);
      setShowEmailForm(true);
      setEmail("");
      setErrors({});

      // Animate in the email form
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          emailInputRef.current?.focus();
        }, 100);
      });
    });
  };

  const handleResendLink = async () => {
    await handleMagicLink();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
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

      {/* Close Button */}
      {authConfig.isClosable && (
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: "absolute",
            top: screenHeight * 0.05,
            right: 20,
            zIndex: 10,
            padding: 8,
          }}
        >
          <IconX size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      <View style={styles.keyboardView}>
        {/* Logo & Brand - Fixed at top */}
        <View style={styles.brandContainer}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={[styles.brandName, { color: colors.text }]}>Welcome to {appConfig.appName}</Text>
        </View>

        {/* Bottom Card */}
        <Animated.View style={[styles.bottomCard, { backgroundColor: colors.card, marginBottom: Animated.add(8, keyboardPadding) }]}>
          {!showEmailSent ? (
            <View style={styles.cardContent}>
              {/* Header + OAuth Buttons */}
              <Animated.View
                style={[
                  styles.scrollContent,
                  {
                    opacity: slideAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0, 0],
                    }),
                  },
                ]}
                pointerEvents={showEmailForm ? "none" : "auto"}
              >
                {/* Icon and Header Section */}
                <View style={styles.headerSection}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.cardLight }]}>
                    <IconSparkles size={28} color={colors.text} />
                  </View>
                  <Text style={[styles.title, { color: colors.text }]}>{authConfig.loginTitle}</Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{authConfig.loginSubtitle}</Text>
                </View>

                {/* OAuth Buttons */}
                <View style={styles.oauthContainer}>
                  <Button
                    title="Sign in with Google"
                    onPress={handleGoogleSignIn}
                    variant="primary"
                    fullWidth
                    disabled={loading}
                    icon={<IconBrandGoogleFilled size={20} color={colors.white} />}
                    style={styles.oauthButton}
                  />

                  <Button
                    title="Continue with email"
                    onPress={handleContinueWithEmail}
                    variant="secondary"
                    fullWidth
                    icon={<IconMail size={20} color={colors.text} />}
                    style={styles.emailButton}
                  />
                </View>
              </Animated.View>

              {/* Email Input Form - Overlay */}
              <Animated.View
                style={[
                  styles.emailFormContainer,
                  {
                    opacity: slideAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0, 1],
                    }),
                  },
                ]}
                pointerEvents={showEmailForm ? "auto" : "none"}
              >
                {/* Close Button */}
                <TouchableOpacity style={[styles.emailCloseButton, { backgroundColor: colors.cardLight }]} onPress={handleBackToButtons}>
                  <IconX size={24} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.emailFloatingTitle, { color: colors.text }]}>Enter your email address</Text>
                <Input
                  ref={emailInputRef}
                  placeholder="Your Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onSubmitEditing={handleMagicLink}
                  returnKeyType="send"
                  leftIcon={<IconMail size={20} color={colors.textSecondary} />}
                  error={errors.email}
                  style={styles.emailFloatingInputContainer}
                />
                <Button
                  title={loading ? "Sending..." : "Send Magic Link"}
                  onPress={handleMagicLink}
                  variant="primary"
                  icon={<IconSend size={20} color={colors.white} />}
                  style={styles.emailFloatingButton}
                />
              </Animated.View>
            </View>
          ) : (
            /* Email Sent Confirmation - Non-scrollable */
            <Animated.View
              style={[
                styles.emailSentContainer,
                {
                  opacity: emailSentAnim,
                  transform: [
                    {
                      translateY: emailSentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: emailSentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Icon */}
              <View style={[styles.emailSentIconContainer, { backgroundColor: colors.cardLight }]}>
                <IconMail size={48} color={colors.primary} />
              </View>

              {/* Title */}
              <Text style={[styles.emailSentTitle, { color: colors.text }]}>An email is on the way!</Text>

              {/* Description */}
              <Text style={[styles.emailSentDescription, { color: colors.textSecondary }]}>A magic link was sent to:</Text>
              <Text style={[styles.emailSentEmail, { color: colors.text }]}>{email}</Text>

              {/* Can't find email text */}
              <Text style={[styles.emailSentCantFind, { color: colors.textSecondary }]}>Can't find the email?</Text>

              {/* Buttons */}
              <Button
                title="Resend link"
                onPress={handleResendLink}
                variant="primary"
                fullWidth
                disabled={loading}
                icon={<IconLink size={20} color={colors.white} />}
                style={styles.emailSentButton}
              />
              <Button
                title="Use another account"
                onPress={handleUseAnotherAccount}
                variant="secondary"
                fullWidth
                icon={<IconUserCircle size={20} color={colors.text} />}
                style={styles.emailSentButton}
              />
            </Animated.View>
          )}
          </Animated.View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardContent: {
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
  },
  brandContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 72,
    paddingHorizontal: 20,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 14,
    marginRight: 0,
    borderRadius: 16,
  },
  brandName: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  bottomCard: {
    borderRadius: 32,
    marginHorizontal: 8,
    maxHeight: "65%",
  },
  headerSection: {
    alignItems: "flex-start",
    marginBottom: 32,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  oauthContainer: {
    gap: 12,
    marginBottom: 0,
  },
  oauthButton: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  emailButton: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
  footerLink: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  emailFormContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  emailCloseButton: {
    alignSelf: "center",
    marginBottom: 24,
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emailFloatingTitle: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    marginBottom: 20,
    textAlign: "center",
  },
  emailFloatingInputContainer: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 0,
  },
  emailFloatingButton: {
    width: "100%",
    alignSelf: "center",
  },
  emailSentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 24,
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  emailSentIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 24,
  },
  emailSentTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 16,
    textAlign: "center",
  },
  emailSentDescription: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: 8,
  },
  emailSentEmail: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 32,
  },
  emailSentCantFind: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 16,
  },
  emailSentButton: {
    width: "100%",
    marginBottom: 12,
  },
});

export default AuthScreen;
