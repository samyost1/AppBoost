import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import Onboarding from "../components/Onboarding";
import { useUserData } from "./providers/userDataProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import appConfig from "../config/appConfig";
import { usePostHogAnalytics } from "./providers/PostHogProvider";

export default function OnboardingScreen() {
  const router = useRouter();
  const { finishOnboarding } = useUserData();
  const { capture } = usePostHogAnalytics();
  const { colors } = useTheme();

  // Track onboarding started
  useEffect(() => {
    capture("onboarding_started");
  }, []);

  // Onboarding data for the dynamic onboarding screen
  const onboardingData = [
    {
      image: require("../assets/images/onboarding/screen1.jpg"),
      title: "Ready to Launch",
      description: "Start building your app instantly with pre-configured payments, database, push notifications and components.",
    },
    {
      image: require("../assets/images/onboarding/screen2.jpg"),
      title: "Built-in Services",
      description: "RevenueCat for payments, Supabase for backend services, and Expo notifications - all integrated and ready to use out of the box.",
    },
    {
      image: require("../assets/images/onboarding/screen3.jpg"),
      title: "Beautiful Components",
      description: "Leverage a rich library of reusable components designed to look great and speed up your development. Build polished screens with ease.",
    },
  ];

  const handleOnboardingDone = async () => {
    capture("onboarding_completed");
    await finishOnboarding();
  };

  const handleStepChange = (step, totalSteps) => {
    capture("onboarding_step_viewed", {
      step: step + 1,
      total_steps: totalSteps,
    });
  };

  const handleSkip = (currentStep, totalSteps) => {
    capture("onboarding_skipped", {
      skipped_at_step: currentStep + 1,
      total_steps: totalSteps,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Onboarding
        screens={onboardingData}
        onDone={handleOnboardingDone}
        onStepChange={handleStepChange}
        onSkip={handleSkip}
      />
    </SafeAreaView>
  );
}