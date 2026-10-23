import React from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import ImageCard from "../../components/ImageCard";

export default function ImageCardShowcase() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "ImageCard",
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
        <ImageCard
          title="La Costa"
          subtitle="Peru • South America"
          image={{
            uri: "https://picsum.photos/1140",
          }}
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
    paddingHorizontal: 20,
  },
});
