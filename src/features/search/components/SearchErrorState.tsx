import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface SearchErrorStateProps {
  onRetry: () => void;
}

export function SearchErrorState({ onRetry }: SearchErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color={theme.danger} />
      <ThemedText style={styles.title}>No pudimos cargar los resultados</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
        Revisa tu conexión e inténtalo de nuevo.
      </ThemedText>
      <Pressable onPress={onRetry} style={[styles.button, { backgroundColor: theme.primary }]}>
        <ThemedText type="smallBold" style={{ color: '#fff' }}>
          Reintentar
        </ThemedText>
      </Pressable>
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
