import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react-native";
import { Fonts } from "../../constants/Fonts";

export default function DialogShowcase() {
  const { colors } = useTheme();
  const [showSimpleDialog, setShowSimpleDialog] = useState(false);
  const [showTwoButtonDialog, setShowTwoButtonDialog] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Dialog",
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Open Dialog"
              onPress={() => setShowSimpleDialog(true)}
            />

            <Button
              title="Open Dialog"
              onPress={() => setShowTwoButtonDialog(true)}
              variant="secondary"
            />
          </View>
        </View>

        {/* Simple Dialog */}
        <Dialog
          visible={showSimpleDialog}
          icon={<IconCheck size={32} color={colors.success} />}
          iconBackground={colors.success}
          title="Success"
          text="Your action was completed successfully!"
          primaryButton={{
            title: "OK",
            onPress: () => setShowSimpleDialog(false),
          }}
          onClose={() => setShowSimpleDialog(false)}
        />

        {/* Two Button Dialog */}
        <Dialog
          visible={showTwoButtonDialog}
          icon={<IconAlertTriangle size={32} color={colors.error} />}
          iconBackground={colors.error}
          title="Confirm Action"
          text="Are you sure you want to proceed with this action? This cannot be undone."
          primaryButton={{
            title: "Confirm",
            onPress: () => setShowTwoButtonDialog(false),
          }}
          secondaryButton={{
            title: "Cancel",
            onPress: () => setShowTwoButtonDialog(false),
          }}
          onClose={() => setShowTwoButtonDialog(false)}
        />
      </View>
    </>
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
  },
  buttonContainer: {
    gap: 16,
    alignItems: "center",
  },
});
