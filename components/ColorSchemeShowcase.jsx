import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import Button from "./Button";
import Switch from "./Switch";
import Input from "./Input";
import Checkbox from "./Checkbox";

const ColorSchemeShowcase = () => {
  const {
    colors,
    isDark,
    themeName,
    themeId,
    toggleTheme,
    setTheme,
    availableThemes,
  } = useTheme();

  const colorEntries = Object.entries(colors);

  // Group colors by category
  const colorGroups = {
    Primary: ["primary", "primaryLight", "primaryDark"],
    Secondary: ["secondary", "secondaryLight", "secondaryDark"],
    Tertiary: ["tertiary", "tertiaryLight"],
    Background: ["background", "backgroundSecondary", "backgroundTertiary"],
    Card: ["card", "cardLight", "cardBorder"],
    Text: ["text", "textSecondary", "textMuted"],
    Status: ["success", "successLight", "error", "errorLight", "warning"],
    Gradient: ["gradientStart", "gradientEnd", "gradientSecondaryStart", "gradientSecondaryEnd"],
  };

  const renderColorSwatch = (name, hex) => (
    <View key={name} style={styles.colorItem}>
      <View
        style={[
          styles.swatch,
          {
            backgroundColor: hex,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          },
        ]}
      />
      <View style={styles.info}>
        <Text style={[styles.nameText, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.hexText, { color: colors.textMuted }]}>{hex}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Theme Switcher Section */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme Switcher</Text>
        <Text style={[styles.currentTheme, { color: colors.textSecondary }]}>
          Current: {themeName} ({themeId})
        </Text>

        <View style={styles.themeSwitcher}>
          {availableThemes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeButton,
                {
                  backgroundColor: themeId === theme.id ? colors.primary : colors.cardLight,
                  borderColor: colors.cardBorder,
                },
              ]}
              onPress={() => setTheme(theme.id)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: themeId === theme.id ? colors.white : colors.text },
                ]}
              >
                {theme.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          onPress={toggleTheme}
          variant="secondary"
          fullWidth
          style={styles.toggleButton}
        />
      </View>

      {/* Component Showcase */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Component Showcase</Text>

        <View style={styles.componentRow}>
          <Button title="Primary" variant="primary" />
          <Button title="Secondary" variant="secondary" />
          <Button title="Tertiary" variant="tertiary" />
        </View>

        <View style={styles.componentRow}>
          <Button title="Disabled" variant="primary" disabled />
          <Button title="Round" variant="primary" round />
        </View>

        <View style={styles.componentRow}>
          <Switch label="Dark Mode" value={isDark} onValueChange={toggleTheme} />
        </View>

        <Input
          label="Sample Input"
          placeholder="Enter text..."
          style={styles.inputDemo}
        />

        <Checkbox text="Checkbox option" />
      </View>

      {/* Color Palette by Groups */}
      {Object.entries(colorGroups).map(([groupName, colorNames]) => (
        <View
          key={groupName}
          style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{groupName} Colors</Text>
          {colorNames.map((name) =>
            colors[name] ? renderColorSwatch(name, colors[name]) : null
          )}
        </View>
      ))}

      {/* All Colors */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>All Colors</Text>
        {colorEntries.map(([name, hex]) => renderColorSwatch(name, hex))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 12,
  },
  currentTheme: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginBottom: 16,
  },
  themeSwitcher: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  themeButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  toggleButton: {
    marginTop: 8,
  },
  componentRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  inputDemo: {
    marginBottom: 8,
  },
  colorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
  },
  nameText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  hexText: {
    fontFamily: Fonts.light,
    fontSize: 12,
  },
});

export default ColorSchemeShowcase;
