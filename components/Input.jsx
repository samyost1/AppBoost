import React, { useState, forwardRef } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  error,
  leftIcon,
  style,
  inputStyle,
  ...props
}, ref) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <View style={[
        styles.inputContainer,
        {
          borderColor: colors.inputBorder,
          backgroundColor: colors.inputBackground,
        },
        isFocused && {
          borderColor: colors.primary,
        },
        error && {
          borderColor: colors.error,
        },
        !editable && {
          backgroundColor: colors.gray,
          borderColor: colors.gray,
        }
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            { color: colors.inputText },
            multiline && styles.inputMultiline,
            !editable && { color: colors.textMuted },
            leftIcon && styles.inputWithIcon,
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          {...props}
        />
      </View>

      <View style={styles.errorContainer}>
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        ) : (
          <Text style={styles.errorPlaceholder}> </Text>
        )}
      </View>
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    padding: 0,
    minHeight: 20,
  },
  inputMultiline: {
    textAlignVertical: "top",
    minHeight: 80,
  },
  leftIconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  errorContainer: {
    minHeight: 20,
    marginTop: 4,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  errorPlaceholder: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    opacity: 0,
  },
});

export default Input;
