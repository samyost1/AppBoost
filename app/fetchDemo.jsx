import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useRevenueCat } from "./providers/RevenueCatProvider";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import { useEffect, useState, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import useFetch from "../hooks/useFetch";
import { SkeletonProductGrid } from "../components/Skeleton"; // Import our skeleton component
import { IconStar, IconStarFilled, IconLoader } from "@tabler/icons-react-native";
import Tabs from "../components/Tabs"; // Import the Tabs component
import Button from "../components/Button"; // Import the Button component

// Star Rating Component
const StarRating = ({ rating, size = 14 }) => {
  // Ensure rating is between 0 and 5
  const safeRating = Math.min(5, Math.max(0, rating));

  // Round the rating to the nearest whole number for display
  const roundedRating = Math.round(safeRating);

  // Create an array of 5 stars
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => {
        // Determine if this star should be filled or empty
        const filled = star <= roundedRating;

        return filled ? (
          <IconStarFilled
            key={star}
            size={size}
            fill={"#FFD700"}
            style={{ marginRight: 2, marginBottom: 4 }}
          />
        ) : (
          <IconStar
            key={star}
            size={size}
            color="#D1D1D1"
            fill={"#D1D1D1"}
            style={{ marginRight: 2 }}
          />
        );
      })}
    </View>
  );
};

export default function FetchDemo() {
  const router = useRouter();
  const { user, trialAvailable } = useRevenueCat();
  const { colors, isDark } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const [refreshing, setRefreshing] = useState(false);
  const [forcedLoading, setForcedLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Using our custom useFetch hook with the dummyjson products API
  const {
    data: productsData,
    isLoading: apiLoading,
    error,
    refetch,
  } = useFetch("https://dummyjson.com/products");

  // Combined loading state (either API is loading or we're forcing loading)
  const isLoading = apiLoading || forcedLoading;

  // Extract just the products array from the response
  const data = productsData?.products || [];

  // Extract unique categories from the data
  const categories = useMemo(() => {
    if (!data.length) return [{ id: "all", label: "All" }];

    // Get unique categories
    const uniqueCategories = [...new Set(data.map(item => item.category))];

    // Create tabs array with 'All' as first option
    return [
      { id: "all", label: "All" },
      ...uniqueCategories.map(category => ({
        id: category,
        label: category.charAt(0).toUpperCase() + category.slice(1) // Capitalize first letter
      }))
    ];
  }, [data]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return data;
    return data.filter(product => product.category === activeCategory);
  }, [data, activeCategory]);

  // Function to trigger dummy loading for 3 seconds
  const triggerDummyLoading = () => {
    setForcedLoading(true);
    setTimeout(() => {
      setForcedLoading(false);
    }, 3000); // Fixed 3 seconds
  };

  // Handle refresh with simulated delay
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    // Add artificial delay for demonstration
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle category tab change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Calculate item dimensions for a 2-column grid
  const itemWidth = (screenWidth - 48) / 2; // 48 = container padding (16) * 2 + gap between items (16)

  // Render each product item as a square
  const renderItem = ({ item }) => (
    <View
      style={[styles.productCard, { width: itemWidth, height: itemWidth + 80 }]}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.cardLight }]}>
        {item.images && item.images[0] && (
          <Image
            source={{ uri: item.thumbnail || item.images[0] }}
            style={[styles.productImage, { height: itemWidth }]}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={[styles.productInfo, { backgroundColor: colors.card }]}>
        <Text numberOfLines={1} style={[styles.productTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        {item.rating && <StarRating rating={item.rating} />}
        <Text style={[styles.productPrice, { color: colors.primary }]}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Simulate loading button */}
        <View style={styles.loadingButtonContainer}>
          <Button
            title="Simulate Loading (3s)"
            onPress={triggerDummyLoading}
            disabled={isLoading}
            icon={<IconLoader size={16} color={colors.text} />}
            variant="secondary"
          />
        </View>

        {/* Category tabs */}
        {!isLoading && categories.length > 1 && (
          <View style={styles.tabsContainer}>
            <Tabs
              tabs={categories}
              activeTabId={activeCategory}
              onTabChange={handleCategoryChange}
              scrollable={categories.length > 3}
              style={[styles.tabs, { backgroundColor: colors.background }]}
            />
          </View>
        )}

        {isLoading && !refreshing && (
          <View style={styles.listContainer}>
            {/* Replace the loading indicator with our skeleton grid */}
            <SkeletonProductGrid numItems={8} numColumns={2} />
          </View>
        )}

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>Error: {error.message}</Text>
            <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.error }]} onPress={refetch}>
              <Text style={[styles.retryButtonText, { color: colors.white }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && filteredProducts && filteredProducts.length > 0 && (
          <View style={styles.listContainer}>
            <FlashList
              data={filteredProducts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={itemWidth + 80}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              contentContainerStyle={styles.listContent}
              numColumns={2}
            />
          </View>
        )}

        {!isLoading && filteredProducts && filteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No products found in this category</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: "center",
  },
  errorText: {
    marginBottom: 10,
    fontFamily: Fonts.medium,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    fontFamily: Fonts.medium,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  productCard: {
    borderRadius: 16,
    overflow: "hidden",
    margin: 8,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: Fonts.bold,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  productRating: {
    fontSize: 12,
    color: "#e6b800",
    fontFamily: Fonts.medium,
  },
  // Style for loading button container
  loadingButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  // Star rating styles
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  starWrapper: {
    position: "relative",
    marginRight: 2,
  },
  filledStarWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    height: "100%",
  },
  // New styles for tabs
  tabsContainer: {
    marginBottom: 12,
    marginHorizontal: 8,
  },
  tabs: {
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    textAlign: 'center',
  },
});
