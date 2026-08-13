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

export function ReviewSubmitted() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/')} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="#0369A1"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Cerca
        </Text>

        <View style={styles.profileButton}>
          <AntDesign
            name="user"
            size={20}
            color="#0369A1"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* INFORMACIÓN DE LA RESERVA */}
        <View style={styles.bookingCard}>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
            }}
            style={styles.bookingImage}
          />

          <View style={styles.bookingInfo}>

            <View style={styles.titleRow}>
              <Text
                style={styles.bookingTitle}
                numberOfLines={1}
              >
                Reparación de Tubería
              </Text>

              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>
                  Completado
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="person-outline"
                size={17}
                color="#64748B"
              />

              <Text style={styles.infoText}>
                Proveedor: Juan Pérez
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="calendar-today"
                size={16}
                color="#64748B"
              />

              <Text style={styles.infoText}>
                Fecha: 12 de Octubre, 2023
              </Text>
            </View>

          </View>
        </View>

        {/* MENSAJE DE RESEÑA ENVIADA */}
        <View style={styles.successCard}>

          <View style={styles.checkCircle}>
            <Octicons
              name="check"
              size={30}
              color="#0369A1"
            />
          </View>

          <Text style={styles.successTitle}>
            Ya reseñaste esta reserva
          </Text>

          <Text style={styles.successDescription}>
            Gracias por compartir tu experiencia con la
            comunidad. Tu opinión ayuda a mantener la
            calidad en nuestro servicio.
          </Text>

          <Pressable
            style={styles.viewReviewButton}
            onPress={() => {
              console.log('Ver reseña');
            }}
          >
            <Text style={styles.viewReviewText}>
              Ver tu reseña
            </Text>

            <AntDesign
              name="arrow-right"
              size={16}
              color="#0369A1"
            />
          </Pressable>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F2',
  },

  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8F7F2',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#075985',
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  content: {
    padding: 16,
    gap: 28,
    paddingBottom: 30,
  },

  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
    color: '#0F172A',
  },

  completedBadge: {
    backgroundColor: '#E2E8D8',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  completedText: {
    color: '#166534',
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
    color: '#64748B',
  },

  successCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 32,
    paddingVertical: 46,
    alignItems: 'center',
  },

  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E7E4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  successTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 18,
  },

  successDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    maxWidth: 270,
  },

  viewReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 28,
  },

  viewReviewText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '600',
  },

  

  
});