import { Text, View, Dimensions, FlatList } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import { useEffect, useRef, useState } from "react";
import { Testimonials } from "../../config/paywall";

const PaywallTestimonials = () => {
  const { colors } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeTestimonialIndex + 1) % Testimonials.length;
        setActiveTestimonialIndex(nextIndex); // Update the index state
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0.5, // Centers the item in the middle
        });
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clean up the interval
  }, [activeTestimonialIndex, Testimonials.length]);

  const TestimonialCard = ({ item }) => (
    <View
      style={{
        backgroundColor: colors.card,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        marginVertical: 20,
        width: screenWidth * 0.8,
        marginHorizontal: screenWidth * 0.1,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: Fonts.bold,
          marginBottom: 8,
          textAlign: "center",
          color: colors.text,
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: Fonts.medium,
          color: colors.textSecondary,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {item.text}
      </Text>
      <View style={{ flexDirection: "row" }}>
        {"★"
          .repeat(item.rating)
          .split("")
          .map((star, i) => (
            <Text key={i} style={{ color: colors.gold, fontSize: 20 }}>
              {star}
            </Text>
          ))}
      </View>
    </View>
  );

  const PaginationDots = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
      }}
    >
      {Testimonials.map((_, index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor:
              index === activeTestimonialIndex
                ? colors.white
                : "rgba(255, 255, 255, 0.5)",
            marginHorizontal: 4,
          }}
        />
      ))}
    </View>
  );

  return (
    <View style={{ width: "100%" }}>
      <FlatList
        ref={flatListRef}
        data={Testimonials}
        renderItem={({ item }) => <TestimonialCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // Disable manual scrolling
        pagingEnabled
        snapToAlignment="center"
        snapToInterval={screenWidth * 0.8 + screenWidth * 0.2}
        decelerationRate="fast"
        keyExtractor={(item) => item.name}
        contentContainerStyle={{
          justifyContent: "center", // Center items in the list
          alignItems: "center", // Center items vertically
        }}
        initialScrollIndex={0} // Ensures the first testimonial is in view
        getItemLayout={(data, index) => ({
          length: screenWidth * 0.8 + screenWidth * 0.2,
          offset: (screenWidth * 0.8 + screenWidth * 0.2) * index,
          index,
        })} // Improves performance for initial scroll
        onLayout={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: 0, // Ensure it starts at the first item
              animated: true,
              viewPosition: 0.5, // Centers the item in the middle
            });
          }
        }}
      />
      <PaginationDots />
    </View>
  );
};

export default PaywallTestimonials;
