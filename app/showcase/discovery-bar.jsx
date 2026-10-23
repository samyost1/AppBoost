import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Keyboard, Platform, Animated } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import DiscoveryBar from "../../components/DiscoveryBar";
import { IconFlame, IconHeart, IconStar, IconTrendingUp } from "@tabler/icons-react-native";

export default function DiscoveryBarShowcase() {
  const { colors } = useTheme();
  const keyboardPadding = useRef(new Animated.Value(0)).current;
  const activeBarRef = useRef(null); // Track which bar is active

  // Handle keyboard
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        // Only add padding if the bottom bar is active
        if (activeBarRef.current === "bottom") {
          Animated.timing(keyboardPadding, {
            toValue: e.endCoordinates.height,
            duration: Platform.OS === "ios" ? 250 : 100,
            useNativeDriver: false,
          }).start();
        }
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Discovery Bar",
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

      <Animated.View style={[styles.centerContainer, { paddingBottom: keyboardPadding }]}>
        <View style={styles.exampleWrapper}>
          <Text style={[styles.exampleTitle, { color: colors.text }]}>Popular / Favorites</Text>
          <DiscoveryBar
            onSearchOpen={() => {
              activeBarRef.current = "top";
            }}
            onSearchChange={(text) => console.log("Search 1:", text)}
            onFilterChange={(filter) => console.log("Filter 1:", filter)}
            initialFilter="popular"
            option1={{ id: "popular", label: "Popular", icon: IconFlame }}
            option2={{ id: "favorites", label: "Favorites", icon: IconHeart }}
            activeColor={colors.error}
            activeBackgroundColor="#fee2e2"
            inactiveColor={colors.textSecondary}
            backgroundColor={colors.card}
          />
        </View>

        <View style={styles.exampleWrapper}>
          <Text style={[styles.exampleTitle, { color: colors.text }]}>Trending / Featured</Text>
          <DiscoveryBar
            onSearchOpen={() => {
              activeBarRef.current = "bottom";
            }}
            onSearchChange={(text) => console.log("Search 2:", text)}
            onFilterChange={(filter) => console.log("Filter 2:", filter)}
            initialFilter="trending"
            option1={{ id: "trending", label: "Trending", icon: IconTrendingUp }}
            option2={{ id: "featured", label: "Featured", icon: IconStar }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 60,
  },
  exampleWrapper: {
    width: "100%",
    gap: 12,
  },
  exampleTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    textAlign: "center",
  },
});
