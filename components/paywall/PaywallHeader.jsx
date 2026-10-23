import { Text, View, Image, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import { paywallConfig } from "../../config/paywall";

const PaywallHeader = () => {
  const { colors } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Image
        source={require("../../assets/logo.png")}
        style={{
          width: 40,
          height: 40,
          marginTop: insets.top + 20,
          marginBottom: screenHeight * 0.02,
        }}
      />

      {/* Title */}
      <Text
        style={{
          fontSize: 22,
          color: colors.white,
          fontFamily: Fonts.semiBold,
          textAlign: "center",
          marginBottom: screenHeight * 0.01,
          marginHorizontal: 16,
        }}
      >
        {paywallConfig.headerMainPromo}
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 18,
          color: "rgba(255, 255, 255, 0.9)",
          textAlign: "center",
          opacity: 0.9,
        }}
      >
        {paywallConfig.headerSubPromo}
      </Text>
    </View>
  );
};

export default PaywallHeader;
