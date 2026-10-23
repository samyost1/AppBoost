import {
  StyleSheet,
  Image,
  Platform,
  Text,
  View,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { useTheme } from "../../hooks/useTheme";
import ButtonHorizontal from "../../components/ButtonHorizontal";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import {
  IconCloudDown,
  IconFileTextShield,
  IconLogin,
  IconLogout,
  IconMessageCheck,
  IconMessageX,
  IconNotification,
  IconPaywall,
  IconRefresh,
} from "@tabler/icons-react-native";

import ProfileCard from "../../components/ProfileCard";
import appConfig from "../../config/appConfig";
import { usePushNotifications } from "../providers/PushNotificationProvider";
import { useUserData } from "../providers/userDataProvider";
import { useRevenueCat } from "../providers/RevenueCatProvider";
import { useSupabase } from "../providers/SupabaseProvider";
import { usePaywall } from "../../hooks/usePaywall";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { expoPushToken, sendPushNotification } = usePushNotifications();
  const { resetOnboarding } = useUserData();
  const { isConfigured: isRevenueCatConfigured } = useRevenueCat();
  const { user, logout, isConfigured: isSupabaseConfigured } = useSupabase();
  const { showPaywall } = usePaywall();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 128, // Added padding to account for tab bar height + its bottom margin + extra space
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard
          name={user?.user_metadata?.full_name || "{user_name}"}
          showPremiumIcon={true}
        />

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {user ? (
          <ButtonHorizontal
            title="Logout"
            icon={<IconLogout size={24} color={colors.primary} />}
            onPress={async () => {
              try {
                await logout();
                Toast.show({
                  type: "success",
                  text1: "Logged Out",
                  text2: "You have been logged out successfully",
                });
              } catch (error) {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: "Failed to logout",
                });
              }
            }}
          />
        ) : (
          <ButtonHorizontal
            title="Login / Sign Up"
            icon={<IconLogin size={24} color={colors.primary} />}
            onPress={() => router.push("auth")}
          />
        )}
        <ButtonHorizontal
          title="Onboarding"
          icon={<IconRefresh size={24} color={colors.primary} />}
          onPress={async () => {
            await resetOnboarding(false);
          }}
        />
        <ButtonHorizontal
          title="Privacy Policy"
          icon={<IconFileTextShield size={24} color={colors.primary} />}
          onPress={() => Linking.openURL(appConfig.privacyPolicyURL)}
        />
        <ButtonHorizontal
          title={"Paywall"}
          icon={<IconPaywall size={24} color={colors.primary} />}
          onPress={() => {
            if (!isRevenueCatConfigured) {
              Toast.show({
                type: "error",
                text1: "RevenueCat Not Configured",
                text2: "Please set up RevenueCat API keys to access paywall features",
              });
              return;
            }
            showPaywall();
          }}
        />
        <ButtonHorizontal
          title={"Success toast"}
          icon={<IconMessageCheck size={24} color={colors.primary} />}
          onPress={() => {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "This is a success toast",
            });
          }}
        />
        <ButtonHorizontal
          title={"Error toast"}
          icon={<IconMessageX size={24} color={colors.primary} />}
          onPress={() => {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "This is an error toast",
            });
          }}
        />
        <ButtonHorizontal
          title={"Push notification"}
          icon={<IconNotification size={24} color={colors.primary} />}
          onPress={async () => {
            console.log("expoPushToken", expoPushToken);
            
            if (!expoPushToken) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Expo push token not available",
              });
              return;
            }
            const message = {
              to: expoPushToken,
              sound: "default",
              title: "Test Notification",
              body: "This is a test push notification sent from the Profile screen.",
              data: { additionalData: "Optional" },
            };
            try {
              await sendPushNotification(message);
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Push notification sent successfully!",
              });
            } catch (error) {
              console.error("Error sending push notification: ", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to send push notification",
              });
            }
          }}
        />
        <ButtonHorizontal
          title={"Fetch Demo"}
          icon={<IconCloudDown size={24} color={colors.primary} />}
          onPress={() => router.push("fetchDemo")}
        />
      </ScrollView>
    </View>
  );
}
