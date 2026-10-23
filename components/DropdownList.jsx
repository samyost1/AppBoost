import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import { IconChevronDown } from "@tabler/icons-react-native";

const DropdownList = ({ options, placeholder, onSelect, header }) => {
  const { colors, isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const newState = !expanded;
    setExpanded(newState);

    Animated.timing(rotateAnim, {
      toValue: newState ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: newState ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityAnim, {
      toValue: newState ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    setExpanded(false);

    if (onSelect) {
      onSelect(option);
    }

    if (expanded) {
      toggleDropdown();
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const scaleY = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={[
          styles.header,
          { backgroundColor: colors.primary },
          expanded && {
            backgroundColor: colors.primaryDark,
            shadowColor: colors.black,
          }
        ]}
        activeOpacity={0.8}
      >
        <Text style={[styles.headerText, { color: colors.white }]} numberOfLines={1}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <IconChevronDown size={22} color={colors.white} />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View
          style={[
            styles.optionsWrapper,
            {
              backgroundColor: colors.card,
              shadowColor: colors.black,
              opacity: opacityAnim,
              transform: [{ scaleY }],
            },
          ]}
        >
          <View style={[styles.optionsContainer, { backgroundColor: colors.card }]}>
            {header && (
              <View style={styles.headerContainer}>
                <Text style={[styles.optionsHeaderText, { color: colors.textMuted }]}>
                  {header}
                </Text>
              </View>
            )}
            {options.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.option,
                  selectedOption?.value === item.value && {
                    backgroundColor: isDark ? colors.cardLight : colors.secondaryLight,
                    ...styles.selectedOption,
                  },
                ]}
                onPress={() => handleOptionPress(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.text },
                    selectedOption?.value === item.value && {
                      fontFamily: Fonts.bold,
                      color: colors.primary,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 8,
    zIndex: 10,
    width: 200,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
  },
  headerText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginRight: 10,
    flexShrink: 1,
  },
  optionsWrapper: {
    position: "absolute",
    top: "100%",
    marginTop: 4,
    left: 0,
    right: 0,
    borderRadius: 8,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
    transformOrigin: "top",
    paddingVertical: 4,
  },
  optionsContainer: {},
  headerContainer: {
    paddingTop: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  optionsHeaderText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  selectedOption: {
    borderRadius: 8,
    marginVertical: 2,
  },
  optionText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});

export default DropdownList;
