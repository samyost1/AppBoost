import {
  View,
  Text,
  Dimensions,
} from "react-native";
import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import { paywallConfig } from "../../config/paywall";
import { useRevenueCat } from "../../app/providers/RevenueCatProvider";

const PaywallPromoText = () => {
  const { colors } = useTheme();
  const { user, trialAvailable } = useRevenueCat();

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View>
      {/* Pro Badge */}
      <View
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 15,
          paddingVertical: 12,
          borderRadius: 20,
          alignSelf: "center",
          marginBottom: screenHeight * 0.015,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: Fonts.bold,
            fontSize: 16,
          }}
        >
          {paywallConfig.subscriptionTitle}
        </Text>
      </View>

      {/* Savings Text */}
      <Text
        style={{
          fontSize: 20,
          color: colors.text,
          textAlign: "center",
          fontFamily: Fonts.bold,
          marginBottom: screenHeight * 0.015,
          paddingHorizontal: 5,
        }}
      >
        {paywallConfig.footerMainPromo}
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 16,
          fontFamily: Fonts.regular,
          color: colors.textSecondary,
          textAlign: "center",
          marginBottom: screenHeight * 0.02,
        }}
      >
        {paywallConfig.footerSubPromo}
      </Text>

      {/* No Payment Text */}
      {trialAvailable && (
        <Text
          style={{
            fontFamily: Fonts.extraBold,
            fontSize: 15,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: screenHeight * 0.02,
          }}
        >
          No Payment Due Now
        </Text>
      )}
    </View>
  );
};

export default PaywallPromoText;
