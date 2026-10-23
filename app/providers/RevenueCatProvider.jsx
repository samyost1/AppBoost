import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";
import Toast from "react-native-toast-message";
import { revenueCatConfig } from "../../config/revenueCat";
import { paywallConfig } from "../../config/paywall";
import { useSupabase } from "./SupabaseProvider";
import { syncSubscriptionToSupabase } from "../../utils/subscriptionSync";

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_RC_APPLE_KEY,
  google: process.env.EXPO_PUBLIC_RC_GOOGLE_KEY,
};

const RevenueCatContext = createContext();

export const RevenueCatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [trialAvailable, setTrialAvailable] = useState(false);

  // Get Supabase client for subscription syncing
  const { supabase, isConfigured: isSupabaseConfigured } = useSupabase();

  useEffect(() => {
    // Check if API keys are available
    const currentPlatformKey = Platform.OS === "ios" ? APIKeys.apple : APIKeys.google;
    const platformName = Platform.OS === "ios" ? "Apple" : "Google";
    
    if (!currentPlatformKey) {
      console.log("⚠️ RevenueCat API key not found for", platformName);
      console.log("RevenueCat functionality will be disabled. Please set the following environment variable:");
      console.log(`  - EXPO_PUBLIC_RC_${platformName.toUpperCase()}_KEY`);
      setIsConfigured(false);
      // Set default user state when not configured
      setUser({ isPremium: false, willRenew: false });
      setIsReady(true);
      return;
    }

    const init = async () => {
      try {
      if (Platform.OS === "ios") {
        Purchases.configure({ apiKey: APIKeys.apple });
      } else if (Platform.OS === "android") {
        Purchases.configure({ apiKey: APIKeys.google });
      }
      
      // Fetch customer info immediately on app start
      const customerInfo = await Purchases.getCustomerInfo();
      updateCustomerInformation(customerInfo); // Update the user state immediately

      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        updateCustomerInformation(customerInfo);
      });
      
      await loadOfferings();
        setIsConfigured(true);
        console.log("✅ RevenueCat initialized successfully");
      } catch (error) {
        console.log("❌ Error initializing RevenueCat:", error);
        setIsConfigured(false);
        // Set default user state when initialization fails
        setUser({ isPremium: false, willRenew: false });
      }
      
      setIsReady(true);
    };

    init();
  }, []);

  const loadOfferings = async () => {
    // if (!isConfigured) {
    //   console.log("⚠️ RevenueCat not configured - cannot load offerings");
    //   return;
    // }

    try {
      const offerings = await Purchases.getOfferings();

      console.log(`🐱 [RevenueCat] Number of offerings available: ${offerings.all ? Object.keys(offerings.all).length : 0}`);
      // If you want to see the offerings details, uncomment the following line
      // console.log(`🐱 [RevenueCat] Offerings: ${JSON.stringify(offerings.all, null, 2)}`);

      // for (let i = 0; i < Object.keys(offerings.all).length; i++) {
      //   console.log("🐱 [RevenueCat] Offering: ", Object.keys(offerings.all)[i]);
      //   console.log("🐱 [RevenueCat] Offering: ", JSON.stringify(offerings.all[Object.keys(offerings.all)[i]], null, 2));
      // }
      const currentOffering = offerings.current;
      if (currentOffering) {
        // Check if free trial is available. defaultOption is an Android/Play-billing
        // concept and is frequently null on iOS, and a misconfigured offering may have
        // no packages — guard against both so we still set packages below.
        const freePhase =
          currentOffering.availablePackages?.[0]?.product?.defaultOption?.freePhase;
        setTrialAvailable(!!freePhase);
        setPackages(currentOffering.availablePackages ?? []);
      }
    } catch (error) {
      console.log("🐱 [RevenueCat] ❌ Error loading offerings:", error);
    }
  };

  const purchasePackage = async (pack) => {
    if (!isConfigured) {
      Toast.show({
        type: "error",
        text1: "RevenueCat Not Configured",
        text2: "Please set up RevenueCat API keys to make purchases",
      });
      return;
    }

    try {
      await Purchases.purchasePackage(pack);

      const productIDs = revenueCatConfig.productIDs;

      if (productIDs.includes(pack.product.identifier)) {
        setUser({ ...user, isPremium: true, willRenew: true });
      }

      const customerInfo = await Purchases.getCustomerInfo();
      const hasEntitlement = customerInfo.entitlements.active[revenueCatConfig.entitlementID];

      // Call onPurchaseComplete - for Test Store, entitlement may not be active immediately
      if (hasEntitlement || productIDs.includes(pack.product.identifier)) {
        paywallConfig.onPurchaseComplete();
      }

      Toast.show({
        type: "success",
        text1: "Purchase successful",
        text2: "You are successfully subscribed",
      });
    } catch (e) {
      console.log("🐱 [RevenueCat] Error purchasing package: ", e);
      if (e.userCancelled) {
        console.log("🐱 [RevenueCat] User cancelled");
        Toast.show({
          type: "error",
          text1: "Purchase cancelled",
          text2: "You cancelled the purchase",
        });
      }
    }
  };


  const updateCustomerInformation = async (customerInfo) => {
    const newUser = { isPremium: false, willRenew: false };

    if (customerInfo.entitlements.active[revenueCatConfig.entitlementID] !== undefined) {
      newUser.isPremium = true;
      console.log("🐱 [RevenueCat] User is premium");

      if (customerInfo.entitlements.active[revenueCatConfig.entitlementID]['willRenew'] === "true" || customerInfo.entitlements.active[revenueCatConfig.entitlementID]['willRenew'] === true) {
        console.log("🐱 [RevenueCat] User will renew");
        newUser.willRenew = true;
      }
    }

    setUser(newUser);

    // Sync subscription data to Supabase (only if both RevenueCat and Supabase are configured)
    if (isConfigured && isSupabaseConfigured && supabase) {
      try {
        const userId = await Purchases.getAppUserID();
        await syncSubscriptionToSupabase(supabase, userId, newUser);
      } catch (error) {
        console.log("⚠️ Could not sync subscription to Supabase:", error.message);
      }
    }
  }

  const restorePermissions = async () => {
    if (!isConfigured) {
      Toast.show({
        type: "error",
        text1: "RevenueCat Not Configured",
        text2: "Please set up RevenueCat API keys to restore purchases",
      });
      return null;
    }

    try {
    const customer = await Purchases.restorePurchases();
    console.log("🐱 [RevenueCat] Customer: ", customer);
    return customer;
    } catch (error) {
      console.log("🐱 [RevenueCat] ❌ Error restoring purchases:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to restore purchases",
      });
      return null;
    }
  }

  /**
   * Present RevenueCat's remote paywall (configured in RevenueCat dashboard)
   * @returns {Promise<{purchased: boolean, restored: boolean}>} Result of the paywall presentation
   */
  const presentRemotePaywall = async () => {
    if (!isConfigured) {
      Toast.show({
        type: "error",
        text1: "RevenueCat Not Configured",
        text2: "Please set up RevenueCat API keys to show paywall",
      });
      return { purchased: false, restored: false };
    }

    try {
      console.log("🐱 [RevenueCat] Presenting remote paywall...");
      const paywallResult = await RevenueCatUI.presentPaywall();
      console.log("🐱 [RevenueCat] Paywall result:", paywallResult);

      // Handle paywall result
      if (paywallResult === "PURCHASED" || paywallResult === "RESTORED") {
        // Refresh customer info after successful purchase/restore
        const customerInfo = await Purchases.getCustomerInfo();
        updateCustomerInformation(customerInfo);

        if (paywallResult === "PURCHASED") {
          paywallConfig.onPurchaseComplete();
          Toast.show({
            type: "success",
            text1: "Purchase successful",
            text2: "You are successfully subscribed",
          });
          return { purchased: true, restored: false };
        } else {
          Toast.show({
            type: "success",
            text1: "Purchases restored",
            text2: "Your previous purchases have been restored",
          });
          return { purchased: false, restored: true };
        }
      }

      return { purchased: false, restored: false };
    } catch (error) {
      console.log("🐱 [RevenueCat] ❌ Error presenting remote paywall:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to show paywall",
      });
      return { purchased: false, restored: false };
    }
  }

  const value = {
    restorePermissions,
    user,
    packages,
    purchasePackage,
    presentRemotePaywall,
    isReady,
    isConfigured,
    trialAvailable,
  };

  if (!isReady) return <></>;

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export default RevenueCatProvider;

export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};