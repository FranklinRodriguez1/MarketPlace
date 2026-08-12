import { Image, Pressable, StyleSheet, View } from 'react-native';
import { formatMoney } from '@cerca/src';
import type { Listing } from '@cerca/src';
import { getLocales } from 'expo-localization';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_OPTIONS } from '../types/search.types';

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
  const category = CATEGORY_OPTIONS.find((option) => option.id === listing.categoryId);
  const price = priceLabel(listing);

  return (
    <Pressable
      onPress={() => onPress(listing.id)}
      style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }]}
    >
      <Image source={{ uri: listing.photos[0] }} style={styles.image} />
      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {listing.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {listing.providerName}
        </ThemedText>
        {category && (
          <View style={[styles.tag, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small" themeColor="textSecondary">
              {category.label}
            </ThemedText>
          </View>
        )}
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
    borderRadius: 16,
    padding: 12,
    gap: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
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
