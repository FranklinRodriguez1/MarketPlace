import { useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { translateFieldError } from '@/i18n/translate-field-error';

import { Step2Pricing } from '../create/components/Step2Pricing';
import { useCategories } from '../create/hooks/use-categories';
import { editListingSchema, type EditListingForm } from './schemas/edit-listing.schema';
import { useListing, useUpdateListing } from './hooks/use-edit-listing';

interface EditListingScreenProps {
  id: string;
}

export function EditListingScreen({ id }: EditListingScreenProps) {
  const { data: listing, isLoading, isError, refetch } = useListing(id);
  const { data: categories } = useCategories();
  const updateMutation = useUpdateListing(id);
  const theme = useTheme();
  const { t } = useTranslation();

  const methods = useForm<EditListingForm>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: '',
      description: '',
      pricing: { model: 'fixed', price: { amountMinor: 0, currency: 'COP' } },
    },
  });

  const { control, handleSubmit, reset, formState: { errors } } = methods;

  // El formulario arranca vacío porque el listing todavía no llegó del
  // backend; en cuanto llega lo usamos para inicializar los campos.
  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        description: listing.description,
        pricing: listing.pricing,
      });
    }
  }, [listing, reset]);

  const categoryName = categories?.find((category) => category.id === listing?.categoryId)?.name;

  const onSubmit = async (data: EditListingForm): Promise<void> => {
    try {
      await updateMutation.mutateAsync(data);
      router.back();
    } catch {
      // el error se muestra abajo vía updateMutation.error
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (isError || !listing) {
    return (
      <ThemedView style={styles.centered}>
        <MaterialIcons name="error-outline" size={40} color={theme.textSecondary} />
        <ThemedText themeColor="textSecondary" style={styles.errorText}>{t('editListing.loadError')}</ThemedText>
        <Pressable style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => void refetch()}>
          <ThemedText style={styles.retryButtonText}>{t('common.retry')}</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ThemedView style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <ThemedText themeColor="primary" style={styles.headerButtonText}> ‹ </ThemedText>
            </Pressable>

            <ThemedText themeColor="primary" style={styles.headerTitle}>{t('editListing.headerTitle')}</ThemedText>

            <View style={styles.headerButton} />
          </View>

          <ScrollView contentContainerStyle={styles.container}>

            {/* CATEGORÍA (solo lectura) */}
            {categoryName && (
              <View style={styles.section}>
                <ThemedText style={styles.label}>{t('editListing.categoryLabel')}</ThemedText>
                <View style={[styles.readOnlyChip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText style={styles.readOnlyChipText}>{categoryName}</ThemedText>
                </View>
                <ThemedText themeColor="textSecondary" style={styles.helper}>
                  {t('editListing.categoryHelper')}
                </ThemedText>
              </View>
            )}

            {/* TÍTULO */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>{t('editListing.titleLabel')}</ThemedText>

              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      style={[
                        styles.input,
                        { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
                        fieldState.error && { borderColor: theme.danger },
                      ]}
                    />
                    {fieldState.error && (
                      <ThemedText themeColor="danger" style={styles.errorHelper}>{translateFieldError(t, fieldState.error.message)}</ThemedText>
                    )}
                  </>
                )}
              />
            </View>

            {/* DESCRIPCIÓN */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>{t('editListing.descriptionLabel')}</ThemedText>

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      style={[
                        styles.input,
                        styles.textArea,
                        { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
                        fieldState.error && { borderColor: theme.danger },
                      ]}
                    />
                    {fieldState.error && (
                      <ThemedText themeColor="danger" style={styles.errorHelper}>{translateFieldError(t, fieldState.error.message)}</ThemedText>
                    )}
                  </>
                )}
              />
            </View>

            {/* PRICING (reutiliza el paso 2 del flujo de creación) */}
            <Step2Pricing />

            {errors.pricing && (
              <ThemedText themeColor="danger" style={styles.errorHelper}>{t('editListing.pricingError')}</ThemedText>
            )}

            {updateMutation.isError && (
              <ThemedText themeColor="danger" style={styles.errorHelper}>
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : t('editListing.saveError')}
              </ThemedText>
            )}

            <Pressable
              style={[styles.saveButton, { backgroundColor: theme.primary }, updateMutation.isPending && styles.saveButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.saveButtonText}>{t('editListing.saveButton')}</ThemedText>
              )}
            </Pressable>

          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },

  errorText: {
    textAlign: 'center',
  },

  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 16,
  },

  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerButtonText: {
    fontSize: 28,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  container: {
    padding: 16,
    gap: 20,
    paddingBottom: 60,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },

  textArea: {
    minHeight: 120,
  },

  errorHelper: {
    fontSize: 13,
  },

  helper: {
    fontSize: 13,
  },

  readOnlyChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  readOnlyChipText: {
    fontWeight: '600',
  },

  saveButton: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
