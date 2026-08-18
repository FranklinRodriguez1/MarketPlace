import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useCategories } from '@/features/listing/create/hooks/use-categories';
import { useTheme } from '@/hooks/use-theme';
import { darkenColor } from '@/utils/color';

interface CategoryChipsProps {
  selectedCategoryId?: string;
  onSelect: (categoryId?: string) => void;
}

export function CategoryChips({ selectedCategoryId, onSelect }: CategoryChipsProps) {
  const theme = useTheme();
  const { data: categories = [] } = useCategories();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrapper}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const selected = category.slug === selectedCategoryId;

        const baseBackground = selected ? theme.primary : 'transparent';

        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(selected ? undefined : category.slug)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: pressed
                  ? (selected ? darkenColor(theme.primary) : theme.backgroundElement)
                  : baseBackground,
                borderColor: selected ? theme.primary : theme.border,
              },
            ]}
          >
            <ThemedText type="small" style={{ color: selected ? '#FFFFFF' : theme.text }}>
              {category.name}
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
