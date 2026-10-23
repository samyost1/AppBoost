import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../constants/Fonts';
import Checkbox from '../../components/Checkbox';

export default function CheckboxShowcase() {
  const { colors } = useTheme();
  const [checked, setChecked] = useState(false);

  console.log("checked", checked);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Checkbox',
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
        <View style={styles.checkboxWrapper}>
          <Checkbox
            text="Accept Terms & Conditions"
            checked={checked}
            onToggle={setChecked}
          />
        </View>
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
    paddingHorizontal: 20,
  },
  checkboxWrapper: {
    alignSelf: 'center',
  },
});
