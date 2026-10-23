import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(null); // null indicates loading state
  const [hasReviewedApp, setHasReviewedApp] = useState(false);
  const [hasFinishedOnboarding, setHasFinishedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      await checkFirstTimeUser();
      await checkHasReviewedApp();
      await checkHasFinishedOnboarding();
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false); // Stop loading once data is loaded
    }
  };

  // General function for setting a flag.
  // stateSetter is optional: if provided, it is called with a boolean (true if flagValue === "true").
  const setFlag = async (flagKey, flagValue, stateSetter, logMessage) => {
    try {
      await AsyncStorage.setItem(flagKey, flagValue);
      if (stateSetter) {
        stateSetter(flagValue === "true");
      }
      if (logMessage) {
        console.log(logMessage);
      }
    } catch (error) {
      console.error(`Error setting flag ${flagKey}:`, error);
    }
  };

  // General function for getting a flag.
  // Returns the flag value stored in AsyncStorage.
  const getFlag = async (flagKey) => {
    try {
      const value = await AsyncStorage.getItem(flagKey);
      return value;
    } catch (error) {
      console.error(`Error getting flag ${flagKey}:`, error);
      return null;
    }
  };

  const checkHasReviewedApp = async () => {
    try {
      const reviewFlag = await getFlag("hasReviewedApp");
      if (reviewFlag === "true") {
        setHasReviewedApp(true);
      }
    } catch (error) {
      console.error("Error checking review flag:", error);
    }
  };

  // Uses the general setFlag function to set the review flag.
  const setHasReviewedAppFlag = async () => {
    await setFlag(
      "hasReviewedApp",
      "true",
      setHasReviewedApp,
      "Review flag set to true."
    );
  };

  // Check if it's the first time the user is opening the app
  const checkFirstTimeUser = async () => {
    try {
      const firstTimeFlag = await getFlag("isFirstTime");
      if (firstTimeFlag === null) {
        // First time user
        setIsFirstTimeUser(true);
        await AsyncStorage.setItem("isFirstTime", "false");
        console.log("First time user detected, showing onboarding");
      } else {
        // Not the first time user
        setIsFirstTimeUser(false);
      }
    } catch (error) {
      console.error("Error checking first time user:", error);
    }
  };

  // Uses the general setFlag function to clear first time user flag.
  const setFirstTimeUserFlag = async () => {
    await setFlag(
      "isFirstTime",
      "false",
      setIsFirstTimeUser,
      "First time user flag set to false."
    );
  };

  // New: Check if the onboarding has been finished.
  const checkHasFinishedOnboarding = async () => {
    try {
      const finishedFlag = await getFlag("hasFinishedOnboarding");
      if (finishedFlag === "true") {
        setHasFinishedOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking finished onboarding flag:", error);
    }
  };

  // New: Function for setting the finished onboarding flag.
  const finishOnboarding = async () => {
    await setFlag(
      "hasFinishedOnboarding",
      "true",
      setHasFinishedOnboarding,
      "Onboarding finished."
    );
  };

  const resetOnboarding = async () => {
    await setFlag(
      "hasFinishedOnboarding",
      "false",
      setHasFinishedOnboarding,
      "Onboarding reset."
    );
  };

  const value = {
    isFirstTimeUser,
    setFirstTimeUserFlag,
    hasReviewedApp,
    setHasReviewedAppFlag,
    hasFinishedOnboarding,
    finishOnboarding,
    resetOnboarding,
    isLoading, // Exporting loading state
    setFlag,
    getFlag,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;

export const useUserData = () => {
  return useContext(UserDataContext);
};
