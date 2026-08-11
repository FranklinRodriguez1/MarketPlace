import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Coordinates } from '@cerca/src';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface CityOption {
  id: string;
  label: string;
  coordinates: Coordinates;
}

interface CitySelectorSheetProps {
  visible: boolean;
  cities: readonly CityOption[];
  selectedCityId?: string;
  onSelect: (cityId: string) => void;
  onRetryGps: () => void;
}

export function CitySelectorSheet({ visible, cities, selectedCityId, onSelect, onRetryGps }: CitySelectorSheetProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <ThemedText style={styles.title}>Elige tu ciudad</ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            No pudimos acceder a tu ubicación. Elige una ciudad para ver servicios cerca de ti.
          </ThemedText>

          {cities.map((city) => {
            const selected = city.id === selectedCityId;

            return (
              <Pressable
                key={city.id}
                onPress={() => onSelect(city.id)}
                style={[
                  styles.cityRow,
                  { borderColor: theme.border, backgroundColor: selected ? theme.backgroundSelected : theme.background },
                ]}
              >
                <ThemedText>{city.label}</ThemedText>
                {selected && <Ionicons name="checkmark" size={18} color={theme.primary} />}
              </Pressable>
            );
          })}

          <Pressable onPress={onRetryGps} style={styles.retry}>
            <Ionicons name="locate-outline" size={16} color={theme.primary} />
            <ThemedText type="small" style={{ color: theme.primary }}>
              Intentar con mi ubicación otra vez
            </ThemedText>
          </Pressable>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    marginBottom: 4,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
});
