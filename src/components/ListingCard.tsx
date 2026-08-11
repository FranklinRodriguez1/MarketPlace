import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type ListingStatus =
  | 'published'
  | 'paused'
  | 'under_review';

export interface Listing {
  id: string;
  image: string;
  category: string;
  title: string;
  location: string;
  price: number;
  pricingType: 'fixed' | 'hourly' | 'base';
  status: ListingStatus;
}

interface ListingCardProps {
  listing: Listing;
  onMenuPress?: (listing: Listing) => void;
}

export function ListingCard({
  listing,
  onMenuPress,
}: ListingCardProps) {
  const getStatus = () => {
    switch (listing.status) {
      case 'published':
        return {
          text: 'Publicado',
          icon: 'check-circle' as const,
          color: '#15803D',
          backgroundColor: '#DCFCE7',
        };

      case 'paused':
        return {
          text: 'Pausado',
          icon: 'pause-circle' as const,
          color: '#64748B',
          backgroundColor: '#E2E8F0',
        };

      case 'under_review':
        return {
          text: 'En revisión',
          icon: 'schedule' as const,
          color: '#EA580C',
          backgroundColor: '#FFEDD5',
        };
    }
  };

  const status = getStatus();

  const getPriceLabel = () => {
    switch (listing.pricingType) {
      case 'hourly':
        return 'POR HR';

      case 'base':
        return 'BASE';

      default:
        return 'DESDE';
    }
  };

  return (
    <View style={styles.card}>

      {/* IMAGEN */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.image }}
          style={styles.image}
        />

        {/* ESTADO */}
        <View
          style={[
            styles.status,
            {
              backgroundColor: status.backgroundColor,
            },
          ]}
        >
          <MaterialIcons
            name={status.icon}
            size={12}
            color={status.color}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: status.color,
              },
            ]}
          >
            {status.text}
          </Text>
        </View>
      </View>

      {/* INFORMACIÓN */}
      <View style={styles.info}>

        <View style={styles.categoryContainer}>
          <Text style={styles.category}>
            {listing.category}
          </Text>
        </View>

        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {listing.title}
        </Text>

        <View style={styles.locationContainer}>
          <MaterialIcons
            name="location-on"
            size={14}
            color="#64748B"
          />

          <Text
            style={styles.location}
            numberOfLines={1}
          >
            {listing.location}
          </Text>
        </View>
      </View>

      {/* PRECIO */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>
          {getPriceLabel()}
        </Text>

        <Text style={styles.price}>
          ${listing.price}
        </Text>
      </View>

      {/* MENÚ */}
      <Pressable
        onPress={() => onMenuPress?.(listing)}
        style={styles.menuButton}
      >
        <MaterialIcons
          name="more-vert"
          size={22}
          color="#334155"
        />
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 128,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },

  imageContainer: {
    width: '32%',
    height: '100%',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  status: {
    position: 'absolute',
    top: 8,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },

  info: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 28,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },

  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 5,
  },

  category: {
    fontSize: 9,
    color: '#0369A1',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },

  location: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
  },

  priceContainer: {
    width: '26%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },

  priceLabel: {
    fontSize: 9,
    color: '#334155',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#B91C1C',
  },

  menuButton: {
    position: 'absolute',
    right: 5,
    top: 7,
    padding: 2,
  },
});