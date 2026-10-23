import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../constants/Fonts';
import Skeleton from '../../components/Skeleton';

export default function SkeletonShowcase() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Skeleton',
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
        <View style={[styles.skeletonRow, { backgroundColor: colors.background }]}>
          <Skeleton
            width={80}
            height={80}
            borderRadius={8}
            style={styles.skeletonAvatar}
          />
          <View style={styles.skeletonTextGroup}>
            <Skeleton width={180} height={18} style={styles.skeletonTextLine} />
            <Skeleton width={120} height={14} style={styles.skeletonTextLine} />
            <Skeleton width={150} height={14} style={styles.skeletonTextLine} />
          </View>
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
  skeletonRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
  },
  skeletonAvatar: {
    marginRight: 16,
  },
  skeletonTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonTextLine: {
    marginBottom: 8,
  },
});
