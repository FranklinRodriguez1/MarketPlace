import { useState } from "react";
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
import { BorderRadius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

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
  const theme = useTheme();

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
            <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
              Basic Information
            </Text>

            {/* TITLE */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Title</Text>

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
                      placeholderTextColor={theme.textSecondary}
                      style={[
                        styles.input,
                        {
                          borderColor: fieldState.error
                            ? theme.danger
                            : theme.border,
                          backgroundColor: theme.surface,
                          color: theme.text,
                        },
                      ]}
                    />

                    {fieldState.error && (
                      <Text style={[styles.error, { color: theme.danger }]}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Text style={[styles.helper, { color: theme.textSecondary }]}>
                A descriptive title helps users find your service easily.
              </Text>
            </View>

            {/* DESCRIPTION */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>
                Description
              </Text>

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
                      placeholderTextColor={theme.textSecondary}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      style={[
                        styles.input,
                        {
                          borderColor: fieldState.error
                            ? theme.danger
                            : theme.border,
                          backgroundColor: theme.surface,
                          color: theme.text,
                        },
                      ]}
                    />

                    {fieldState.error && (
                      <Text style={[styles.error, { color: theme.danger }]}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Text style={[styles.helper, { color: theme.textSecondary }]}>
                Describe qué servicio ofreces, qué incluye y cualquier
                información importante para el cliente.
              </Text>
            </View>
            {/* CATEGORY */}
            <View style={styles.categoryHeader}>
              <Text style={[styles.title, { color: theme.text }]}>
                Select a category
              </Text>

              <Text style={[styles.description, { color: theme.textSecondary }]}>
                Choose the category that best describes your service.
              </Text>

              {/* SEARCH */}
              <View
                style={[
                  styles.searchContainer,
                  { borderColor: theme.border, backgroundColor: theme.surface },
                ]}
              >
                <MaterialIcons
                  name="search"
                  size={22}
                  color={theme.textSecondary}
                />

                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Buscar categoría..."
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.searchInput, { color: theme.text }]}
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
                    {
                      backgroundColor: selected
                        ? theme.backgroundSelected
                        : theme.surface,
                      borderColor: fieldState.error
                        ? theme.danger
                        : selected
                          ? theme.primary
                          : theme.border,
                      borderWidth: selected ? 2 : 1,
                    },
                  ]}
                >
                  {/* ICON */}
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: selected
                          ? theme.backgroundSelected
                          : theme.backgroundElement,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={CATEGORY_ICONS[item.slug] ?? DEFAULT_CATEGORY_ICON}
                      size={28}
                      color={selected ? theme.primary : theme.text}
                    />
                  </View>

                  {/* NAME */}
                  <Text
                    style={[
                      styles.name,
                      {
                        color: selected ? theme.primary : theme.text,
                        fontWeight: selected ? "700" : "500",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>

                  {/* CHECK */}
                  {selected && (
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={theme.primary}
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
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Cargando categorías...
              </Text>
            </View>
          ) : isError ? (
            <View style={styles.empty}>
              <MaterialIcons
                name="error-outline"
                size={40}
                color={theme.danger}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No se pudieron cargar las categorías.
              </Text>
              <Pressable onPress={() => refetch()}>
                <Text style={[styles.retryText, { color: theme.primary }]}>
                  Reintentar
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.empty}>
              <MaterialIcons
                name="search-off"
                size={40}
                color={theme.textSecondary}
              />

              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No se encontraron categorías.
              </Text>
            </View>
          )
        }
      />
    </KeyboardAvoidingView>
  );
}

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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: BorderRadius.input,
    fontSize: 16,
  },

  helper: {
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
    fontSize: 14,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: BorderRadius.input,
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
    borderWidth: 1,
    borderRadius: BorderRadius.card,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
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

  emptyText: {},

  retryText: {
    fontWeight: "600",
    marginTop: 4,
  },

  error: {
    fontSize: 13,
  },
});
