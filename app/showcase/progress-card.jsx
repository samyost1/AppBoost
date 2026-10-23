import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../constants/Fonts';
import ProgressCard from '../../components/ProgressCard';

export default function ProgressCardShowcase() {
  const { colors } = useTheme();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          // Reset to 0 and start again
          return 0;
        }
        return prev + 1;
      });
    }, 50); // Update every 50ms for smooth animation (5 seconds total)

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'ProgressCard',
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
        <ProgressCard
          title="Services Ready"
          current={2}
          total={3}
        />

        <View style={styles.spacer} />

        <ProgressCard
          title="Loading Progress"
          current={loadingProgress}
          total={100}
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
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  spacer: {
    height: 20,
  },
});
