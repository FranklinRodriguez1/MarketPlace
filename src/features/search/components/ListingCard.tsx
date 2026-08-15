import { Image, Pressable, StyleSheet, View } from 'react-native';
import { formatMoney } from '@cerca/src';
import type { Listing } from '@cerca/src';
import { getLocales } from 'expo-localization';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useCategories } from '@/features/listing/create/hooks/use-categories';
import { useTheme } from '@/hooks/use-theme';

interface ListingCardProps {
  listing: Listing;
  onPress: (listingId: string) => void;
}

function priceLabel(listing: Listing): { amount: string; unit?: string } {
  const localeTag = getLocales()[0]?.languageTag ?? 'es-CO';

  if (listing.pricing.model === 'fixed') {
    return { amount: formatMoney(listing.pricing.price, localeTag) };
  }

  if (listing.pricing.model === 'hourly') {
    return { amount: formatMoney(listing.pricing.hourlyRate, localeTag), unit: 'por hora' };
  }

  return { amount: 'A cotizar' };
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const theme = useTheme();
  const { data: categories = [] } = useCategories();
  const category = categories.find((option) => option.slug === listing.categoryId);
  const price = priceLabel(listing);

  return (
    <Pressable
      onPress={() => onPress(listing.id)}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <Image source={{ uri: listing.photos[0] }} style={[styles.image, { backgroundColor: theme.backgroundElement }]} />
      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {listing.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {listing.providerName}
        </ThemedText>

        <View style={styles.metaRow}>
          {category && (
            <View style={[styles.tag, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small" themeColor="textSecondary">
                {category.name}
              </ThemedText>
            </View>
          )}

          {listing.ratingAverage !== undefined && (
            <View style={styles.rating}>
              <Ionicons name="star" size={13} color={theme.primary} />
              <ThemedText type="small" themeColor="textSecondary">
                {listing.ratingAverage.toFixed(1)}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.price}>
        <ThemedText type="smallBold">{price.amount}</ThemedText>
        {price.unit && (
          <ThemedText type="small" themeColor="textSecondary">
            {price.unit}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: BorderRadius.card,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.three,
    alignItems: 'center',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.input,
  },
  body: {
    flex: 1,
    gap: Spacing.one,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
  },
  price: {
    minWidth: 70,
    alignItems: 'flex-end',
  },
});
