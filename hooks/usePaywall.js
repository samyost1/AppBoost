import { useCallback } from "react";
import { useRouter } from "expo-router";
import { useRevenueCat } from "../app/providers/RevenueCatProvider";
import { revenueCatConfig } from "../config/revenueCat";

/**
 * Hook for showing the paywall based on configuration.
 * Supports both code-based (custom) and remote (RevenueCat dashboard) paywalls.
 *
 * @returns {Object} { showPaywall, paywallType }
 *
 * @example
 * const { showPaywall } = usePaywall();
 *
 * // Show paywall (automatically chooses based on config)
 * const handleUpgrade = () => {
 *   showPaywall();
 * };
 */
export const usePaywall = () => {
  const router = useRouter();
  const { presentRemotePaywall, isConfigured } = useRevenueCat();
  const paywallType = revenueCatConfig.paywallType || 'code';

  /**
   * Show the paywall based on the configured paywall type.
   * - 'code': Navigate to the custom code-based paywall screen
   * - 'remote': Present RevenueCat's remote paywall modal
   *
   * @returns {Promise<{purchased?: boolean, restored?: boolean} | void>}
   */
  const showPaywall = useCallback(async () => {
    if (paywallType === 'remote') {
      if (!isConfigured) {
        console.log("⚠️ RevenueCat not configured - cannot show remote paywall");
        // Fall back to code paywall if remote isn't available
        router.push("/paywall");
        return;
      }
      return await presentRemotePaywall();
    } else {
      // Default to code paywall
      router.push("/paywall");
    }
  }, [paywallType, isConfigured, presentRemotePaywall, router]);

  return {
    showPaywall,
    paywallType,
  };
};

export default usePaywall;
