import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Platform, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import { Image } from "expo-image";


const ImageCard = ({ title, subtitle, image, onPress }) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, { shadowColor: colors.black }]}
      onPress={onPress}
      activeOpacity={0.4}
    >
      <Image source={image} style={styles.cardImage} />
      <View style={styles.overlay}>
        <View style={[styles.textContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
          <View style={styles.subtitleContainer}>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>{subtitle}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardImage: {
    width: "100%",
    height: 300,
    contentFit: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  textContainer: {
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitleText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
});

export default ImageCard;