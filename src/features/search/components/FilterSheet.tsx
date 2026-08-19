import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_OPTIONS, RATING_OPTIONS } from '../types/search.types';
import type { FilterState } from '../types/search.types';

interface FilterSheetProps {
  visible: boolean;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export function FilterSheet({ visible, filters, onApply, onClose }: FilterSheetProps) {
  const theme = useTheme();
  const [categoryId, setCategoryId] = useState(filters.categoryId);
  const [minRating, setMinRating] = useState(filters.minRating);
  const [priceMaxText, setPriceMaxText] = useState(
    filters.priceMaxMinor ? String(filters.priceMaxMinor / 100) : ''
  );

  const apply = () => {
    const parsed = priceMaxText.trim() ? Math.round(Number(priceMaxText) * 100) : undefined;
    const priceMaxMinor = parsed !== undefined && Number.isFinite(parsed) ? parsed : undefined;
    onApply({ categoryId, priceMaxMinor, minRating });
    onClose();
  };

  const clear = () => {
    setCategoryId(undefined);
    setPriceMaxText('');
    setMinRating(undefined);
    onApply({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Filtros</ThemedText>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={theme.text} />
            </Pressable>
          </View>

          <ThemedText type="smallBold">Categoría</ThemedText>
          <View style={styles.chipGrid}>
            {CATEGORY_OPTIONS.map((category) => {
              const selected = category.id === categoryId;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => setCategoryId(selected ? undefined : category.id)}
                  style={[styles.pill, { backgroundColor: selected ? theme.primary : theme.backgroundElement }]}
                >
                  <ThemedText type="small" style={{ color: selected ? '#FFFFFF' : theme.text }}>
                    {category.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <ThemedText type="smallBold" style={styles.sectionLabel}>
            Calificación mínima
          </ThemedText>
          <View style={styles.chipGrid}>
            {RATING_OPTIONS.map((rating) => {
              const selected = rating === minRating;

              return (
                <Pressable
                  key={rating}
                  onPress={() => setMinRating(selected ? undefined : rating)}
                  style={[styles.pill, { backgroundColor: selected ? theme.backgroundSelected : theme.backgroundElement }]}
                >
                  <ThemedText type="small" style={{ color: selected ? theme.primary : theme.text }}>
                    {rating}+
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <ThemedText type="smallBold" style={styles.sectionLabel}>
            Precio máximo (COP)
          </ThemedText>
          <TextInput
            value={priceMaxText}
            onChangeText={setPriceMaxText}
            keyboardType="numeric"
            placeholder="Sin límite"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          />

          <View style={styles.actions}>
            <Button label="Limpiar" variant="outlined" onPress={clear} style={styles.actionButton} />
            <Button label="Aplicar" variant="primary" onPress={apply} style={styles.actionButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.pill,
  },
  sectionLabel: {
    marginTop: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  actionButton: {
    flex: 1,
  },
});
