import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Fonts } from '../constants/Fonts';

const QuickActionButton = ({ icon, label, onPress, variant = 'primary' }) => {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          iconColor: colors.primary,
          textColor: colors.primary,
        };
      case 'tertiary':
        return {
          backgroundColor: colors.secondaryLight,
          iconColor: colors.primary,
          textColor: colors.primary,
        };
      default:
        return {
          backgroundColor: colors.primary,
          iconColor: colors.white,
          textColor: colors.white,
        };
    }
  };

  const buttonStyle = getButtonStyle();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
      style={styles.container}
    >
      <View style={[
        styles.button,
        { backgroundColor: buttonStyle.backgroundColor, shadowColor: colors.black },
        isPressed && styles.pressed
      ]}>
        <View style={styles.iconContainer}>
          {React.cloneElement(icon, { color: buttonStyle.iconColor })}
        </View>
        <Text style={[styles.label, { color: buttonStyle.textColor }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
  },
  button: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});

export default QuickActionButton; 