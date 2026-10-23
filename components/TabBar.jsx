import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import { IconBrandReactNative, IconHome, IconUser } from "@tabler/icons-react-native";

const TabBar = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();

  const icons = {
    index: (props) => <IconHome size={32} {...props} />,
    explore: (props) => <IconBrandReactNative size={32} {...props} />,
    profile: (props) => <IconUser size={32} {...props} />,
  };

  const animatedValues = state.routes.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    state.routes.forEach((route, index) => {
      const isFocused = state.index === index;
      Animated.timing(animatedValues[index], {
        toValue: isFocused ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.tabBarBackground,
          shadowColor: colors.black,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const animatedStyle = {
          transform: [
            {
              translateY: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              }),
            },
          ],
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={[
              styles.tabBarItem,
              animatedStyle,
            ]}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={1}
          >
            <View style={[
              styles.iconContainer,
              isFocused && [
                styles.activeIconContainer,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]
            ]}>
              {icons[route.name]({
                color: isFocused ? colors.white : colors.tabBarInactiveTintColor,
              })}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    borderCurve: "continuous",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  iconContainer: {
    padding: 15,
    borderRadius: 60,
  },
  activeIconContainer: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    borderRadius: 60,
  },
});

export default TabBar;
