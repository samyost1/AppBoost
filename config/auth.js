const authConfig = {
  // SOFT vs HARD login screen:
  // - true (soft): User can close/dismiss the auth screen and use the app without logging in
  // - false (hard): Login is mandatory, user cannot close the auth screen
  isClosable: true,

  // Text content for auth screen
  loginTitle: "Get Started",
  loginSubtitle: "Start building your dream app today.",

  // Route to navigate to after successful login (email or Google)
  // Use any valid route like "/(tabs)", "/(tabs)/profile", "/welcome", etc.
  redirectAfterLogin: "/welcome",
};

export { authConfig };
