import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import { IconCheck } from "@tabler/icons-react-native";

const Checkbox = ({
  text,
  checked = false,
  onToggle,
  textStyle,
  containerStyle,
}) => {
  const { colors } = useTheme();

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!checked);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handleToggle}
      activeOpacity={1}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: 20,
            height: 20,
            borderColor: checked ? colors.primary : colors.cardBorder,
            backgroundColor: checked ? colors.primary : colors.card,
          },
        ]}
      >
        {checked && (
          <View style={styles.checkmark}>
            <IconCheck size={20 * 0.8} color={colors.white} />
          </View>
        )}
      </View>
      <Text style={[styles.text, { color: colors.text }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
});

export default Checkbox;
