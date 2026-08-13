import { StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ServicesEmptyStateProps {
  variant: 'no-coverage' | 'no-filter-match';
  onClearFilters?: () => void;
}

const COPY = {
  'no-coverage': {
    title: 'Aún no hay servicios cerca de ti',
    description:
      'Por ahora Cerca solo tiene proveedores en Bogotá y Medellín. Elige una de esas ciudades para ver resultados.',
  },
  'no-filter-match': {
    title: 'Ningún servicio coincide con estos filtros',
    description: 'Intenta ajustar los criterios de búsqueda o eliminar algunos filtros para ver más resultados en tu barrio.',
  },
};

export function ServicesEmptyState({ variant, onClearFilters }: ServicesEmptyStateProps) {
  const theme = useTheme();
  const copy = COPY[variant];

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: theme.backgroundElement }]}>
        {variant === 'no-filter-match' ? (
          <MaterialCommunityIcons name="magnify-close" size={40} color={theme.textSecondary} />
        ) : (
          <Ionicons name="location-outline" size={40} color={theme.textSecondary} />
        )}
      </View>
      <ThemedText style={styles.title}>{copy.title}</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
        {copy.description}
      </ThemedText>
      {variant === 'no-filter-match' && onClearFilters && (
        <Button
          label="Limpiar filtros"
          variant="outlined"
          onPress={onClearFilters}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.six,
    gap: Spacing.three,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.two,
    alignSelf: 'stretch',
  },
});
