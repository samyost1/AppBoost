import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../constants/Fonts';
import StatsCard from '../../components/StatsCard';
import { IconActivity } from '@tabler/icons-react-native';

export default function StatsCardShowcase() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'StatsCard',
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
        <View style={styles.cardWrapper}>
          <StatsCard
            title="Activity"
            value={42}
            subtitle="This month"
            icon={<IconActivity size={20} color={colors.primary} />}
            trend={{
              positive: true,
              value: "+15%"
            }}
            onPress={() => console.log("Activity stats")}
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
  cardWrapper: {
    width: 200,
    height: 140,
  },
});
