import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import {
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_ICON,
} from "@/constants/category-icons";
import { translateFieldError } from "@/i18n/translate-field-error";

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
  const { t } = useTranslation();

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
            <ThemedText themeColor="textSecondary" style={styles.stepLabel}>{t('createListing.step1.basicInformation')}</ThemedText>

            {/* TITLE */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>{t('createListing.step1.titleLabel')}</ThemedText>

              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder={t('createListing.step1.titlePlaceholder')}
                      placeholderTextColor={theme.textSecondary}
                      style={[
                        styles.input,
                        { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
                        fieldState.error && { borderColor: theme.danger },
                      ]}
                    />

                    {fieldState.error && (
                      <ThemedText themeColor="danger" style={styles.error}>
                        {translateFieldError(t, fieldState.error.message)}
                      </ThemedText>
                    )}
                  </>
                )}
              />

              <ThemedText themeColor="textSecondary" style={styles.helper}>
                {t('createListing.step1.titleHelper')}
              </ThemedText>
            </View>

            {/* DESCRIPTION */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>{t('createListing.step1.descriptionLabel')}</ThemedText>

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder={t('createListing.step1.descriptionPlaceholder')}
                      placeholderTextColor={theme.textSecondary}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      style={[
                        styles.input,
                        { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
                        fieldState.error && { borderColor: theme.danger },
                      ]}
                    />

                    {fieldState.error && (
                      <ThemedText themeColor="danger" style={styles.error}>
                        {translateFieldError(t, fieldState.error.message)}
                      </ThemedText>
                    )}
                  </>
                )}
              />

              <ThemedText themeColor="textSecondary" style={styles.helper}>
                {t('createListing.step1.descriptionHelper')}
              </ThemedText>
            </View>
            {/* CATEGORY */}
            <View style={styles.categoryHeader}>
              <ThemedText style={styles.title}>{t('createListing.step1.selectCategory')}</ThemedText>

              <ThemedText themeColor="textSecondary" style={styles.description}>
                {t('createListing.step1.selectCategoryDescription')}
              </ThemedText>

              {/* SEARCH */}
              <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <MaterialIcons name="search" size={22} color={theme.textSecondary} />

                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t('createListing.step1.searchPlaceholder')}
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
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    selected && { backgroundColor: theme.backgroundSelected, borderColor: theme.primary, borderWidth: 2 },
                    fieldState.error && { borderColor: theme.danger },
                  ]}
                >
                  {/* ICON */}
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: theme.backgroundElement },
                      selected && { backgroundColor: theme.backgroundSelected },
                    ]}
                  >
                    <MaterialIcons
                      name={CATEGORY_ICONS[item.slug] ?? DEFAULT_CATEGORY_ICON}
                      size={28}
                      color={selected ? theme.primary : theme.text}
                    />
                  </View>

                  {/* NAME */}
                  <ThemedText
                    themeColor={selected ? "primary" : "text"}
                    style={[styles.name, selected && styles.nameSelected]}
                  >
                    {item.name}
                  </ThemedText>

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
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>{t('createListing.step1.loadingCategories')}</ThemedText>
            </View>
          ) : isError ? (
            <View style={styles.empty}>
              <MaterialIcons name="error-outline" size={40} color={theme.danger} />
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                {t('createListing.step1.loadErrorCategories')}
              </ThemedText>
              <Pressable onPress={() => refetch()}>
                <ThemedText themeColor="primary" style={styles.retryText}>{t('common.retry')}</ThemedText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.empty}>
              <MaterialIcons name="search-off" size={40} color={theme.textSecondary} />

              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                {t('createListing.step1.noCategoriesFound')}
              </ThemedText>
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
    borderRadius: 8,
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
    borderRadius: 8,
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
    borderRadius: 14,
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

  nameSelected: {
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
    textAlign: 'center',
  },

  retryText: {
    fontWeight: "600",
    marginTop: 4,
  },

  error: {
    fontSize: 13,
  },
});
