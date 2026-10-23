import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../constants/Fonts';
import Button from '../../components/Button';
import { IconHeart, IconLibrary, IconChevronRight } from '@tabler/icons-react-native';

export default function ButtonShowcase() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Button',
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
        <View style={styles.buttonWrapper}>
          <View style={styles.fixedWidthButton}>
            <Button
              title="Get Started"
              variant="primary"
              size="medium"
              onPress={() => console.log("Button pressed")}
              // icon={<IconHeart size={16} color={colors.white} />}
              iconPosition="left"
            />
          </View>
          <View style={styles.fixedWidthButton}>
            <Button
              title="Add to favorites"
              variant="secondary"
              size="medium"
              onPress={() => console.log("Button pressed")}
              icon={<IconHeart size={16} color={colors.text} />}
              iconPosition="left"
            />
          </View>
          <View style={styles.fixedWidthButton}>
            <Button
              title="Add to library"
              variant="tertiary"
              size="medium"
              onPress={() => console.log("Button pressed")}
              icon={<IconLibrary size={16} color={colors.text} />}
              iconPosition="left"
            />
          </View>

          {/* Round Button Example */}
          <Button
            title="Get Started"
            variant="primary"
            size="medium"
            round
            fullWidth
            icon={<IconChevronRight size={32} color={colors.white} />}
            iconPosition="right"
            onPress={() => console.log("Round button pressed")}
            style={styles.roundButton}
            textStyle={styles.roundButtonText}
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
    width: '100%',
  },
  buttonWrapper: {
    alignItems: 'center',
    gap: 48,
    width: '95%',
  },
  fixedWidthButton: {
    width: 200,
  },
  roundButton: {
    height: 70,
    justifyContent: 'space-between',
  },
  roundButtonText: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    marginLeft: 24,
  },
});
