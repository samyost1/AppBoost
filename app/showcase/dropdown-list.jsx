import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../constants/Fonts';
import DropdownList from '../../components/DropdownList';

export default function DropdownListShowcase() {
  const { colors } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);

  console.log("selectedOption", selectedOption);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'DropdownList',
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

      <View style={styles.centerContainer}>
        <DropdownList
          options={[
            { label: "Green", value: "green" },
            { label: "Blue", value: "blue" },
            { label: "Yellow", value: "yellow" },
            { label: "Red", value: "red" },
            { label: "Purple", value: "purple" },
          ]}
          placeholder="Select a color"
          header="Colors"
          onSelect={setSelectedOption}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,

  },
});
