import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ServicesErrorStateProps {
  onRetry: () => void;
}

export function ServicesErrorState({ onRetry }: ServicesErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color={theme.danger} />
      <ThemedText style={styles.title}>No pudimos cargar los resultados</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
        Revisa tu conexión e inténtalo de nuevo.
      </ThemedText>
      <Button label="Reintentar" variant="primary" onPress={onRetry} style={styles.button} />
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.two,
  },
});
