import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../constants/Fonts';
import QuickActionButton from '../../components/QuickActionButton';
import { IconUser } from '@tabler/icons-react-native';

export default function QuickActionButtonShowcase() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'QuickActionButton',
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
        <View style={styles.buttonWrapper}>
          <QuickActionButton
            icon={<IconUser size={24} />}
            label="Profile"
            onPress={() => console.log("Profile")}
            variant="primary"
          />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    width: 100,
    height: 120,
  },
});
