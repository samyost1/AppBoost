import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ScrollView, Keyboard, Platform, Animated } from "react-native";
import { Stack } from "expo-router";
import Input from "../../components/Input";
import { useTheme } from "../../hooks/useTheme";
import { Fonts } from "../../constants/Fonts";
import { IconUser, IconMail, IconLock, IconSearch } from "@tabler/icons-react-native";

export default function InputShowcase() {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [multilineText, setMultilineText] = useState("");
  const [errorText, setErrorText] = useState("Invalid input");
  const [errorInput, setErrorInput] = useState("");
  const [search, setSearch] = useState("");
  const keyboardPadding = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (errorInput === "" || /[!@#$%^&*()]/.test(errorInput)) {
      setErrorText("Invalid input");
    } else {
      setErrorText("");
    }
  }, [errorInput]);

  // Handle keyboard
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(keyboardPadding, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === "ios" ? 250 : 100,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(keyboardPadding, {
          toValue: 0,
          duration: Platform.OS === "ios" ? 250 : 100,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Input",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: Fonts.semiBold,
          },
        }}
      />

      <Animated.View style={[styles.content, { paddingBottom: keyboardPadding }]}>
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputWrapper}>
            {/* Basic Input */}
            <Input
              placeholder="Name"
              value={text}
              onChangeText={setText}
              leftIcon={<IconUser size={20} color={colors.textSecondary} />}
            />

            {/* Email Input */}
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              leftIcon={<IconMail size={20} color={colors.textSecondary} />}
            />

            {/* Password Input */}
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              leftIcon={<IconLock size={20} color={colors.textSecondary} />}
            />

            {/* Search Input */}
            <Input
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              leftIcon={<IconSearch size={20} color={colors.textSecondary} />}
            />

            {/* Multiline Input */}
            <Input
              label="Description"
              placeholder="Enter a description..."
              value={multilineText}
              onChangeText={setMultilineText}
              multiline={true}
              numberOfLines={4}
            />

            {/* Error Input */}
            <Input
              label="Input with Error"
              placeholder="This has an error"
              value={errorInput}
              onChangeText={setErrorInput}
              error={errorText}
            />

            {/* Disabled Input */}
            <Input
              label="Disabled Input"
              placeholder="This is disabled"
              onChangeText={() => {}}
              editable={false}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    paddingHorizontal: 20,
    alignItems: "stretch",
  },
  inputWrapper: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
});
