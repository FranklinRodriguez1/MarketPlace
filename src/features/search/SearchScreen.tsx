import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import type { Listing } from '@cerca/src';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { CategoryPills } from './components/CategoryPills';
import { CitySelectorSheet } from './components/CitySelectorSheet';
import { FilterButton } from './components/FilterButton';
import { FilterSheet } from './components/FilterSheet';
import { ListingCard } from './components/ListingCard';
import { ListingCardSkeleton } from './components/ListingCardSkeleton';
import { SearchBar } from './components/SearchBar';
import { SearchEmptyState } from './components/SearchEmptyState';
import { SearchErrorState } from './components/SearchErrorState';
import { useSearchListings } from './hooks/use-search-listings';
import { useSearchLocation } from './hooks/use-search-location';
import type { FilterState } from './types/search.types';

const SKELETON_ROWS = [1, 2, 3, 4, 5];

export function SearchScreen() {
  const router = useRouter();

  const [queryText, setQueryText] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const location = useSearchLocation();

  const searchFilters = useMemo(
    () => ({ query: queryText || undefined, ...filters }),
    [queryText, filters]
  );

  const results = useSearchListings(searchFilters, location.coordinates, Boolean(location.coordinates));

  const handleOpenDetail = (listingId: string) => {
    router.push({ pathname: '/(customer)/listings/[id]', params: { id: listingId } });
  };

  const hasActiveFilters = Boolean(filters.categoryId || filters.priceMaxMinor || queryText);
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
      return <SearchErrorState onRetry={() => results.refetch()} />;
    }

    if (items.length === 0) {
      return (
        <SearchEmptyState
          variant={hasActiveFilters ? 'no-filter-match' : 'no-coverage'}
          onClearFilters={
            hasActiveFilters
              ? () => {
                  setFilters({});
                  setQueryText('');
                }
              : undefined
          }
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
      <ThemedText style={styles.brand}>Cerca</ThemedText>

      <View style={styles.searchRow}>
        <SearchBar value={queryText} onChangeText={setQueryText} />
        <FilterButton
          active={Boolean(filters.categoryId || filters.priceMaxMinor)}
          onPress={() => setFilterSheetOpen(true)}
        />
      </View>

      <CategoryPills
        selectedCategoryId={filters.categoryId}
        onSelect={(categoryId) => setFilters((current) => ({ ...current, categoryId }))}
      />

      <View style={styles.body}>{renderBody()}</View>

      <FilterSheet
        visible={filterSheetOpen}
        filters={filters}
        onApply={setFilters}
        onClose={() => setFilterSheetOpen(false)}
      />

      <CitySelectorSheet
        visible={location.status === 'manual' && !location.coordinates}
        cities={location.cities}
        selectedCityId={location.cityId}
        onSelect={location.selectCity}
        onRetryGps={location.retryGps}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
});
