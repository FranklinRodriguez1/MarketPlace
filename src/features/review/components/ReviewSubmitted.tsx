import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ReviewSubmitted() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.background, borderBottomColor: theme.border },
        ]}
      >
        <Pressable onPress={() => router.push('/')} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.primary}
          />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.primary }]}>
          Cerca
        </Text>

        <View
          style={[
            styles.profileButton,
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}
        >
          <AntDesign
            name="user"
            size={20}
            color={theme.primary}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* INFORMACIÓN DE LA RESERVA */}
        <View
          style={[
            styles.bookingCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
            }}
            style={styles.bookingImage}
          />

          <View style={styles.bookingInfo}>

            <View style={styles.titleRow}>
              <Text
                style={[styles.bookingTitle, { color: theme.text }]}
                numberOfLines={1}
              >
                Reparación de Tubería
              </Text>

              <View style={[styles.completedBadge, { backgroundColor: theme.backgroundSelected }]}>
                <Text style={[styles.completedText, { color: theme.text }]}>
                  Completado
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="person-outline"
                size={17}
                color={theme.textSecondary}
              />

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Proveedor: Juan Pérez
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="calendar-today"
                size={16}
                color={theme.textSecondary}
              />

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Fecha: 12 de Octubre, 2023
              </Text>
            </View>

          </View>
        </View>

        {/* MENSAJE DE RESEÑA ENVIADA */}
        <View
          style={[
            styles.successCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >

          <View style={[styles.checkCircle, { backgroundColor: theme.backgroundElement }]}>
            <Octicons
              name="check"
              size={30}
              color={theme.primary}
            />
          </View>

          <Text style={[styles.successTitle, { color: theme.text }]}>
            Ya reseñaste esta reserva
          </Text>

          <Text style={[styles.successDescription, { color: theme.textSecondary }]}>
            Gracias por compartir tu experiencia con la
            comunidad. Tu opinión ayuda a mantener la
            calidad en nuestro servicio.
          </Text>

          <Button
            label="Ver tu reseña"
            variant="outlined"
            onPress={() => {
              console.log('Ver reseña');
            }}
            style={styles.viewReviewButton}
            trailingIcon={(color) => <AntDesign name="arrow-right" size={16} color={color} />}
          />

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    padding: 16,
    gap: 28,
    paddingBottom: 30,
  },

  bookingCard: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },

  bookingImage: {
    width: '100%',
    height: 145,
    resizeMode: 'cover',
  },

  bookingInfo: {
    padding: 16,
    gap: 12,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  bookingTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },

  completedBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  completedText: {
    fontSize: 12,
    fontWeight: '600',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  infoText: {
    fontSize: 13,
  },

  successCard: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    paddingHorizontal: 32,
    paddingVertical: 46,
    alignItems: 'center',
  },

  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  successTitle: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },

  successDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 270,
  },

  viewReviewButton: {
    marginTop: 28,
    alignSelf: 'center',
  },
});