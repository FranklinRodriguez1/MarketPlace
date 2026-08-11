import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface SearchEmptyStateProps {
  variant: 'no-coverage' | 'no-filter-match';
  onClearFilters?: () => void;
}

const COPY = {
  'no-coverage': {
    title: 'Aún no hay servicios cerca de ti',
    description:
      'Por ahora Cerca solo tiene proveedores en Bogotá y Medellín. Elige una de esas ciudades para ver resultados.',
    icon: 'location-outline' as const,
  },
  'no-filter-match': {
    title: 'No encontramos resultados con estos filtros',
    description: 'Prueba quitando algún filtro o ampliando el precio máximo.',
    icon: 'filter-outline' as const,
  },
};

export function SearchEmptyState({ variant, onClearFilters }: SearchEmptyStateProps) {
  const theme = useTheme();
  const copy = COPY[variant];

  return (
    <View style={styles.container}>
      <Ionicons name={copy.icon} size={40} color={theme.textSecondary} />
      <ThemedText style={styles.title}>{copy.title}</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
        {copy.description}
      </ThemedText>
      {variant === 'no-filter-match' && onClearFilters && (
        <Pressable onPress={onClearFilters} style={[styles.button, { backgroundColor: theme.primary }]}>
          <ThemedText type="smallBold" style={{ color: '#fff' }}>
            Limpiar filtros
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
});
