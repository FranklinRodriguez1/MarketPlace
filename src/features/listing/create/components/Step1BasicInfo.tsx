import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Controller, useFormContext } from "react-hook-form";

import {
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_ICON,
} from "@/constants/category-icons";

import { useCategories } from "../hooks/use-categories";
import type { CreateListingForm } from "../schemas/create-listing.schema";

const ACCENTED_CHARACTERS: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ü: "u",
  ñ: "n",
};

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[áéíóúüñ]/g,
      (accented) => ACCENTED_CHARACTERS[accented] ?? accented,
    );
}

export function Step1BasicInfo() {
  const { control } = useFormContext<CreateListingForm>();

  const [search, setSearch] = useState("");

  const { data: categories, isPending, isError, refetch } = useCategories();

  const filteredCategories = (categories ?? []).filter((category) =>
    normalizeForSearch(category.name).includes(normalizeForSearch(search)),
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            <Text style={styles.stepLabel}>Basic Information</Text>

            {/* TITLE */}
            <View style={styles.section}>
              <Text style={styles.label}>Title</Text>

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

            {/* DESCRIPTION */}
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Describe tu servicio..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
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
                Describe qué servicio ofreces, qué incluye y cualquier
                información importante para el cliente.
              </Text>
            </View>
            {/* CATEGORY */}
            <View style={styles.categoryHeader}>
              <Text style={styles.title}>Select a category</Text>

              <Text style={styles.description}>
                Choose the category that best describes your service.
              </Text>

              {/* SEARCH */}
              <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={22} color="#64748B" />

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
                      name={CATEGORY_ICONS[item.slug] ?? DEFAULT_CATEGORY_ICON}
                      size={28}
                      color={selected ? "#0284C7" : "#334155"}
                    />
                  </View>

                  {/* NAME */}
                  <Text style={[styles.name, selected && styles.nameSelected]}>
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
          isPending ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color="#0284C7" />
              <Text style={styles.emptyText}>Cargando categorías...</Text>
            </View>
          ) : isError ? (
            <View style={styles.empty}>
              <MaterialIcons name="error-outline" size={40} color="#EF4444" />
              <Text style={styles.emptyText}>
                No se pudieron cargar las categorías.
              </Text>
              <Pressable onPress={() => refetch()}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.empty}>
              <MaterialIcons name="search-off" size={40} color="#94A3B8" />

              <Text style={styles.emptyText}>
                No se encontraron categorías.
              </Text>
            </View>
          )
        }
      />
    </KeyboardAvoidingView>
  );
}

import { useState } from "react";

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
    color: "#64748B",
  },

  section: {
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#FFF",
    fontSize: 16,
  },

  inputError: {
    borderColor: "#EF4444",
  },

  helper: {
    color: "#64748B",
    fontSize: 13,
  },

  categoryHeader: {
    gap: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  description: {
    color: "#64748B",
    fontSize: 14,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    marginTop: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  row: {
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },

  card: {
    flex: 1,
    minHeight: 130,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  cardSelected: {
    backgroundColor: "#E0F2FE",
    borderColor: "#0284C7",
    borderWidth: 2,
  },

  cardError: {
    borderColor: "#EF4444",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },

  iconContainerSelected: {
    backgroundColor: "#BAE6FD",
  },

  name: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#334155",
  },

  nameSelected: {
    color: "#0369A1",
    fontWeight: "700",
  },

  check: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 10,
  },

  emptyText: {
    color: "#64748B",
  },

  retryText: {
    color: "#0284C7",
    fontWeight: "600",
    marginTop: 4,
  },

  error: {
    color: "#EF4444",
    fontSize: 13,
  },
});
