import React from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import ButtonHorizontal from "../../components/ButtonHorizontal";
import { IconLibrary } from "@tabler/icons-react-native";

export default function ButtonHorizontalShowcase() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "ButtonHorizontal",
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
        <ButtonHorizontal
          title={"Add to library"}
          icon={<IconLibrary size={24} color={colors.primary} />}
          onPress={() => {
            console.log("Add to library button pressed");
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
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 20,
  },
});
