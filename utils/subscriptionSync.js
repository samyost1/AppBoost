export const syncSubscriptionToSupabase = async (supabaseClient, userId, revenueCatUser) => {
  if (!supabaseClient) {
    console.log("⚠️ Supabase client not available - skipping subscription sync");
    return { success: false, error: "Supabase not configured" };
  }

  if (!userId) {
    console.log("⚠️ No user ID provided - skipping subscription sync");
    return { success: false, error: "No user ID" };
  }

  if (!revenueCatUser) {
    console.log("⚠️ No RevenueCat user data - skipping subscription sync");
    return { success: false, error: "No RevenueCat user data" };
  }

  try {
    const subscriptionData = {
      user_id: userId,
      subscription_plan: revenueCatUser.isPremium ? "premium" : "free",
      subscription_status: revenueCatUser.isPremium ? "active" : "inactive",
      will_renew: revenueCatUser.willRenew || false,
      updated_at: new Date().toISOString(),
    };

    // Try to update existing record first
    const { data: existingData, error: fetchError } = await supabaseClient
      .from("user_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingData) {
      // Update existing record
      const { data, error } = await supabaseClient
        .from("user_profiles")
        .update(subscriptionData)
        .eq("user_id", userId)
        .select();

      if (error) throw error;

      console.log("✅ Subscription data updated in Supabase");
      return { success: true, data };
    } else {
      // Insert new record
      const { data, error } = await supabaseClient
        .from("user_profiles")
        .insert(subscriptionData)
        .select();

      if (error) throw error;

      console.log("✅ Subscription data inserted in Supabase");
      return { success: true, data };
    }
  } catch (error) {
    console.log("❌ Error syncing subscription to Supabase:", error.message);
    return { success: false, error };
  }
};

/**
 * Gets user profile data from Supabase
 * @param {Object} supabaseClient - Supabase client instance
 * @param {string} userId - User ID to fetch
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const getUserProfile = async (supabaseClient, userId) => {
  if (!supabaseClient) {
    return { success: false, error: "Supabase not configured" };
  }

  if (!userId) {
    return { success: false, error: "No user ID" };
  }

  try {
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.log("❌ Error fetching user profile:", error.message);
    return { success: false, error };
  }
};
