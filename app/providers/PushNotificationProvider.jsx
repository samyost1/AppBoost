import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Purchases from "react-native-purchases";
import { useSupabase } from "./SupabaseProvider";
import { useRevenueCat } from "./RevenueCatProvider";
import { savePushTokenToSupabase } from "../../utils/pushTokenSync";
import { Colors } from "../../constants/Colors";

const PushNotificationContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert is deprecated in expo-notifications 57 — shouldShowBanner
    // and shouldShowList are the required replacements. The old field still
    // works through a compat shim today, but warns on every notification and
    // will stop working on the next SDK bump.
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const handleRegistrationError = (errorMessage) => {
  throw new Error(errorMessage);
};

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: Colors.primary,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted to get push token for push notification!");
      return;
    }
    
    // Try to get project ID from environment variable first, then fall back to Expo config
    const projectId = process.env.EXPO_PUBLIC_PROJECT_ID || 
      Constants?.expoConfig?.extra?.eas?.projectId || 
      Constants?.easConfig?.projectId;
      
    if (!projectId) {
      console.log("⚠️ Expo project ID not found. Please set EXPO_PUBLIC_PROJECT_ID environment variable for push notifications to work.");
      console.log("Push notification registration will be skipped.");
      return null;
    }
    
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("✅ Push token obtained:", pushTokenString);
      return pushTokenString;
    } catch (e) {
      console.log("❌ Error getting push token:", e);
      return null;
    }
  } else {
    console.log("⚠️ Push notifications require a physical device");
    return null;
  }
};

export const PushNotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Get backend integration hooks
  const { supabase, user: supabaseUser, isConfigured: isSupabaseConfigured } = useSupabase();
  const { isConfigured: isRevenueCatConfigured, isReady: isRevenueCatReady } = useRevenueCat();

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();

        if (token) {
          setExpoPushToken(token);

          // Save to Supabase if configured
          if (isSupabaseConfigured && supabase) {
            try {
              // Get RevenueCat app user ID if available
              let revenuecatId = null;
              if (isRevenueCatConfigured && isRevenueCatReady) {
                try {
                  revenuecatId = await Purchases.getAppUserID();
                } catch (rcError) {
                  console.log("⚠️ Could not get RevenueCat ID:", rcError.message);
                }
              }

              // Get Supabase user ID if authenticated
              const userId = supabaseUser?.id || null;

              await savePushTokenToSupabase(supabase, token, {
                userId,
                revenuecatId,
              });
            } catch (error) {
              console.log("⚠️ Could not save push token to Supabase:", error.message);
            }
          }
        } else {
          setExpoPushToken("");
          console.log("⚠️ Push token registration failed - notifications will not work");
        }
      } catch (error) {
        console.log("❌ Error during push token registration:", error);
        setExpoPushToken("");
      }
    };

    setupPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current?.remove) {
        notificationListener.current.remove();
      }
      if (responseListener.current?.remove) {
        responseListener.current.remove();
      }
    };
  }, [isSupabaseConfigured, isRevenueCatConfigured, isRevenueCatReady, supabaseUser?.id]);

  const sendPushNotification = async (message) => {
    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Push notification failed:", errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      const responseData = await response.json();
      console.log("✅ Push notification sent successfully!");
      console.log("Response:", responseData);
      return responseData;
    } catch (error) {
      console.log("❌ Error sending push notification:", error);
      throw error; // Re-throw so the calling code can handle it
    }
  };

  const value = {
    expoPushToken,
    notification,
    sendPushNotification,
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export default PushNotificationProvider;

export const usePushNotifications = () => {
  return useContext(PushNotificationContext);
};