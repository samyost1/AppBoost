import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import Tabs from "../../components/Tabs";
import {
  IconLayoutGrid,
  IconNews,
  IconTrendingUp,
  IconHeart,
  IconUserPlus,
  IconStar
} from "@tabler/icons-react-native";

export default function TabsShowcase() {
  const { colors } = useTheme();
  const [activeTabId, setActiveTabId] = useState("News");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Tabs",
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
          <Tabs
            tabs={[
              { id: "All", label: "All", icon: <IconLayoutGrid /> },
              { id: "News", label: "News", icon: <IconNews /> },
              { id: "Trending", label: "Trending", icon: <IconTrendingUp /> },
              { id: "For You", label: "For you", icon: <IconHeart /> },
              { id: "Following", label: "Following", icon: <IconUserPlus /> },
              { id: "Subscribed", label: "Subscribed", icon: <IconStar /> },
            ]}
            activeTabId={activeTabId}
            onTabChange={(tabId) => {
              setActiveTabId(tabId);
              console.log("Tab changed to", tabId);
            }}
            scrollable={true}
            indicatorColor={colors.white}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: "100%",
    height: 140,
  },
});
