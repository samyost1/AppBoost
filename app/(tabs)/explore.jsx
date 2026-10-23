import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";

// Import icons for component showcase
import { IconChevronRight } from "@tabler/icons-react-native";

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // Component showcase data
  const components = [
    {
      id: "button",
      title: "Button",
      route: "/showcase/button",
    },
    {
      id: "button-horizontal",
      title: "Button Horizontal",
      route: "/showcase/button-horizontal",
    },
    {
      id: "quick-action-button",
      title: "Button Quick Action",
      route: "/showcase/quick-action-button",
    },
    {
      id: "checkbox",
      title: "Checkbox",
      route: "/showcase/checkbox",
    },
    {
      id: "collapsible-section",
      title: "Collapsible Section",
      route: "/showcase/collapsible-section",
    },
    {
      id: "dialog",
      title: "Dialog",
      route: "/showcase/dialog",
    },
    {
      id: "discovery-bar",
      title: "Discovery Bar",
      route: "/showcase/discovery-bar",
    },
    {
      id: "dropdown-list",
      title: "Dropdown List",
      route: "/showcase/dropdown-list",
    },
    {
      id: "image-card",
      title: "Image Card",
      route: "/showcase/image-card",
    },
    {
      id: "input",
      title: "Input",
      route: "/showcase/input",
    },
    {
      id: "profile-card",
      title: "Profile Card",
      route: "/showcase/profile-card",
    },
    {
      id: "progress-card",
      title: "Progress Card",
      route: "/showcase/progress-card",
    },
    {
      id: "skeleton",
      title: "Skeleton",
      route: "/showcase/skeleton",
    },
    {
      id: "stats-card",
      title: "Stats Card",
      route: "/showcase/stats-card",
    },
    {
      id: "switch",
      title: "Switch",
      route: "/showcase/switch",
    },
    {
      id: "tabs",
      title: "Tabs",
      route: "/showcase/tabs",
    },
    {
      id: "welcome-card",
      title: "Welcome Card",
      route: "/showcase/welcome-card",
    },
  ];

  const handleComponentPress = (component) => {
    if (component.route !== "#") {
      router.push(component.route);
    }
  };

  const renderComponent = ({ item }) => (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor: colors.background, borderBottomColor: colors.cardBorder }]}
      onPress={() => handleComponentPress(item)}
    >
      <Text style={[styles.itemText, { color: colors.text }]}>{item.title}</Text>
      <IconChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Components</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Read the docs for more information</Text>
      </View>

      <FlatList
        data={components}
        renderItem={renderComponent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  listContent: {
    paddingBottom: 128,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
});
