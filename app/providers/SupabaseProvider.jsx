import { createContext, useContext, useEffect, useState } from "react";
import { Linking } from "react-native";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { authConfig } from "../../config/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const SupabaseContext = createContext();

// Create user profile if it doesn't exist
const ensureUserProfile = async (client, userId) => {
  try {
    // Check if profile exists
    const { data: existing } = await client
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!existing) {
      // Create new profile
      const { error } = await client
        .from('user_profiles')
        .insert({ user_id: userId });

      if (error) {
        console.log("⚠️ Could not create user profile:", error.message);
      } else {
        console.log("✅ User profile created");
      }
    }
  } catch (error) {
    // Profile doesn't exist or other error - try to create
    const { error: insertError } = await client
      .from('user_profiles')
      .insert({ user_id: userId });

    if (insertError && !insertError.message.includes('duplicate')) {
      console.log("⚠️ Could not create user profile:", insertError.message);
    } else if (!insertError) {
      console.log("✅ User profile created");
    }
  }
};

export const SupabaseProvider = ({ children }) => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("⚠️ Supabase configuration incomplete. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env");
      setIsConfigured(false);
      setIsReady(true);
      return;
    }

    const init = async () => {
      try {
        // Initialize Supabase client
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
            storage: AsyncStorage,
          },
        });

        setSupabase(client);

        // Check if user is already logged in
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            console.log("✅ User already logged in:", session.user.email);
          } else {
            setUser(null);
          }
        } catch (err) {
          // User not logged in, that's okay
          setUser(null);
        }

        // Listen for auth state changes
        client.auth.onAuthStateChange(async (_event, session) => {
          console.log("🔄 Auth state changed:", _event, session?.user?.email);
          setUser(session?.user ?? null);

          // Create user profile on sign in
          if (_event === 'SIGNED_IN' && session?.user) {
            await ensureUserProfile(client, session.user.id);
          }
        });

        // Handle deep link authentication (magic link, OAuth)
        const handleAuthUrl = async (url) => {
          if (!url) return;

          console.log("📱 Received deep link:", url);

          // Check if this is an auth callback
          if (url.includes('auth-callback') || url.includes('#access_token=')) {
            // Extract the hash/fragment from the URL (everything after #)
            const hashIndex = url.indexOf('#');
            if (hashIndex !== -1) {
              const hashParams = url.substring(hashIndex + 1);
              const urlParams = new URLSearchParams(hashParams);

              const accessToken = urlParams.get('access_token');
              const refreshToken = urlParams.get('refresh_token');

              if (accessToken && refreshToken) {
                console.log("🔑 Found auth tokens in URL, setting session...");

                // Set the session with the tokens from the URL
                const { data, error } = await client.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });

                if (error) {
                  console.error("❌ Error setting session:", error);
                  Toast.show({
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again. If the problem persists, contact support.",
                  });
                  return;
                }

                console.log("✅ Session set successfully:", data.user?.email);

                // Redirect to configured route after successful magic link auth
                const redirectTo = authConfig.redirectAfterLogin || "/(tabs)";
                router.replace(redirectTo);
              } else {
                console.log("⚠️ No auth tokens found in URL");
              }
            }
          }
        };

        // Handle initial URL (when app was closed)
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await handleAuthUrl(initialUrl);
        }

        // Listen for URL events (when app is already open)
        const subscription = Linking.addEventListener('url', async (event) => {
          await handleAuthUrl(event.url);
        });

        setIsConfigured(true);
        setIsReady(true);
        console.log("✅ Supabase initialized successfully");

        // Cleanup function for the subscription
        return () => {
          if (subscription) {
            subscription.remove();
          }
        };
      } catch (error) {
        console.log("❌ Error initializing Supabase:", error);
        setError(error);
        setIsConfigured(false);
        setIsReady(true); // Still set ready even on error
      }
    };

    init();
  }, []);

  // Insert data into a table
  const insertData = async (table, data) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot insert data");
      return { data: null, error: new Error("Supabase not configured") };
    }

    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) throw error;
      console.log("✅ Data inserted successfully:", result);
      return { data: result, error: null };
    } catch (error) {
      console.log("❌ Error inserting data:", error);
      setError(error);
      return { data: null, error };
    }
  };

  // Query data from a table
  const getData = async (table, filters = {}) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot get data");
      return { data: null, error: new Error("Supabase not configured") };
    }

    try {
      let query = supabase.from(table).select("*");

      // Apply filters if provided
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query;

      if (error) throw error;
      console.log("✅ Data retrieved successfully");
      return { data, error: null };
    } catch (error) {
      console.log("❌ Error getting data:", error);
      setError(error);
      return { data: null, error };
    }
  };

  // Update data in a table
  const updateData = async (table, id, data) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot update data");
      return { data: null, error: new Error("Supabase not configured") };
    }

    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq("id", id)
        .select();

      if (error) throw error;
      console.log("✅ Data updated successfully:", result);
      return { data: result, error: null };
    } catch (error) {
      console.log("❌ Error updating data:", error);
      setError(error);
      return { data: null, error };
    }
  };

  // Delete data from a table
  const deleteData = async (table, id) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot delete data");
      return { data: null, error: new Error("Supabase not configured") };
    }

    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;
      console.log("✅ Data deleted successfully");
      return { data, error: null };
    } catch (error) {
      console.log("❌ Error deleting data:", error);
      setError(error);
      return { data: null, error };
    }
  };

  // Subscribe to real-time changes
  const subscribeToTable = (table, callback) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot subscribe to table");
      return null;
    }

    const channel = supabase
      .channel(`public:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: table },
        callback
      )
      .subscribe();

    return channel;
  };

  // Unsubscribe from real-time changes
  const unsubscribe = (channel) => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };

  // Authentication methods

  // Send magic link to user's email
  const sendMagicLink = async (email, redirectUrl) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot send magic link");
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      console.log("✅ Magic link sent to:", email);
      return data;
    } catch (error) {
      console.log("❌ Error sending magic link:", error);
      setError(error);
      throw error;
    }
  };

  // Sign in with OAuth (Google, Apple, etc.)
  const signInWithOAuth = async (provider) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot sign in with OAuth");
      throw new Error("Supabase not configured");
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) throw error;
      console.log(`✅ OAuth sign in initiated for ${provider}`);
      return data;
    } catch (error) {
      console.log(`❌ Error signing in with ${provider}:`, error);
      setError(error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured");
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      console.log("✅ User logged out");
    } catch (error) {
      console.log("❌ Error logging out:", error);
      setError(error);
      throw error;
    }
  };

  // Store push token (keeping for backward compatibility)
  const addExpoPushToken = async (token) => {
    if (!isConfigured) {
      console.log("⚠️ Supabase not configured - cannot store push token");
      return;
    }

    // Use the insertData function to add to expo_push_tokens table
    const userId = user?.id || null;
    return insertData("expo_push_tokens", { token, user_id: userId });
  };

  const value = {
    supabase,
    error,
    isConfigured,
    user,
    insertData,
    getData,
    updateData,
    deleteData,
    subscribeToTable,
    unsubscribe,
    sendMagicLink,
    signInWithOAuth,
    logout,
    addExpoPushToken,
  };

  if (!isReady) return <></>;

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;

export const useSupabase = () => {
  return useContext(SupabaseContext);
};
