import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Listing } from '@/services/listing.service';

interface ListingCardProps {
  listing: Listing;
  onMenuPress: (listing: Listing) => void;
}

export function ListingCard({ listing, onMenuPress }: ListingCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.imagePlaceholder, { backgroundColor: theme.backgroundElement }]}>
        <MaterialIcons name="image" size={40} color={theme.textSecondary} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>{listing.title}</Text>

          <Pressable onPress={() => onMenuPress(listing)}>
            <MaterialIcons name="more-vert" size={24} color={theme.textSecondary} />
          </Pressable>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {listing.description}
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.status, { color: theme.primary }]}>
            {getStatusText(listing.status)}
          </Text>

          {listing.priceFrom !== null && (
            <Text style={[styles.price, { color: theme.text }]}>
              {listing.priceFrom.currency}{' '}
              {(listing.priceFrom.amountMinor / 100).toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

function getStatusText(status: Listing['status']) {
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
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    padding: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.three,
  },

  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.input,
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
  },

  description: {
    marginTop: Spacing.two,
    fontSize: 14,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
  },

  status: {
    fontSize: 13,
    fontWeight: '600',
  },

  price: {
    fontSize: 15,
    fontWeight: '700',
  },
});
