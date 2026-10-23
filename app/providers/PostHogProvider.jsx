import { createContext, useContext, useEffect } from "react";
import {
  PostHogProvider as RNPostHogProvider,
  usePostHog,
} from "posthog-react-native";
import Purchases from "react-native-purchases";
import { posthogConfig } from "../../config/posthog";
import { useRevenueCat } from "./RevenueCatProvider";

const PostHogContext = createContext();

/**
 * PostHogProvider - Analytics and feature flags provider
 *
 * Wraps the app with PostHog for:
 * - Event tracking
 * - User identification
 * - Feature flags
 * - Session replay (requires development build, not Expo Go)
 *
 * Usage in components:
 *   const { capture, identify, isFeatureEnabled } = usePostHogAnalytics();
 *   capture('button_clicked', { button_name: 'subscribe' });
 */
export const PostHogProvider = ({ children }) => {
  const { apiKey, host, debug } = posthogConfig;

  // Check if PostHog is configured
  if (!apiKey) {
    console.log("⚠️ PostHog API key not found");
    console.log(
      "PostHog analytics will be disabled. Please set the following environment variable:"
    );
    console.log("  - EXPO_PUBLIC_POSTHOG_KEY");
    return (
      <PostHogContext.Provider value={{
        isConfigured: false,
        capture: () => {},
        identify: () => {},
        reset: () => {},
        isFeatureEnabled: () => false,
        getFeatureFlag: () => null,
        reloadFeatureFlags: () => Promise.resolve(),
      }}>
        {children}
      </PostHogContext.Provider>
    );
  }

  console.log("✅ PostHog initialized successfully");

  return (
    <RNPostHogProvider
      apiKey={apiKey}
      options={{
        host,
        debug,
      }}
    >
      <PostHogContextProvider>{children}</PostHogContextProvider>
    </RNPostHogProvider>
  );
};

/**
 * Internal provider that has access to usePostHog hook
 */
const PostHogContextProvider = ({ children }) => {
  const posthog = usePostHog();
  const { isConfigured: isRevenueCatConfigured, isReady: isRevenueCatReady, user } = useRevenueCat();

  // Identify user with RevenueCat ID when available
  useEffect(() => {
    const identifyUser = async () => {
      if (isRevenueCatConfigured && isRevenueCatReady) {
        try {
          const revenuecatId = await Purchases.getAppUserID();
          if (revenuecatId) {
            posthog.identify(revenuecatId, {
              is_premium: user?.isPremium || false,
              will_renew: user?.willRenew || false,
              is_internal: __DEV__, // Mark dev builds as internal users
            });
            console.log("✅ PostHog identified user with RevenueCat ID:", revenuecatId);
          }
        } catch (error) {
          console.log("⚠️ Could not identify user in PostHog:", error.message);
        }
      }
    };

    identifyUser();
  }, [isRevenueCatConfigured, isRevenueCatReady, user?.isPremium, user?.willRenew]);

  const value = {
    isConfigured: true,
    posthog,
    // Convenience methods
    capture: (event, properties) => posthog.capture(event, properties),
    identify: (userId, properties) => posthog.identify(userId, properties),
    reset: () => posthog.reset(),
    isFeatureEnabled: (flag) => posthog.isFeatureEnabled(flag),
    getFeatureFlag: (flag) => posthog.getFeatureFlag(flag),
    reloadFeatureFlags: () => posthog.reloadFeatureFlagsAsync(),
  };

  return (
    <PostHogContext.Provider value={value}>{children}</PostHogContext.Provider>
  );
};

export default PostHogProvider;

/**
 * Hook to access PostHog analytics
 *
 * @returns {Object} PostHog context with:
 *   - isConfigured: boolean - Whether PostHog is properly configured
 *   - posthog: PostHog instance for advanced usage
 *   - capture(event, properties): Track an event
 *   - identify(userId, properties): Identify a user
 *   - reset(): Reset user identity (on logout)
 *   - isFeatureEnabled(flag): Check if a feature flag is enabled
 *   - getFeatureFlag(flag): Get feature flag value
 *   - reloadFeatureFlags(): Reload feature flags from server
 */
export const usePostHogAnalytics = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    // Return a safe default if used outside provider
    return {
      isConfigured: false,
      capture: () => {},
      identify: () => {},
      reset: () => {},
      isFeatureEnabled: () => false,
      getFeatureFlag: () => null,
      reloadFeatureFlags: () => Promise.resolve(),
    };
  }
  return context;
};
