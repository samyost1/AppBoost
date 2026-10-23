import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import ProfileCard from "../../components/ProfileCard";

export default function ProfileCardShowcase() {
  const { colors } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "ProfileCard",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: Fonts.semiBold,
          },
        }}
      />

      <View style={styles.centerContainer}>
        <ProfileCard
          name="Sam"
          showPremiumIcon={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    alignContent: "center",
    paddingHorizontal: 20,
  },
});
