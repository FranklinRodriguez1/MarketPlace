import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_OPTIONS } from '../types/search.types';

interface CategoryPillsProps {
  selectedCategoryId?: string;
  onSelect: (categoryId?: string) => void;
}

export function CategoryPills({ selectedCategoryId, onSelect }: CategoryPillsProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {CATEGORY_OPTIONS.map((category) => {
          const selected = category.id === selectedCategoryId;

          return (
            <Pressable
              key={category.id}
              onPress={() => onSelect(selected ? undefined : category.id)}
              style={[styles.pill, { backgroundColor: selected ? theme.primary : theme.backgroundElement }]}
            >
              <ThemedText type="small" style={{ color: selected ? '#fff' : theme.text }}>
                {category.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 44,
  },
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
