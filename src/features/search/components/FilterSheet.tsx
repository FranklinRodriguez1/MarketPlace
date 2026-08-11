import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_OPTIONS } from '../types/search.types';
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
  const [priceMaxText, setPriceMaxText] = useState(
    filters.priceMaxMinor ? String(filters.priceMaxMinor / 100) : ''
  );

  const apply = () => {
    const parsed = priceMaxText.trim() ? Math.round(Number(priceMaxText) * 100) : undefined;
    const priceMaxMinor = parsed !== undefined && Number.isFinite(parsed) ? parsed : undefined;
    onApply({ categoryId, priceMaxMinor });
    onClose();
  };

  const clear = () => {
    setCategoryId(undefined);
    setPriceMaxText('');
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
          <View style={styles.categoryGrid}>
            {CATEGORY_OPTIONS.map((category) => {
              const selected = category.id === categoryId;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => setCategoryId(selected ? undefined : category.id)}
                  style={[styles.pill, { backgroundColor: selected ? theme.primary : theme.backgroundElement }]}
                >
                  <ThemedText type="small" style={{ color: selected ? '#fff' : theme.text }}>
                    {category.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <ThemedText type="smallBold" style={styles.priceLabel}>
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
            <Pressable onPress={clear} style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}>
              <ThemedText type="smallBold">Limpiar</ThemedText>
            </Pressable>
            <Pressable onPress={apply} style={[styles.button, { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" style={{ color: '#fff' }}>
                Aplicar
              </ThemedText>
            </Pressable>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  priceLabel: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
  },
});
