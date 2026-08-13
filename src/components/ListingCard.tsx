import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { Listing } from '@/services/listing.service';

interface ListingCardProps {
  listing: Listing;
  onMenuPress: (listing: Listing) => void;
}

export function ListingCard({
  listing,
  onMenuPress,
}: ListingCardProps) {
  return (
    <View style={styles.card}>

      <View style={styles.imagePlaceholder}>
        <MaterialIcons
          name="image"
          size={40}
          color="#94A3B8"
        />
      </View>

      <View style={styles.content}>

        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {listing.title}
          </Text>

          <Pressable onPress={() => onMenuPress(listing)}>
            <MaterialIcons
              name="more-vert"
              size={24}
              color="#334155"
            />
          </Pressable>
        </View>

        <Text style={styles.description}>
          {listing.description}
        </Text>

        <View style={styles.infoRow}>

          <Text style={styles.status}>
            {getStatusText(listing.status)}
          </Text>

          {listing.priceFrom !== null && (
            <Text style={styles.price}>
              {listing.priceFrom.currency}{' '}
              {(listing.priceFrom.amountMinor / 100).toFixed(2)}
            </Text>
          )}

        </View>

      </View>

    </View>
  );
}

function getStatusText(
  status: Listing['status'],
) {
  switch (status) {
    case 'published':
      return 'Publicado';

    case 'paused':
      return 'Pausado';

    case 'draft':
      return 'Borrador';

    case 'under_review':
      return 'En revisión';

    case 'removed':
      return 'Eliminado';
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },

  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },

  description: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 14,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  status: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0369A1',
  },

  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
});