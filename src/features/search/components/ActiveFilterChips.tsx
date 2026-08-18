import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLocales } from 'expo-localization';
import { formatMoney } from '@cerca/src';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useCategories } from '@/features/listing/create/hooks/use-categories';
import { useTheme } from '@/hooks/use-theme';
import { darkenColor } from '@/utils/color';

import type { FilterState } from '../types/search.types';

interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemove: (key: keyof FilterState) => void;
}

export function ActiveFilterChips({ filters, onRemove }: ActiveFilterChipsProps) {
  const theme = useTheme();
  const localeTag = getLocales()[0]?.languageTag ?? 'es-CO';
  const { data: categories = [] } = useCategories();

  const chips: { key: keyof FilterState; label: string }[] = [];

  if (filters.categoryId) {
    const category = categories.find((option) => option.slug === filters.categoryId);
    if (category) {
      chips.push({ key: 'categoryId', label: category.name });
    }
  }

  if (filters.priceMaxMinor !== undefined) {
    const amount = formatMoney({ amountMinor: filters.priceMaxMinor, currency: 'COP' }, localeTag);
    chips.push({ key: 'priceMaxMinor', label: `Hasta ${amount}` });
  }

  if (filters.minRating !== undefined) {
    chips.push({ key: 'minRating', label: `Calificación: ${filters.minRating}+` });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrapper}
      contentContainerStyle={styles.row}
    >
      {chips.map((chip) => (
        <Pressable
          key={chip.key}
          onPress={() => onRemove(chip.key)}
          style={({ pressed }) => [
            styles.chip,
            { backgroundColor: pressed ? darkenColor(theme.backgroundSelected) : theme.backgroundSelected },
          ]}
        >
          <ThemedText type="small" style={{ color: theme.primary }}>
            {chip.label}
          </ThemedText>
          <Ionicons name="close-circle" size={16} color={theme.primary} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 0,
    height: 36,
  },
  row: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.pill,
  },
});
