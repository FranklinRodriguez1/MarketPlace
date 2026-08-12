import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import {
  ListingCard,
  type Listing,
} from '@/components/ListingCard';

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    category: 'Plomería',
    title: 'Reparación de tuberías',
    location: 'Centro, Ciudad',
    price: 450,
    pricingType: 'fixed',
    status: 'published',
  },

  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
    category: 'Carpintería',
    title: 'Armado de muebles',
    location: 'Zona Norte',
    price: 200,
    pricingType: 'hourly',
    status: 'paused',
  },

  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1558904541-efa843a96f01',
    category: 'Jardinería',
    title: 'Mantenimiento de jardines',
    location: 'A domicilio',
    price: 350,
    pricingType: 'base',
    status: 'under_review',
  },
];

export default function MyListingsScreen() {
  const [selectedListing, setSelectedListing] =
    useState<Listing | null>(null);

  const handleMenuPress = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const closeMenu = () => {
    setSelectedListing(null);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable>
          <MaterialIcons
            name="close"
            size={24}
            color="#0369A1"
          />
        </Pressable>

        <Text style={styles.logo}>
          Cerca
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* TÍTULO */}
      <Text style={styles.heading}>
        Mis anuncios
      </Text>

      {/* LISTADO */}
      <FlatList
        data={MOCK_LISTINGS}
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
      <Pressable onPress={()=> router.push('/(provider)/listings/create')} style={styles.addButton}>
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
          <View style={styles.menu}>

            <Text style={styles.menuTitle}>
              {selectedListing?.title}
            </Text>

            <Pressable style={styles.menuItem}>
              <MaterialIcons
                name="visibility"
                size={20}
                color="#334155"
              />

              <Text style={styles.menuText}>
                Ver anuncio
              </Text>
            </Pressable>

            <Pressable style={styles.menuItem}>
              <MaterialIcons
                name="edit"
                size={20}
                color="#334155"
              />

              <Text style={styles.menuText}>
                Editar
              </Text>
            </Pressable>

            {selectedListing?.status === 'published' && (
              <Pressable  style={styles.menuItem}>
                <MaterialIcons
                  name="pause"
                  size={20}
                  color="#334155"
                />

                <Text style={styles.menuText}>
                  Pausar anuncio
                </Text>
              </Pressable>
            )}

            {selectedListing?.status === 'paused' && (
              <Pressable style={styles.menuItem}>
                <MaterialIcons
                  name="play-arrow"
                  size={20}
                  color="#15803D"
                />

                <Text style={styles.menuText}>
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
  container: {
    flex: 1,
    backgroundColor: '#FAFAF7',
  },

  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  logo: {
    fontSize: 27,
    fontWeight: '800',
    color: '#075985',
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
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
    backgroundColor: '#2874A6',
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
    backgroundColor: '#FFFFFF',
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

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },

  menuText: {
    fontSize: 16,
    color: '#334155',
  },
});