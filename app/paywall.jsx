import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  BackHandler,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { useRevenueCat } from "./providers/RevenueCatProvider";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import { IconX } from "@tabler/icons-react-native";
import { useEffect, useRef, useState } from "react";
import PaywallFooter from "../components/paywall/PaywallFooter";
import PaywallTestimonials from "../components/paywall/PaywallTestimonials";
import PaywallHeader from "../components/paywall/PaywallHeader";
import PaywallPromoText from "../components/paywall/PaywallPromoText";
import { paywallConfig } from "../config/paywall";
import { usePostHogAnalytics } from "./providers/PostHogProvider";

export default function Paywall() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, trialAvailable } = useRevenueCat();
  const { capture } = usePostHogAnalytics();
  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  // Track paywall viewed
  useEffect(() => {
    capture("paywall_viewed", {
      is_closable: paywallConfig.isClosable,
      trial_available: trialAvailable,
    });
  }, [trialAvailable]);

  const handleClose = () => {
    capture("paywall_closed");
    router.back();
  };

  useEffect(() => {
    if (!paywallConfig.isClosable) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );

      return () => backHandler.remove();
    }
  }, [paywallConfig.isClosable]);

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={{
        flex: 1,
        backgroundColor: colors.primary,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Closing button */}
      {paywallConfig.isClosable && (
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: "absolute",
            top: insets.top + 8,
            right: 12,
            zIndex: 1,
            padding: 8,
          }}
        >
          <IconX size={24} color={colors.white} />
        </TouchableOpacity>
      )}

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          minHeight: screenHeight,
        }}
      >
        {/* Top Blue Section */}
        <View
          style={{
            paddingBottom: paywallConfig.showReviews ? 0 : screenHeight * 0.15,
          }}
        >
          <PaywallHeader />
          {paywallConfig.showReviews && <PaywallTestimonials />}
        </View>

        {/* Bottom White Section */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: screenHeight * 0.05,
            marginTop: paywallConfig.showReviews ? 0 : -20,
          }}
        >
          <PaywallPromoText
            // isTrialPaywall={user?.}
          />
          {/* Bottom Container for Button and Footer */}
          <PaywallFooter/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
