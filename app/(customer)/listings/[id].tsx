import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

// Placeholder de Fase 2: la pantalla de Detalle completa (fotos, precio, reseñas, botón de reserva)
// se construye junto con Reservas. Por ahora solo confirma que la navegación desde Búsqueda llega
// con el id correcto.
export default function ListingDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.content, { paddingTop: insets.top + Spacing.four }]}>
        <ThemedText style={styles.title}>Detalle de anuncio</ThemedText>
        <ThemedText themeColor="textSecondary">Listing ID: {id}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          Esta pantalla se completa en la Fase 2 (Detalle + Reservas).
        </ThemedText>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText type="linkPrimary">Volver a la búsqueda</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  note: {
    marginTop: Spacing.two,
  },
  backButton: {
    marginTop: Spacing.four,
  },
});
