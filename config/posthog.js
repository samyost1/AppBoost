/**
 * PostHog Configuration
 *
 * Set up your PostHog project key and host in environment variables:
 * - EXPO_PUBLIC_POSTHOG_KEY: Your PostHog project API key
 * - EXPO_PUBLIC_POSTHOG_HOST: Your PostHog host (optional, defaults to US cloud)
 *
 * Find these values in your PostHog project settings:
 * https://app.posthog.com/project/settings
 */

export const posthogConfig = {
  // PostHog project API key (required)
  apiKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,

  // PostHog host - use 'https://us.i.posthog.com' for US cloud
  // or 'https://eu.i.posthog.com' for EU cloud
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',

  // Enable debug mode in development
  debug: __DEV__,
};
