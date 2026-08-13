import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_OPTIONS } from '../types/search.types';

interface CategoryChipsProps {
  selectedCategoryId?: string;
  onSelect: (categoryId?: string) => void;
}

export function CategoryChips({ selectedCategoryId, onSelect }: CategoryChipsProps) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrapper}
      contentContainerStyle={styles.row}
    >
      {CATEGORY_OPTIONS.map((category) => {
        const selected = category.id === selectedCategoryId;

        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(selected ? undefined : category.id)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? theme.primary : 'transparent',
                borderColor: selected ? theme.primary : theme.border,
              },
            ]}
          >
            <ThemedText type="small" style={{ color: selected ? '#FFFFFF' : theme.text }}>
              {category.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 0,
    height: 44,
  },
  row: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
});
