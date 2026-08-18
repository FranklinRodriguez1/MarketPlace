import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import type { Listing } from '@cerca/src';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import { getAccessToken } from '@/features/auth/session';
import { useTheme } from '@/hooks/use-theme';
import { darkenColor } from '@/utils/color';

import { ActiveFilterChips } from './components/ActiveFilterChips';
import { CategoryChips } from './components/CategoryChips';
import { CitySelectorSheet } from './components/CitySelectorSheet';
import { FilterButton } from './components/FilterButton';
import { FilterSheet } from './components/FilterSheet';
import { ListingCard } from './components/ListingCard';
import { ListingCardSkeleton } from './components/ListingCardSkeleton';
import { SearchBar } from './components/SearchBar';
import { ServicesEmptyState } from './components/ServicesEmptyState';
import { ServicesErrorState } from './components/ServicesErrorState';
import { useSearchListings } from './hooks/use-search-listings';
import { useSearchLocation } from './hooks/use-search-location';
import type { FilterState } from './types/search.types';

const SKELETON_ROWS = [1, 2, 3, 4, 5];

// Pantalla de /search: donde el cliente gestiona texto, categoría, precio
// y calificación para encontrar un servicio puntual. La vista principal
// (tab Inicio → CatalogScreen) manda acá al tocar el buscador o un filtro.
export function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [queryText, setQueryText] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    void getAccessToken().then((token) => setIsAuthenticated(token !== null));
  }, []);

  const location = useSearchLocation();

  const searchFilters = useMemo(
    () => ({ query: queryText || undefined, ...filters }),
    [queryText, filters]
  );

  const results = useSearchListings(searchFilters, location.coordinates, Boolean(location.coordinates));

  const handleOpenDetail = (listingId: string) => {
    router.push({ pathname: '/(customer)/listings/[id]', params: { id: listingId } });
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const removeFilter = (key: keyof FilterState) => {
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const hasActiveFilters = Boolean(
    filters.categoryId || filters.priceMaxMinor || filters.minRating || queryText
  );
  const hasActiveFilterChips = Boolean(filters.categoryId || filters.priceMaxMinor || filters.minRating);
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
      <View style={styles.content}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <Pressable onPress={handleClose} hitSlop={12}>
            {({ pressed }) => (
              <Ionicons name="close" size={26} color={pressed ? '#0369A1' : theme.primary} />
            )}
          </Pressable>
          <ThemedText style={[styles.logo, { color: theme.primary }]}>Cerca</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {/* BUSCADOR + FILTROS */}
        <View style={[styles.searchCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.searchRow}>
            <SearchBar value={queryText} onChangeText={setQueryText} />
            <FilterButton active={hasActiveFilterChips} onPress={() => setFilterSheetOpen(true)} />
          </View>

          <ActiveFilterChips filters={filters} onRemove={removeFilter} />

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <CategoryChips
            selectedCategoryId={filters.categoryId}
            onSelect={(categoryId) => setFilters((current) => ({ ...current, categoryId }))}
          />
        </View>

        {/* RESULTADOS */}
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
      </View>

      {/* BARRA DE INVITADO — solo si no hay sesión guardada */}
      {isAuthenticated === false && (
        <View
          style={[
            styles.guestBar,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              paddingBottom: insets.bottom + Spacing.two,
            },
          ]}
        >
          <View style={styles.guestBarContent}>
            <Pressable
              style={({ pressed }) => [
                styles.guestItem,
                pressed && { backgroundColor: darkenColor(theme.surface), borderRadius: BorderRadius.input },
              ]}
              onPress={() => router.push('/login')}
            >
              <Ionicons name="log-in-outline" size={22} color={theme.text} />
              <ThemedText type="small">Login</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.guestItem,
                pressed && { backgroundColor: darkenColor(theme.surface), borderRadius: BorderRadius.input },
              ]}
              onPress={() => router.push('/register')}
            >
              <Ionicons name="person-add-outline" size={22} color={theme.text} />
              <ThemedText type="small">Sign Up</ThemedText>
            </Pressable>
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.three,
  },
  headerSpacer: {
    width: 26,
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
  },
  searchCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.card,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  divider: {
    height: 1,
  },
  body: {
    flex: 1,
    marginTop: Spacing.three,
  },
  listContent: {
    paddingBottom: Spacing.four,
  },
  guestBar: {
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    width: '100%',
  },
  guestBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  guestItem: {
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.five,
  },
});
