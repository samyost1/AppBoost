import { BaseToast, ErrorToast } from "react-native-toast-message"
import { Fonts } from "../constants/Fonts"

const createToastConfig = (colors) => ({
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success,
        backgroundColor: colors.card,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: colors.text,
      }}
      text2Style={{
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: colors.textSecondary,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error,
        backgroundColor: colors.card,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: colors.text,
      }}
      text2Style={{
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: colors.textSecondary,
      }}
    />
  ),
});

export default createToastConfig