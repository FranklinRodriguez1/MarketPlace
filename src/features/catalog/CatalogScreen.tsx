import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import type { Listing } from '@cerca/src';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

import { CategoryChips } from '@/features/search/components/CategoryChips';
import { FilterButton } from '@/features/search/components/FilterButton';
import { ListingCard } from '@/features/search/components/ListingCard';
import { ListingCardSkeleton } from '@/features/search/components/ListingCardSkeleton';
import { SearchBar } from '@/features/search/components/SearchBar';
import { ServicesEmptyState } from '@/features/search/components/ServicesEmptyState';
import { ServicesErrorState } from '@/features/search/components/ServicesErrorState';
import { CitySelectorSheet } from '@/features/search/components/CitySelectorSheet';
import { useSearchListings } from '@/features/search/hooks/use-search-listings';
import { useSearchLocation } from '@/features/search/hooks/use-search-location';

const SKELETON_ROWS = [1, 2, 3, 4, 5];

// Ventana principal del customer: el banco completo de servicios publicados
// por los providers. El buscador y el botón de filtro son solo entradas a
// /search (ahí vive la gestión de filtros); la categoría sí filtra en el
// momento, como acceso rápido para explorar sin salir de esta pantalla.
export function CatalogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const location = useSearchLocation();

  const results = useSearchListings(
    { categoryId },
    location.coordinates,
    Boolean(location.coordinates)
  );

  const handleOpenDetail = (listingId: string) => {
    router.push({ pathname: '/(customer)/listings/[id]', params: { id: listingId } });
  };

  const goToSearch = () => router.push('/search');

  const items = results.data?.items ?? [];

  const renderBody = () => {
    if (!location.coordinates || results.isPending) {
      return (
        <View>
          {SKELETON_ROWS.map((row) => (
            <ListingCardSkeleton key={row} />
          ))}
        </View>
      );
    }

    if (results.isError) {
      return <ServicesErrorState onRetry={() => results.refetch()} />;
    }

    if (items.length === 0) {
      return (
        <ServicesEmptyState
          variant={categoryId ? 'no-filter-match' : 'no-coverage'}
          onClearFilters={categoryId ? () => setCategoryId(undefined) : undefined}
        />
      );
    }

    return (
      <FlashList<Listing>
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} onPress={handleOpenDetail} />}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
          <ThemedText themeColor="primary" style={styles.brand}>
            Cerca
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Servicios disponibles cerca de ti
          </ThemedText>
        </View>

        <View style={styles.searchRow}>
          <SearchBar value="" onChangeText={() => {}} editable={false} onPress={goToSearch} />
          <FilterButton onPress={goToSearch} />
        </View>

        <CategoryChips selectedCategoryId={categoryId} onSelect={setCategoryId} />

        <View style={styles.body}>{renderBody()}</View>

        <CitySelectorSheet
          visible={location.status === 'manual' && !location.coordinates}
          cities={location.cities}
          selectedCityId={location.cityId}
          onSelect={location.selectCity}
          onRetryGps={location.retryGps}
        />
      </View>
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
  },
  header: {
    gap: Spacing.half,
    paddingBottom: Spacing.three,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  body: {
    flex: 1,
    marginTop: Spacing.three,
  },
  listContent: {
    paddingBottom: Spacing.four,
  },
});
