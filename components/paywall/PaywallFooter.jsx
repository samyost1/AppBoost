import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import { IconChevronRight } from "@tabler/icons-react-native";
import { useRevenueCat } from "../../app/providers/RevenueCatProvider";
import { usePostHogAnalytics } from "../../app/providers/PostHogProvider";
import { paywallConfig } from "../../config/paywall";
import appConfig from "../../config/appConfig";

const PaywallFooter = () => {
  const { colors } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [isLoading, setIsLoading] = useState(false); // Loading state for payment
  const { restorePermissions, user, packages, purchasePackage, trialAvailable, isConfigured } = useRevenueCat();
  const { capture } = usePostHogAnalytics();

  // defaultOption/billingPeriod are Google Play concepts and are null on iOS, and
  // packages can be empty if the offering is misconfigured. Derive display values
  // defensively so the paywall degrades instead of crashing.
  const primaryProduct = packages?.[0]?.product;
  const priceString = primaryProduct?.priceString;
  const introPrice = primaryProduct?.introPrice;

  // Android exposes the renewal period via defaultOption.billingPeriod; iOS only
  // via the ISO-8601 subscriptionPeriod (e.g. "P1M"). Fall back to parsing that.
  const ISO_PERIOD_UNITS = { D: "day", W: "week", M: "month", Y: "year" };
  const billingPeriodUnit =
    primaryProduct?.defaultOption?.billingPeriod?.unit?.toLowerCase() ??
    ISO_PERIOD_UNITS[primaryProduct?.subscriptionPeriod?.slice(-1)];

  // If RevenueCat is not configured, show an error message
  if (!isConfigured) {
    return (
      <View
        style={{
          marginTop: "auto",
          paddingBottom: screenHeight * 0.03,
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: colors.cardLight,
            padding: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: colors.error,
              textAlign: "center",
              fontFamily: Fonts.bold,
              marginBottom: 10,
            }}
          >
            RevenueCat Not Configured
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.error,
              textAlign: "center",
              fontFamily: Fonts.regular,
            }}
          >
            Please set up your RevenueCat API keys to enable payment functionality.
          </Text>
        </View>
      </View>
    );
  }

  // If packages are not loaded yet or empty
  if (!packages || packages.length === 0) {
    return (
      <View
        style={{
          marginTop: "auto",
          paddingBottom: screenHeight * 0.03,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={{
            fontSize: 16,
            color: colors.text,
            textAlign: "center",
            fontFamily: Fonts.regular,
            marginTop: 10,
          }}
        >
          Loading payment options...
        </Text>
      </View>
    );
  }

  // const handlePurchasePress = async () => {
  //   await purchasePackage(packages[0])
  //   router.replace({pathname: "/premium/purchase_complete"})
  // }

  const handlePayment = async () => {
    // An empty offering would otherwise pass undefined into purchasePackage.
    if (!packages?.[0]) {
      capture("purchase_failed", { error: "no_packages_available" });
      return;
    }

    setIsLoading(true); // Set loading to true

    const productId = packages[0]?.product?.identifier;

    capture("purchase_started", {
      product_id: productId,
      price: priceString,
      trial_available: trialAvailable,
    });

    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate payment delay
      console.log("packages[0]:", packages[0]);
      await purchasePackage(packages[0]);
      // Handle successful payment
      capture("purchase_completed", {
        product_id: productId,
        price: priceString,
        trial_available: trialAvailable,
      });
      // paywallConfig.onPurchaseComplete();
    } catch (error) {
      // Handle payment error
      console.log("handlePayment error:");
      console.error(error);
      capture("purchase_failed", {
        product_id: productId,
        error: error.message || "Unknown error",
        user_cancelled: error.userCancelled || false,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleRestorePurchases = async () => {
    capture("restore_purchases_started");
    try {
      const result = await restorePermissions();
      if (result) {
        capture("restore_purchases_completed", {
          has_active_subscription: result?.entitlements?.active ? Object.keys(result.entitlements.active).length > 0 : false,
        });
      }
    } catch (error) {
      capture("restore_purchases_failed", {
        error: error.message || "Unknown error",
      });
    }
  };

  return (
    <View
      style={{
        marginTop: "auto",
        paddingBottom: screenHeight * 0.03,
      }}
    >
      {!trialAvailable && priceString && billingPeriodUnit && (
        <Text
          style={{
            fontSize: 16,
            color: colors.text,
            textAlign: "center",
            fontFamily: Fonts.bold,
            marginBottom: screenHeight * 0.015,
            paddingHorizontal: 5,
          }}
        >
          {priceString} per {billingPeriodUnit}
        </Text>
      )}
      {/* Try For Free Button */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 24,
          paddingHorizontal: 30,
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: screenHeight * 0.015,
          width: "98%",
          alignSelf: "center",
        }}
        onPress={handlePayment}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={colors.white}
            style={{ marginVertical: 2 }}
          />
        ) : (
          <>
            <Text
              style={{
                color: colors.white,
                fontSize: 18,
                fontFamily: Fonts.semiBold,
                marginRight: 5,
                textAlign: "center",
              }}
            >
              {trialAvailable ? "Try For Free" : "Subscribe Now"}
            </Text>
            {trialAvailable && (
              <Text style={{ fontSize: 18, textAlign: "center" }}>🙌</Text>
            )}
            <IconChevronRight
              size={32}
              color={colors.white}
              style={{
                position: "absolute",
                right: 12,
              }}
            />
          </>
        )}
      </TouchableOpacity>

      {/* Additionial Info */}
      {trialAvailable && introPrice && priceString && billingPeriodUnit && (
        <Text
          style={{
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: screenHeight * 0.02,
          }}
        >
          {introPrice.periodNumberOfUnits}{" "}
          {introPrice.periodUnit?.toLowerCase()} free trial, then just{" "}
          {priceString} per {billingPeriodUnit}
        </Text>
      )}

      {/* Footer */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: screenHeight * 0.01,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleRestorePurchases}
        >
          <Text
            style={{
              color: colors.textSecondary,
              marginHorizontal: 6,
              fontFamily: Fonts.bold,
              alignSelf: "center",
            }}
          >
            Restore Purchase
          </Text>
        </TouchableOpacity>
        {/* Circular dot */}
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 3,
            backgroundColor: colors.textSecondary,
            marginHorizontal: 6,
            alignSelf: "center",
          }}
        />
        <TouchableOpacity
          onPress={() => Linking.openURL(appConfig.privacyPolicyURL)}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: Fonts.bold,
              marginHorizontal: 6,
              alignSelf: "center",
            }}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaywallFooter;
