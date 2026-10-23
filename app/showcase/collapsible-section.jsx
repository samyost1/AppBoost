import React from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import CollapsibleSection from "../../components/CollapsibleSection";

export default function CollapsibleSectionShowcase() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Collapsible Section",
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
        <CollapsibleSection title="Frequently Asked Questions">
          <Text style={{ color: colors.text }}>This text will be displayed when the section is expanded.</Text>
        </CollapsibleSection>
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
