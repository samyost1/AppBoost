import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const ProgressCard = ({
  title,
  current,
  total,
  progressColor,
  backgroundColor,
  barBackgroundColor,
  style
}) => {
  const { colors } = useTheme();
  const percentage = total > 0 ? (current / total) * 100 : 0;

  // Use theme-aware defaults if not provided
  const resolvedProgressColor = progressColor || colors.primary;
  const resolvedBackgroundColor = backgroundColor || colors.card;
  const resolvedBarBackgroundColor = barBackgroundColor || colors.gray;

  return (
    <View style={[styles.container, { backgroundColor: resolvedBackgroundColor }, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.count, { color: resolvedProgressColor }]}>
          {current}/{total}
        </Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: resolvedBarBackgroundColor }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: resolvedProgressColor
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  count: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProgressCard; 