import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useRevenueCat } from "../app/providers/RevenueCatProvider";
import { IconCrown, IconUser } from "@tabler/icons-react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const ProfileCard = ({
  name,
  showPremiumIcon = true
}) => {
  const { colors } = useTheme();
  const { user } = useRevenueCat();

  // Default values when RevenueCat is not configured or user is null
  const isPremium = user?.isPremium || false;

  // Use provided name or fallback to default
  const displayName = name || "User";

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Profile Icon */}
      <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
        <IconUser size={28} color={colors.white} />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: colors.text }]}>Hi, {displayName}</Text>
          {/* Premium Icon next to name (alternative placement) */}
          {showPremiumIcon && isPremium && (
            <IconCrown size={18} color={colors.gold} style={styles.nameIcon} />
          )}
        </View>
        <Text style={[styles.status, { color: colors.textMuted }]}>
          {isPremium ? 'Premium Member' : 'Free Account'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  nameIcon: {
    marginLeft: 6,
  },
  status: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
});

export default ProfileCard;
