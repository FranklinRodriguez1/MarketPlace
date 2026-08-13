import { useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  ListingCard
} from '@/components/ListingCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import type { Listing } from '@/services/listing.service';
import { useMyListings, usePauseListing, usePublishListing } from './hooks/use-my-listings';

export default function MyListingsScreen() {
  const [selectedListing, setSelectedListing] =
    useState<Listing | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const { data: listings = [], isLoading, isError, refetch } = useMyListings();
  const publishMutation = usePublishListing();
  const pauseMutation = usePauseListing();

  const isActing = publishMutation.isPending || pauseMutation.isPending;

  const handleMenuPress = (listing: Listing) => {
    setActionError(null);
    setSelectedListing(listing);
  };

  const closeMenu = () => {
    if (isActing) return;
    setSelectedListing(null);
    setActionError(null);
  };

  const handleEdit = () => {
    if (selectedListing === null) return;
    const id = selectedListing.id;
    setSelectedListing(null);
    router.push({ pathname: '/(provider)/listings/edit/[id]', params: { id } });
  };

  const handlePublish = () => {
    if (selectedListing === null) return;
    setActionError(null);
    publishMutation.mutate(selectedListing.id, {
      onSuccess: () => setSelectedListing(null),
      onError: (error) =>
        setActionError(error instanceof Error ? error.message : t('myListings.publishError')),
    });
  };

  const handlePause = () => {
    if (selectedListing === null) return;
    setActionError(null);
    pauseMutation.mutate(selectedListing.id, {
      onSuccess: () => setSelectedListing(null),
      onError: (error) =>
        setActionError(error instanceof Error ? error.message : t('myListings.pauseError')),
    });
  };

  if (isLoading) {
    return (
     <ThemedView style={styles.emptyContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
     </ThemedView>
    )
  }

  if (isError) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <MaterialIcons
          name="error-outline"
          size={50}
          color={theme.textSecondary}
        />

        <ThemedText style={styles.emptyTitle}>
          {t('myListings.loadError')}
        </ThemedText>

        <Pressable
          style={[styles.emptyButton, { backgroundColor: theme.primary }]}
          onPress={() => void refetch()}
        >
          <ThemedText style={styles.emptyButtonText}>
            {t('common.retry')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (listings.length === 0) {
  return (
    <ThemedView style={styles.emptyContainer}>
      <MaterialIcons
        name="campaign"
        size={50}
        color={theme.textSecondary}
      />

      <ThemedText style={styles.emptyTitle}>
        {t('myListings.emptyTitle')}
      </ThemedText>

      <ThemedText themeColor="textSecondary" style={styles.emptyText}>
        {t('myListings.emptyText')}
      </ThemedText>

      <Pressable
        style={[styles.emptyButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/(provider)/listings/create')}
      >
        <ThemedText style={styles.emptyButtonText}>
          {t('myListings.publishAnAd')}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

  return (
    <ThemedView style={styles.container}>

      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable>
          <MaterialIcons
            name="close"
            size={24}
            color={theme.primary}
          />
        </Pressable>

        <ThemedText themeColor="primary" style={styles.logo}>
          {t('myListings.headerLogo')}
        </ThemedText>

        <View style={{ width: 24 }} />
      </View>

      {/* TÍTULO */}
      <ThemedText style={styles.heading}>
        {t('myListings.heading')}
      </ThemedText>

      {/* LISTADO */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onMenuPress={handleMenuPress}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={{ height: 12 }} />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTÓN + */}
      <Pressable onPress={()=> router.push('/(provider)/listings/create')} style={[styles.addButton, { backgroundColor: theme.primary }]}>
        <MaterialIcons
          name="add"
          size={30}
          color="#FFFFFF"
        />
      </Pressable>
      {/* MENÚ */}
      <Modal
        visible={selectedListing !== null}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={closeMenu}
        >
          <View style={[styles.menu, { backgroundColor: theme.surface }]}>

            <ThemedText style={styles.menuTitle}>
              {selectedListing?.title}
            </ThemedText>

            {actionError && (
              <ThemedText themeColor="danger" style={styles.menuError}>
                {actionError}
              </ThemedText>
            )}

            <Pressable style={styles.menuItem}>
              <MaterialIcons
                name="visibility"
                size={20}
                color={theme.text}
              />

              <ThemedText style={styles.menuText}>
                {t('myListings.menuViewAd')}
              </ThemedText>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={handleEdit} disabled={isActing}>
              <MaterialIcons
                name="edit"
                size={20}
                color={theme.text}
              />

              <ThemedText style={styles.menuText}>
                {t('myListings.menuEdit')}
              </ThemedText>
            </Pressable>

            {selectedListing?.status === 'published' && (
              <Pressable style={styles.menuItem} onPress={handlePause} disabled={isActing}>
                {pauseMutation.isPending ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : (
                  <MaterialIcons
                    name="pause"
                    size={20}
                    color={theme.text}
                  />
                )}

                <ThemedText style={styles.menuText}>
                  {t('myListings.menuPause')}
                </ThemedText>
              </Pressable>
            )}

            {(selectedListing?.status === 'paused' || selectedListing?.status === 'draft') && (
              <Pressable style={styles.menuItem} onPress={handlePublish} disabled={isActing}>
                {publishMutation.isPending ? (
                  <ActivityIndicator size="small" color="#15803D" />
                ) : (
                  <MaterialIcons
                    name="play-arrow"
                    size={20}
                    color="#15803D"
                  />
                )}

                <ThemedText style={styles.menuText}>
                  {t('myListings.menuPublish')}
                </ThemedText>
              </Pressable>
            )}

          </View>
        </Pressable>
      </Modal>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
   emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: '700',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },

  emptyButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },

  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },

  logo: {
    fontSize: 27,
    fontWeight: '800',
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },

  list: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },

  addButton: {
    position: 'absolute',
    right: 18,
    bottom: 75,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    marginBottom:20,

  },

  menu: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 8,
  },

  menuTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },

  menuError: {
    fontSize: 13,
    marginBottom: 4,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },

  menuText: {
    fontSize: 16,
  },
});
