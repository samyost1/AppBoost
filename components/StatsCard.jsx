import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Fonts } from '../constants/Fonts';

const StatsCard = ({ title, value, subtitle, icon, onPress, trend }) => {
  const { colors, isDark } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            shadowColor: colors.black,
            borderLeftColor: colors.primary,
          },
          isPressed && styles.pressed
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text>
            {icon && (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: isDark ? colors.cardLight : colors.secondaryLight }
                ]}
              >
                {icon}
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
          )}
          {trend && (
            <View style={styles.trendContainer}>
              <Text style={[styles.trend, { color: trend.positive ? colors.success : colors.error }]}>
                {trend.positive ? '↗' : '↘'} {trend.value}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 6,
  },
  content: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginBottom: 8,
  },
  trendContainer: {
    marginTop: 4,
  },
  trend: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
});

export default StatsCard;
