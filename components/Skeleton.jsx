import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const Skeleton = ({
  width,
  height,
  borderRadius = 4,
  baseColor,
  highlightColor,
  style = {},
}) => {
  const { colors, isDark } = useTheme();

  // Use theme-aware defaults with more contrast for clearer animation
  const resolvedBaseColor = baseColor || (isDark ? '#1E1E28' : '#D1D5DB');
  const resolvedHighlightColor = highlightColor || (isDark ? '#3A3A4A' : '#F3F4F6');

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: resolvedBaseColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: resolvedHighlightColor,
          opacity: opacityAnim,
        }}
      />
    </View>
  );
};

export const SkeletonProductGrid = ({
  numColumns = 2,
  numItems = 6,
  style = {},
}) => {
  const { colors, isDark } = useTheme();

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 48) / 2;

  // Theme-aware skeleton colors with better contrast
  const baseColor = isDark ? '#1E1E28' : '#E5E5E5';
  const highlightColor = isDark ? '#3A3A4A' : '#FFFFFF';

  const skeletons = Array(numItems).fill(0).map((_, index) => {
    const itemHeight = itemWidth + 80;

    return (
      <View key={index} style={[styles.skeletonCard, { width: itemWidth, height: itemHeight }]}>
        <View style={[styles.imageContainer, { backgroundColor: colors.gray }]}>
          <Skeleton
            width={itemWidth}
            height={itemWidth}
            borderRadius={0}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </View>

        <View style={[styles.skeletonContent, { backgroundColor: colors.card }]}>
          <Skeleton
            width={itemWidth * 0.9}
            height={14}
            style={styles.skeletonTitle}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />

          <View style={styles.starRatingPlaceholder}>
            <Skeleton
              width={70}
              height={14}
              style={styles.skeletonStars}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </View>

          <Skeleton
            width={itemWidth * 0.4}
            height={16}
            style={styles.skeletonPrice}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </View>
      </View>
    );
  });

  return (
    <View style={[styles.skeletonGrid, style]}>
      {skeletons}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  skeletonCard: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  skeletonContent: {
    padding: 12,
  },
  skeletonTitle: {
    marginBottom: 4,
  },
  starRatingPlaceholder: {
    marginTop: 4,
    marginBottom: 4,
  },
  skeletonStars: {
    marginBottom: 4,
  },
  skeletonPrice: {
    marginBottom: 0,
  }
});

export default Skeleton;
