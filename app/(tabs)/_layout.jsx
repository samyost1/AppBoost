import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import TabBar from "../../components/TabBar";

import { useUserData } from "../providers/userDataProvider";
import OnboardingScreen from "../onboardingScreen";

export default function TabLayout() {
  const { colors } = useTheme();
  const { isFirstTimeUser, hasFinishedOnboarding, isLoading } = useUserData();

  // If user data is still loading, render nothing (or you can show a loader here).
  if (isLoading || isFirstTimeUser === null) {
    return null;
  }

  // If it's the user's first time AND they haven't finished onboarding, show onboarding.
  if (!hasFinishedOnboarding) {
    return <OnboardingScreen />;
  }

  // Otherwise, render the normal tabs.
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleStyle: {
            color: colors.text,
            fontFamily: Fonts.bold,
          },
          headerTitleAlign: "center",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitleStyle: {
            color: colors.text,
            fontFamily: Fonts.bold,
          },
          headerTitleAlign: "center",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Showcase",
          headerTitleStyle: {
            color: colors.text,
            fontFamily: Fonts.bold,
          },
          headerTitleAlign: "center",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </Tabs>
  );
}
