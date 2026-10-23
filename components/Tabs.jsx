import React, { useState, useEffect, memo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const Tabs = ({
  tabs,
  onTabChange,
  activeTabId = null,
  scrollable = false,
  style,
  indicatorColor,
}) => {
  const { colors, isDark } = useTheme();

  // Use theme-aware default for indicator color
  const resolvedIndicatorColor = indicatorColor || colors.white;

  // Static initial state to avoid re-renders
  const initialActiveTab = tabs.length > 0 ? tabs[0].id : null;
  const [internalActiveTab, setInternalActiveTab] = useState(initialActiveTab);

  // Prioritize external control if provided
  const activeTab = activeTabId !== null ? activeTabId : internalActiveTab;

  // Animation values
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Refs for measuring tab positions
  const tabRefs = useRef({});
  const containerRef = useRef(null);

  // Process tabs once and memoize to prevent re-renders
  const processedTabs = React.useMemo(() => {
    return tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === activeTab,
    }));
  }, [tabs, activeTab]);

  // Update state when external prop changes
  useEffect(() => {
    if (activeTabId !== null && activeTabId !== internalActiveTab) {
      setInternalActiveTab(activeTabId);
    }
  }, [activeTabId]);

  // Update indicator position when active tab changes
  useEffect(() => {
    updateIndicatorPosition();
  }, [activeTab, tabs]);

  const updateIndicatorPosition = () => {
    const activeTabRef = tabRefs.current[activeTab];
    if (activeTabRef) {
      activeTabRef.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          indicatorPosition.value = withTiming(x, {
            duration: 200,
            easing: Easing.out(Easing.cubic),
          });
          indicatorWidth.value = withTiming(width, {
            duration: 200,
            easing: Easing.out(Easing.cubic),
          });
        },
        () => {}
      );
    }
  };

  const handleTabPress = (tabId) => {
    if (tabId !== activeTab) {
      setInternalActiveTab(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  // Animated indicator style
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
      backgroundColor: resolvedIndicatorColor,
    };
  });

  // Render a single tab - extracted for clarity
  const renderTab = (tab) => {
    const isActive = tab.id === activeTab;

    return (
      <TouchableOpacity
        key={tab.id}
        ref={(ref) => {
          if (ref) {
            tabRefs.current[tab.id] = ref;
          }
        }}
        style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
        onPress={() => handleTabPress(tab.id)}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          {tab.icon && (
            <View style={styles.iconContainer}>
              {React.cloneElement(tab.icon, {
                size: 18,
                color: isActive ? colors.primary : colors.textMuted,
              })}
            </View>
          )}
          <Text
            style={[
              styles.tabText,
              { color: isActive ? colors.primary : colors.textMuted },
            ]}
          >
            {tab.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render content based on scrollable prop
  if (scrollable) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.tabsWrapper, { backgroundColor: colors.card }]}>
          <ScrollView
            ref={containerRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollableContent}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            overScrollMode="never"
            scrollsToTop={false}
            {...(Platform.OS === "android"
              ? { removeClippedSubviews: false }
              : {})}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                styles.indicator,
                animatedIndicatorStyle,
                { shadowColor: colors.black },
              ]}
            />
            {processedTabs.map(renderTab)}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Non-scrollable version
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.tabsWrapper, { backgroundColor: colors.card }]}>
        <View ref={containerRef} style={styles.tabsContainer}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.indicator,
              animatedIndicatorStyle,
              { shadowColor: colors.black },
            ]}
          />
          {processedTabs.map(renderTab)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  tabsWrapper: {
    position: "relative",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    position: "relative",
  },
  scrollableContent: {
    paddingHorizontal: 6,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 6,
    bottom: 6,
    borderRadius: 12,
    zIndex: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginHorizontal: 2,
    zIndex: 1,
    backgroundColor: "transparent",
    minHeight: 44,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 6,
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  activeTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
});

export default memo(Tabs);
