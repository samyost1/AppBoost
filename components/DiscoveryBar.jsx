import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { IconSearch, IconFlame, IconHeart, IconX } from "@tabler/icons-react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const DiscoveryBar = ({
  onSearchChange,
  onSearchOpen,
  onSearchClose,
  onFilterChange,
  initialFilter = "option1",
  option1 = { id: "option1", label: "Option 1", icon: IconFlame },
  option2 = { id: "option2", label: "Option 2", icon: IconHeart },
  activeColor,
  activeBackgroundColor,
  inactiveColor,
  backgroundColor,
}) => {
  const { colors, isDark } = useTheme();

  // Use theme-aware defaults if not provided
  const resolvedActiveColor = activeColor || colors.primary;
  const resolvedActiveBackgroundColor = activeBackgroundColor || (isDark ? colors.cardLight : colors.secondaryLight);
  const resolvedInactiveColor = inactiveColor || colors.textMuted;
  const resolvedBackgroundColor = backgroundColor || colors.card;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);
  const { width: screenWidth } = useWindowDimensions();

  // Calculate responsive widths with 40px total horizontal padding
  const containerWidth = screenWidth - 40;
  const toggleGroupWidth = containerWidth - 64;
  const toggleContentWidth = toggleGroupWidth - 6;
  const tabWidth = toggleContentWidth / 2;

  // Animated values
  const searchProgress = useSharedValue(0);
  const tabProgress = useSharedValue(activeFilter === option1.id ? 0 : 1);

  // Get icon components
  const Option1Icon = option1.icon;
  const Option2Icon = option2.icon;

  // Spring configuration
  const springConfig = {
    damping: 28,
    stiffness: 320,
    mass: 0.9,
  };

  const tabSpringConfig = {
    damping: 28,
    stiffness: 450,
    mass: 0.8,
  };

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else if (!isSearchOpen && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    searchProgress.value = withSpring(isSearchOpen ? 1 : 0, springConfig);
  }, [isSearchOpen]);

  useEffect(() => {
    tabProgress.value = withSpring(activeFilter === option1.id ? 0 : 1, tabSpringConfig);
  }, [activeFilter]);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  const handleFilterChange = (filter) => {
    if (!isSearchOpen) {
      setActiveFilter(filter);
      if (onFilterChange) {
        onFilterChange(filter);
      }
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchText("");
    if (onSearchChange) {
      onSearchChange("");
    }
    if (onSearchClose) {
      onSearchClose();
    }
  };

  // Animated styles
  const searchBarCollapsedWidth = 56;
  const searchBarExpandedWidth = containerWidth - 64;
  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: searchBarCollapsedWidth + searchProgress.value * (searchBarExpandedWidth - searchBarCollapsedWidth),
    };
  });

  const actionPillCollapsedWidth = 56;
  const actionPillAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: actionPillCollapsedWidth + (1 - searchProgress.value) * (toggleGroupWidth - actionPillCollapsedWidth),
    };
  });

  const searchInputOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: searchProgress.value,
    };
  });

  const toggleGroupOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - searchProgress.value,
    };
  });

  const closeIconOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: searchProgress.value,
    };
  });

  const activeBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabProgress.value * tabWidth }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchBar,
            searchBarAnimatedStyle,
            {
              backgroundColor: resolvedBackgroundColor,
              shadowColor: colors.black,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.searchIconContainer}
            onPress={() => {
              if (!isSearchOpen) {
                setIsSearchOpen(true);
                onSearchOpen && onSearchOpen();
              }
            }}
            activeOpacity={isSearchOpen ? 1 : 0.7}
          >
            <IconSearch size={24} color={colors.text} strokeWidth={2.5} />
          </TouchableOpacity>

          <Animated.View
            style={[styles.searchInputWrapper, searchInputOpacityStyle]}
            pointerEvents={isSearchOpen ? "auto" : "none"}
          >
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, { color: colors.text, cursorColor: colors.primary }]}
              placeholder="Search"
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={handleSearchTextChange}
            />
          </Animated.View>
        </Animated.View>

        {/* Action Pill / Close Button */}
        <Animated.View
          style={[
            styles.actionPill,
            actionPillAnimatedStyle,
            {
              backgroundColor: resolvedBackgroundColor,
              shadowColor: colors.black,
            },
          ]}
        >
          {/* Toggle Group Content */}
          <Animated.View
            style={[styles.toggleGroup, toggleGroupOpacityStyle, { width: toggleGroupWidth }]}
            pointerEvents={isSearchOpen ? "none" : "auto"}
          >
            <View style={styles.toggleContent}>
              {/* Animated sliding background */}
              <Animated.View
                style={[
                  styles.slidingBackground,
                  activeBackgroundStyle,
                  { backgroundColor: resolvedActiveBackgroundColor },
                ]}
              />

              {/* Option 1 Tab */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => handleFilterChange(option1.id)}
                activeOpacity={0.7}
              >
                <View style={styles.toggleButtonContent}>
                  <Option1Icon
                    size={20}
                    color={activeFilter === option1.id ? resolvedActiveColor : resolvedInactiveColor}
                    fill={activeFilter === option1.id ? resolvedActiveColor : "transparent"}
                    strokeWidth={2.5}
                  />
                  <Text
                    style={[
                      styles.toggleButtonText,
                      { color: activeFilter === option1.id ? resolvedActiveColor : resolvedInactiveColor },
                    ]}
                  >
                    {option1.label}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Option 2 Tab */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => handleFilterChange(option2.id)}
                activeOpacity={0.7}
              >
                <View style={styles.toggleButtonContent}>
                  <Option2Icon
                    size={20}
                    color={activeFilter === option2.id ? resolvedActiveColor : resolvedInactiveColor}
                    fill={activeFilter === option2.id ? resolvedActiveColor : "transparent"}
                    strokeWidth={2.5}
                  />
                  <Text
                    style={[
                      styles.toggleButtonText,
                      { color: activeFilter === option2.id ? resolvedActiveColor : resolvedInactiveColor },
                    ]}
                  >
                    {option2.label}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Close Icon */}
          <Animated.View
            style={[styles.closeIconContainer, closeIconOpacityStyle]}
            pointerEvents={isSearchOpen ? "auto" : "none"}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseSearch}
              activeOpacity={0.7}
            >
              <IconX size={24} color={colors.text} strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  container: {
    position: "relative",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  searchBar: {
    position: "relative",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  searchIconContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  searchInputWrapper: {
    position: "absolute",
    left: 56,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingRight: 16,
  },
  searchInput: {
    height: "100%",
    width: "100%",
    fontSize: 18,
    fontFamily: Fonts.medium,
  },
  actionPill: {
    position: "relative",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  toggleGroup: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    alignItems: "center",
    padding: 3,
  },
  toggleContent: {
    position: "relative",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  slidingBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
    borderRadius: 25,
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    height: "100%",
  },
  toggleButtonContent: {
    position: "relative",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  closeIconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  closeButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DiscoveryBar;
