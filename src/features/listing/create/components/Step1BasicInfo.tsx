import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Controller, useFormContext } from 'react-hook-form';

import type { CreateListingForm } from '../schemas/create-listing.schema';

type Category = {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const categories: Category[] = [
  {
    id: '1',
    name: 'Plomería',
    icon: 'plumbing',
  },
  {
    id: '2',
    name: 'Electricidad',
    icon: 'power',
  },
  {
    id: '3',
    name: 'Clases de guitarra',
    icon: 'music-note',
  },
  {
    id: '4',
    name: 'Clases de inglés',
    icon: 'language',
  },
  {
    id: '5',
    name: 'Limpieza del hogar',
    icon: 'cleaning-services',
  },
  {
    id: '6',
    name: 'Jardinería',
    icon: 'yard',
  },
  {
    id: '7',
    name: 'Pintura',
    icon: 'format-paint',
  },
  {
    id: '8',
    name: 'Carpintería',
    icon: 'construction',
  },
  {
    id: '9',
    name: 'Cerrajería',
    icon: 'lock',
  },
  {
    id: '10',
    name: 'Mudanzas',
    icon: 'local-shipping',
  },
  {
    id: '11',
    name: 'Fotografía',
    icon: 'photo-camera',
  },
  {
    id: '12',
    name: 'Diseño gráfico',
    icon: 'design-services',
  },
  {
    id: '13',
    name: 'Peluquería',
    icon: 'content-cut',
  },
  {
    id: '14',
    name: 'Manicure',
    icon: 'spa',
  },
  {
    id: '15',
    name: 'Masajes',
    icon: 'self-improvement',
  },
  {
    id: '16',
    name: 'Entrenamiento personal',
    icon: 'fitness-center',
  },
];

export function Step1BasicInfo() {
  const { control } = useFormContext<CreateListingForm>();

  const [search, setSearch] = useState('');

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase().trim()),
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <FlatList
        data={filteredCategories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>

            {/* BASIC INFORMATION */}
            <Text style={styles.stepLabel}>
              Basic Information
            </Text>

            {/* TITLE */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Title
              </Text>

              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Ej. Clases de inglés"
                      style={[
                        styles.input,
                        fieldState.error && styles.inputError,
                      ]}
                    />

                    {fieldState.error && (
                      <Text style={styles.error}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Text style={styles.helper}>
                A descriptive title helps users find your service easily.
              </Text>
            </View>

            {/* CATEGORY */}
            <View style={styles.categoryHeader}>
              <Text style={styles.title}>
                Select a category
              </Text>

              <Text style={styles.description}>
                Choose the category that best describes your service.
              </Text>

              {/* SEARCH */}
              <View style={styles.searchContainer}>
                <MaterialIcons
                  name="search"
                  size={22}
                  color="#64748B"
                />

                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Buscar categoría..."
                  placeholderTextColor="#94A3B8"
                  style={styles.searchInput}
                />
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Controller
            control={control}
            name="categoryId"
            render={({ field, fieldState }) => {
              const selected = field.value === item.id;

              return (
                <Pressable
                  onPress={() => field.onChange(item.id)}
                  style={[
                    styles.card,
                    selected && styles.cardSelected,
                    fieldState.error && styles.cardError,
                  ]}
                >
                  {/* ICON */}
                  <View
                    style={[
                      styles.iconContainer,
                      selected && styles.iconContainerSelected,
                    ]}
                  >
                    <MaterialIcons
                      name={item.icon}
                      size={28}
                      color={selected ? '#0284C7' : '#334155'}
                    />
                  </View>

                  {/* NAME */}
                  <Text
                    style={[
                      styles.name,
                      selected && styles.nameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>

                  {/* CHECK */}
                  {selected && (
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#0284C7"
                      style={styles.check}
                    />
                  )}
                </Pressable>
              );
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons
              name="search-off"
              size={40}
              color="#94A3B8"
            />

            <Text style={styles.emptyText}>
              No se encontraron categorías.
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
  },

  header: {
    gap: 20,
  },

  stepLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  section: {
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFF',
    fontSize: 16,
  },

  inputError: {
    borderColor: '#EF4444',
  },

  helper: {
    color: '#64748B',
    fontSize: 13,
  },

  categoryHeader: {
    gap: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  description: {
    color: '#64748B',
    fontSize: 14,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    marginTop: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  row: {
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },

  card: {
    flex: 1,
    minHeight: 130,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  cardSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
    borderWidth: 2,
  },

  cardError: {
    borderColor: '#EF4444',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },

  iconContainerSelected: {
    backgroundColor: '#BAE6FD',
  },

  name: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#334155',
  },

  nameSelected: {
    color: '#0369A1',
    fontWeight: '700',
  },

  check: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },

  emptyText: {
    color: '#64748B',
  },

  error: {
    color: '#EF4444',
    fontSize: 13,
  },
});