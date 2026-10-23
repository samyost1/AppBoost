export const savePushTokenToSupabase = async (supabaseClient, token, options = {}) => {
  // Support legacy call signature: (client, token, userId)
  const { userId, revenuecatId } = typeof options === 'string'
    ? { userId: options, revenuecatId: null }
    : options;

  if (!supabaseClient) {
    console.log("⚠️ Supabase client not available - skipping push token save");
    return { success: false, error: "Supabase not configured" };
  }

  if (!token) {
    console.log("⚠️ No push token provided - skipping save");
    return { success: false, error: "No token" };
  }

  try {
    // Check if token already exists
    const { data: existingToken, error: fetchError } = await supabaseClient
      .from("expo_push_tokens")
      .select("id, user_id, revenuecat_id")
      .eq("token", token)
      .single();

    // Build update/insert data - only include fields that have values
    const tokenData = { token };
    if (userId) tokenData.user_id = userId;
    if (revenuecatId) tokenData.revenuecat_id = revenuecatId;

    if (existingToken) {
      // Token exists, check if we need to update any IDs
      const needsUpdate =
        (userId && existingToken.user_id !== userId) ||
        (revenuecatId && existingToken.revenuecat_id !== revenuecatId);

      if (needsUpdate) {
        const updateData = {};
        if (userId) updateData.user_id = userId;
        if (revenuecatId) updateData.revenuecat_id = revenuecatId;

        const { data, error } = await supabaseClient
          .from("expo_push_tokens")
          .update(updateData)
          .eq("token", token)
          .select();

        if (error) throw error;

        console.log("✅ Push token updated in Supabase");
        return { success: true, data };
      } else {
        console.log("✅ Push token already exists in Supabase");
        return { success: true, data: existingToken };
      }
    } else {
      // Insert new token
      const { data, error } = await supabaseClient
        .from("expo_push_tokens")
        .insert(tokenData)
        .select();

      if (error) throw error;

      console.log("✅ Push token saved to Supabase");
      return { success: true, data };
    }
  } catch (error) {
    console.log("❌ Error saving push token to Supabase:", error.message);
    return { success: false, error };
  }
};

/**
 * Gets all push tokens from Supabase
 * @param {Object} supabaseClient - Supabase client instance
 * @param {string} userId - Optional user ID to filter by
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const getPushTokens = async (supabaseClient, userId = null) => {
  if (!supabaseClient) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    let query = supabaseClient.from("expo_push_tokens").select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.log("❌ Error fetching push tokens:", error.message);
    return { success: false, error };
  }
};

/**
 * Deletes a push token from Supabase
 * @param {Object} supabaseClient - Supabase client instance
 * @param {string} token - Expo push token to delete
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const deletePushToken = async (supabaseClient, token) => {
  if (!supabaseClient) {
    return { success: false, error: "Supabase not configured" };
  }

  if (!token) {
    return { success: false, error: "No token provided" };
  }

  try {
    const { data, error } = await supabaseClient
      .from("expo_push_tokens")
      .delete()
      .eq("token", token);

    if (error) throw error;

    console.log("✅ Push token deleted from Supabase");
    return { success: true, data };
  } catch (error) {
    console.log("❌ Error deleting push token:", error.message);
    return { success: false, error };
  }
};
