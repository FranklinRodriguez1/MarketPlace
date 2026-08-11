import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function Step4Review() {
  return (
    <View style={styles.container}>

      {/* TÍTULO */}
      <Text style={styles.title}>
        Check your ad
      </Text>

      <Text style={styles.description}>
        This is how users will see your service listed on the bulletin board
      </Text>

      {/* TARJETA DE PREVISUALIZACIÓN */}
      <View style={styles.card}>

        {/* IMAGEN */}
        <Image
          style={styles.image}
          source={{
            uri: 'https://i.pinimg.com/originals/58/ff/0f/58ff0ff4b5df051295951e9459ad47d9.jpg?nii=t',
          }}
        />

        {/* INFORMACIÓN */}
        <View style={styles.info}>

          {/* CATEGORÍA */}
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>
              JARDINERÍA
            </Text>
          </View>

          {/* TÍTULO */}
          <Text
            style={styles.serviceTitle}
            numberOfLines={1}
          >
            Mantenimiento de jardín
          </Text>

          {/* ESTADO */}
          <View style={styles.statusContainer}>
            <MaterialIcons
              name="star"
              size={16}
              color="#111827"
            />

            <Text style={styles.status}>
              Nuevo
            </Text>
          </View>

        </View>

        {/* PRECIO */}
        <View style={styles.priceContainer}>

          <Text style={styles.from}>
            DESDE
          </Text>

          <Text style={styles.price}>
            $45
          </Text>

        </View>

      </View>

      {/* BOTÓN */}
      <Pressable style={styles.publishButton}>

        <MaterialIcons
          name="publish"
          size={22}
          color="#fff"
        />

        <Text style={styles.publishText}>
          Post an ad
        </Text>

      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },

  // TARJETA
  card: {
    width: '100%',
    height: 105,

    flexDirection: 'row',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#D1D5DB',

    borderRadius: 10,

    overflow: 'hidden',

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  // IMAGEN
  image: {
    width: 90,
    height: '100%',
  },

  // INFORMACIÓN
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,

    justifyContent: 'center',

    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },

  categoryContainer: {
    alignSelf: 'flex-start',

    backgroundColor: '#F1F5F9',

    borderWidth: 1,
    borderColor: '#CBD5E1',

    borderRadius: 10,

    paddingHorizontal: 8,
    paddingVertical: 2,

    marginBottom: 5,
  },

  category: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '500',
  },

  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',

    marginBottom: 4,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  status: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },

  // PRECIO
  priceContainer: {
    width: 78,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 6,
  },

  from: {
    fontSize: 9,
    color: '#334155',
    letterSpacing: 1,
    fontWeight: '500',

    marginBottom: 2,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#B91C1C',
  },

  // BOTÓN
  publishButton: {
    marginTop: 20,

    backgroundColor: '#075985',

    minHeight: 48,

    borderRadius: 8,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,
  },

  publishText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '600',
  },
});