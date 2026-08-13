import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  ListingCard
} from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Listing } from '@/services/listing.service';
import { useMyListings, usePauseListing, usePublishListing } from './hooks/use-my-listings';

export default function MyListingsScreen() {
  const theme = useTheme();
  const [selectedListing, setSelectedListing] =
    useState<Listing | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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
        setActionError(error instanceof Error ? error.message : 'No se pudo publicar el anuncio.'),
    });
  };

  const handlePause = () => {
    if (selectedListing === null) return;
    setActionError(null);
    pauseMutation.mutate(selectedListing.id, {
      onSuccess: () => setSelectedListing(null),
      onError: (error) =>
        setActionError(error instanceof Error ? error.message : 'No se pudo pausar el anuncio.'),
    });
  };

  if (isLoading) {
    return (
     <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
     </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="error-outline"
          size={50}
          color={theme.textSecondary}
        />

        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No se pudieron cargar tus anuncios
        </Text>

        <Button
          label="Reintentar"
          variant="primary"
          onPress={() => void refetch()}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  if (listings.length === 0) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="campaign"
        size={50}
        color={theme.textSecondary}
      />

      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        There are no ads
      </Text>

      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        You haven't published any ads yet.
      </Text>

      <Button
        label="Publish an ad"
        variant="primary"
        onPress={() => router.push('/(provider)/listings/create')}
        style={styles.emptyButton}
      />
    </View>
  );
}

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Pressable>
          <MaterialIcons
            name="close"
            size={24}
            color={theme.primary}
          />
        </Pressable>

        <Text style={[styles.logo, { color: theme.primary }]}>
          Cerca
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* TÍTULO */}
      <Text style={[styles.heading, { color: theme.text }]}>
        Mis anuncios
      </Text>

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
      </View>

      {/* BOTÓN + */}
      <Pressable
        onPress={()=> router.push('/(provider)/listings/create')}
        style={[styles.addButton, { backgroundColor: theme.primary }]}
      >
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

            <Text style={[styles.menuTitle, { color: theme.text }]}>
              {selectedListing?.title}
            </Text>

            {actionError && (
              <Text style={[styles.menuError, { color: theme.danger }]}>
                {actionError}
              </Text>
            )}

            <Pressable style={styles.menuItem}>
              <MaterialIcons
                name="visibility"
                size={20}
                color={theme.text}
              />

              <Text style={[styles.menuText, { color: theme.text }]}>
                Ver anuncio
              </Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={handleEdit} disabled={isActing}>
              <MaterialIcons
                name="edit"
                size={20}
                color={theme.text}
              />

              <Text style={[styles.menuText, { color: theme.text }]}>
                Editar
              </Text>
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

                <Text style={[styles.menuText, { color: theme.text }]}>
                  Pausar anuncio
                </Text>
              </Pressable>
            )}

            {(selectedListing?.status === 'paused' || selectedListing?.status === 'draft') && (
              <Pressable style={styles.menuItem} onPress={handlePublish} disabled={isActing}>
                {publishMutation.isPending ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <MaterialIcons
                    name="play-arrow"
                    size={20}
                    color={theme.primary}
                  />
                )}

                <Text style={[styles.menuText, { color: theme.text }]}>
                  Publicar anuncio
                </Text>
              </Pressable>
            )}

          </View>
        </Pressable>
      </Modal>

    </View>
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
    alignSelf: 'stretch',
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },

  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
  },

  logo: {
    fontSize: 27,
    fontWeight: '800',
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },

  list: {
    paddingHorizontal: Spacing.three,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    marginBottom:20,

  },

  menu: {
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
    padding: Spacing.four,
    gap: Spacing.two,
  },

  menuTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },

  menuError: {
    fontSize: 13,
    marginBottom: Spacing.one,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: 14,
  },

  menuText: {
    fontSize: 16,
  },
});
