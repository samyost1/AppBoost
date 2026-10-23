import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { Stack, useRouter } from "expo-router";
import { Fonts } from "../../constants/Fonts";
import { useRevenueCat } from "../providers/RevenueCatProvider";
import { useSupabase } from "../providers/SupabaseProvider";
import { usePushNotifications } from "../providers/PushNotificationProvider";
import { usePostHogAnalytics } from "../providers/PostHogProvider";
import appConfig from "../../config/appConfig";
import Toast from "react-native-toast-message";

// Import new components
import WelcomeCard from "../../components/WelcomeCard";

// Import icons
import {
  IconCreditCard,
  IconBell,
  IconCheck,
  IconX,
  IconHelp,
  IconChartBar
} from "@tabler/icons-react-native";

// SVG components
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const SupabaseLogo = ({ width = 20, height = 20 }) => (
  <Svg width={width} height={height} viewBox="0 0 109 113" fill="none">
    <Defs>
      <LinearGradient
        id="paint0_linear"
        x1="53.9738"
        y1="54.974"
        x2="94.1635"
        y2="71.8295"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#249361" />
        <Stop offset="1" stopColor="#3ECF8E" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear"
        x1="36.1558"
        y1="30.578"
        x2="54.4844"
        y2="65.0806"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#000000" stopOpacity="1" />
        <Stop offset="1" stopColor="#000000" stopOpacity="0" />
      </LinearGradient>
    </Defs>
    <Path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint0_linear)"
    />
    <Path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint1_linear)"
      fillOpacity="0.2"
    />
    <Path
      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
      fill="#3ECF8E"
    />
  </Svg>
);

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user, isConfigured: isRevenueCatConfigured } = useRevenueCat();
  const { isConfigured: isSupabaseConfigured } = useSupabase();
  const { expoPushToken } = usePushNotifications();
  const { isConfigured: isPostHogConfigured } = usePostHogAnalytics();

  // Service status data
  const services = [
    {
      name: "Payments",
      description: "RevenueCat for payments",
      icon: <IconCreditCard size={20} color={colors.primary} />,
      isConfigured: isRevenueCatConfigured,
      status: isRevenueCatConfigured ? "Ready" : "Not Configured",
      configLocation: "config/revenueCat.js",
    },
    {
      name: "Supabase",
      description: "Backend & authentication",
      icon: <SupabaseLogo width={20} height={20} />,
      isConfigured: isSupabaseConfigured,
      status: isSupabaseConfigured ? "Ready" : "Not Configured",
      configLocation: "config/supabase.js",
    },
    {
      name: "Notifications",
      description: "Expo Push Notifications",
      icon: <IconBell size={20} color={colors.primary} />,
      isConfigured: !!expoPushToken,
      status: expoPushToken ? "Ready" : "Not Configured",
      configLocation: ".env file (EXPO_PUBLIC_PROJECT_ID)",
    },
    {
      name: "Analytics",
      description: "PostHog analytics & flags",
      icon: <IconChartBar size={20} color={colors.primary} />,
      isConfigured: isPostHogConfigured,
      status: isPostHogConfigured ? "Ready" : "Not Configured",
      configLocation: ".env file (EXPO_PUBLIC_POSTHOG_KEY)",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.cardBorder }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.appNameContainer}>
                <Image
                  source={require("../../assets/logo.png")}
                  style={[styles.logo, { tintColor: colors.text }]}
                  resizeMode="contain"
                />
                <Text style={[styles.appName, { color: colors.text }]}>{appConfig.appName}</Text>
              </View>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Kickstart Your App in Minutes 🚀</Text>
            </View>
            <TouchableOpacity
              style={[styles.githubButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => {
                Linking.openURL('https://appboost.dev/docs');
              }}
            >
              <IconHelp size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Template Overview */}
        <View style={styles.section}>
          <WelcomeCard
            userName={"Developer"}
            subtitle="Read the docs to get started!"
            onPress={() => {
              Linking.openURL('https://appboost.dev/docs');
            }}
          />
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Services</Text>
          <Text style={[styles.servicesSubtitle, { color: colors.textSecondary }]}>
            Check the docs to configure each service
          </Text>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.serviceCard,
                  {
                    backgroundColor: service.isConfigured
                      ? (isDark ? colors.card : '#f0f9ff')
                      : (isDark ? colors.backgroundSecondary : '#fafafa'),
                    borderColor: service.isConfigured
                      ? (isDark ? colors.success + '40' : '#d1fae5')
                      : (isDark ? colors.error + '40' : '#fecaca'),
                  }
                ]}
              >
                {/* Status indicator in top right */}
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: service.isConfigured
                      ? (isDark ? colors.success + '30' : '#e8f5e8')
                      : (isDark ? colors.error + '30' : '#ffeaea')
                  }
                ]}>
                  {service.isConfigured ? (
                    <IconCheck size={12} color={colors.success} />
                  ) : (
                    <IconX size={12} color={colors.error} />
                  )}
                </View>

                <View style={[styles.serviceIcon, { backgroundColor: colors.card }]}>
                  {service.icon}
                </View>

                <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
                <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>{service.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 32,
    paddingBottom: 128,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  appName: {
    fontSize: 28,
    fontFamily: Fonts.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  githubButton: {
    borderRadius: 12,
    padding: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
  },
  servicesSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 15,
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});
