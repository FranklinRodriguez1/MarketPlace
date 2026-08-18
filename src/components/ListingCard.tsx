import {
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {  Spacing } from '@/constants/theme';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { Listing } from '@/services/listing.service';
import { darkenColor } from '@/utils/color';

interface ListingCardProps {
  listing: Listing;
  onMenuPress: (listing: Listing) => void;
}

export function ListingCard({
  listing,
  onMenuPress,
}: ListingCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>

      <View style={[styles.imagePlaceholder, { backgroundColor: theme.backgroundElement }]}>
        <MaterialIcons
          name="image"
          size={40}
          color={theme.textSecondary}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.title}>
            {listing.title}
          </ThemedText>

          <Pressable onPress={() => onMenuPress(listing)}>
            {({ pressed }) => (
              <MaterialIcons
                name="more-vert"
                size={24}
                color={pressed ? darkenColor(theme.text) : theme.text}
              />
            )}
          </Pressable>
        </View>

        <ThemedText themeColor="textSecondary" style={styles.description}>
          {listing.description}
        </ThemedText>

        <View style={styles.infoRow}>

          <ThemedText themeColor="primary" style={styles.status}>
            {getStatusText(t, listing.status)}
          </ThemedText>

          {listing.priceFrom !== null && (
            <ThemedText style={styles.price}>
              {listing.priceFrom.currency}{' '}
              {(listing.priceFrom.amountMinor / 100).toFixed(2)}
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
}

function getStatusText(
  t: TFunction,
  status: Listing['status'],
) {
  switch (status) {
    case 'published':
      return t('listingCard.statusPublished');

    case 'paused':
      return t('listingCard.statusPaused');

    case 'draft':
      return t('listingCard.statusDraft');

    case 'under_review':
      return t('listingCard.statusUnderReview');

    case 'removed':
      return t('listingCard.statusRemoved');
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: Spacing.three,
  },

  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
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
    marginTop: 6,
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
