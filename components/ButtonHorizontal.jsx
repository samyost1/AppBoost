import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Fonts } from '../constants/Fonts';
import { IconChevronRight } from '@tabler/icons-react-native';

const ButtonHorizontal = ({ title, icon, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: colors.backgroundSecondary }]}>
          {icon}
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <IconChevronRight size={20} color={colors.textSecondary} style={styles.arrowIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    marginVertical: 4,
    marginHorizontal: 6,
    borderRadius: 25,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    marginLeft: 18,
  },
  arrowIcon: {
    marginLeft: 16,
  },
});

export default ButtonHorizontal;