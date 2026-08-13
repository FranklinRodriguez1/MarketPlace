import { useEffect } from 'react';
import {
  View,
  Text,
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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#075985" />
      </View>
    );
  }

  if (isError || !listing) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={40} color="#94A3B8" />
        <Text style={styles.errorText}>No se pudo cargar el anuncio.</Text>
        <Pressable style={styles.retryButton} onPress={() => void refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}> ‹ </Text>
          </Pressable>

          <Text style={styles.headerTitle}>Editar anuncio</Text>

          <View style={styles.headerButton} />
        </View>

        <ScrollView contentContainerStyle={styles.container}>

          {/* CATEGORÍA (solo lectura) */}
          {categoryName && (
            <View style={styles.section}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.readOnlyChip}>
                <Text style={styles.readOnlyChipText}>{categoryName}</Text>
              </View>
              <Text style={styles.helper}>
                La categoría no se puede modificar una vez creado el anuncio.
              </Text>
            </View>
          )}

          {/* TÍTULO */}
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
                    style={[styles.input, fieldState.error && styles.inputError]}
                  />
                  {fieldState.error && (
                    <Text style={styles.errorHelper}>{fieldState.error.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          {/* DESCRIPCIÓN */}
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
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    style={[styles.input, styles.textArea, fieldState.error && styles.inputError]}
                  />
                  {fieldState.error && (
                    <Text style={styles.errorHelper}>{fieldState.error.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          {/* PRICING (reutiliza el paso 2 del flujo de creación) */}
          <Step2Pricing />

          {errors.pricing && (
            <Text style={styles.errorHelper}>Revisa el precio ingresado.</Text>
          )}

          {updateMutation.isError && (
            <Text style={styles.errorHelper}>
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : 'No se pudo guardar el anuncio.'}
            </Text>
          )}

          <Pressable
            style={[styles.saveButton, updateMutation.isPending && styles.saveButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            )}
          </Pressable>

        </ScrollView>
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
    color: '#64748B',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#075985',
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
    color: '#0369A1',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#075985',
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
    color: '#0F172A',
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },

  textArea: {
    minHeight: 120,
  },

  inputError: {
    borderColor: '#EF4444',
  },

  errorHelper: {
    color: '#EF4444',
    fontSize: 13,
  },

  helper: {
    color: '#64748B',
    fontSize: 13,
  },

  readOnlyChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  readOnlyChipText: {
    color: '#334155',
    fontWeight: '600',
  },

  saveButton: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: '#075985',
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
