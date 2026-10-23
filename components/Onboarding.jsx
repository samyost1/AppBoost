import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
// import { Image } from 'expo-image';
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import { IconChevronRight, IconRocket, IconSettings, IconCode } from "@tabler/icons-react-native";

const { width, height } = Dimensions.get("window");

const Onboarding = ({ screens, onDone, onStepChange, onSkip }) => {
  const { colors } = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        if (index !== currentIndex) {
          setCurrentIndex(index);
          onStepChange && onStepChange(index, screens.length);
        }
      },
    }
  );

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      flatListRef.current.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      onDone && onDone();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        {screens.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              { backgroundColor: i <= currentIndex ? colors.primary : colors.textMuted },
            ]}
          />
        ))}
      </View>

      {/* Main content with overlapping elements */}
      <View style={styles.mainContent}>
        <Animated.ScrollView
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {screens.map((item, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
              extrapolate: "clamp",
            });

            return (
              <View key={index} style={[styles.slide, { width }]}>
                {/* Title at the top */}
                <Animated.Text style={[styles.title, { opacity, color: colors.primary }]}>
                  {item.title}
                </Animated.Text>

                {/* Phone image that will be partially covered by bottom sheet */}
                <View style={styles.phoneContainer}>
                  <Animated.View
                    style={[
                      styles.phoneImageWrapper,
                      { opacity }
                    ]}
                  >
                    {/* Add a View container with overflow hidden and border radius */}
                    <View style={styles.imageContainer}>
                      <Image
                        source={item.image}
                        style={styles.phoneImage}
                        resizeMode="cover"
                      />
                    </View>

                    {/* Icon overlay in white circle */}
                    <View style={styles.iconOverlay}>
                      {index === 0 ? (
                        <View style={[styles.cloudIcon, { backgroundColor: colors.background, shadowColor: colors.black }]}>
                          <IconRocket size={40} color={colors.primary} />
                        </View>
                      ) : index === 1 ? (
                        <View style={[styles.cloudIcon, { backgroundColor: colors.background, shadowColor: colors.black }]}>
                          <IconSettings size={40} color={colors.primary} />
                        </View>
                      ) : (
                        <View style={[styles.cloudIcon, { backgroundColor: colors.background, shadowColor: colors.black }]}>
                          <IconCode size={40} color={colors.primary} />
                        </View>
                      )}
                    </View>
                  </Animated.View>
                </View>
              </View>
            );
          })}
        </Animated.ScrollView>

        {/* White bottom sheet that overlaps the phone image */}
        <View style={[styles.whiteBottomSheet, { backgroundColor: colors.background, shadowColor: colors.black }]}>
          {/* Info box area */}
          <Animated.View style={styles.infoContainer}>
            {screens.map((item, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0, 1, 0],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.infoBox,
                    { opacity, display: index === currentIndex ? "flex" : "none" }
                  ]}
                >
                  <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Bottom navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => {
              onSkip && onSkip(currentIndex, screens.length);
              onDone && onDone();
            }}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: colors.primary, shadowColor: colors.black },
                currentIndex === screens.length - 1 && styles.continueButton
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={[styles.nextButtonText, { color: colors.white }]}>
                {currentIndex < screens.length - 1 ? "Next" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 10,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  mainContent: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: Fonts.black,
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 10,
    zIndex: 10,
  },
  phoneContainer: {
    position: "absolute",
    top: 150,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 180,
  },
  phoneImageWrapper: {
    width: "100%",
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    width: "79%",
    height: "100%",
    borderRadius: 38,
    overflow: "hidden",
  },
  phoneImage: {
    width: "100%",
    height: "100%",
  },
  iconOverlay: {
    position: "absolute",
    top: -20,
    right: 20,
    zIndex: 10,
  },
  cloudIcon: {
    width: 80,
    height: 80,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  whiteBottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 30,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 5,
    height: 220,
  },
  infoContainer: {
    flex: 1,
  },
  infoBox: {
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  nextButton: {
    width: 90,
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    right: -15,
  },
  continueButton: {
    width: 120
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});

export default Onboarding;