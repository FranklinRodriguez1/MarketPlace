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

import { Button } from '@/components/ui/button';
import { BorderRadius, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Step2Pricing } from '../create/components/Step2Pricing';
import { useCategories } from '../create/hooks/use-categories';
import { editListingSchema, type EditListingForm } from './schemas/edit-listing.schema';
import { useListing, useUpdateListing } from './hooks/use-edit-listing';

interface EditListingScreenProps {
  id: string;
}

export function EditListingScreen({ id }: EditListingScreenProps) {
  const theme = useTheme();
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
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError || !listing) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <MaterialIcons name="error-outline" size={40} color={theme.textSecondary} />
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>No se pudo cargar el anuncio.</Text>
        <Button label="Reintentar" variant="primary" onPress={() => void refetch()} />
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.flexCentered, { backgroundColor: theme.background }]}
      >
        <View style={styles.content}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.primary }]}> ‹ </Text>
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.primary }]}>Editar anuncio</Text>

          <View style={styles.headerButton} />
        </View>

        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>

          {/* CATEGORÍA (solo lectura) */}
          {categoryName && (
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Category</Text>
              <View
                style={[
                  styles.readOnlyChip,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.readOnlyChipText, { color: theme.text }]}>{categoryName}</Text>
              </View>
              <Text style={[styles.helper, { color: theme.textSecondary }]}>
                La categoría no se puede modificar una vez creado el anuncio.
              </Text>
            </View>
          )}

          {/* TÍTULO */}
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
                    style={[
                      styles.input,
                      { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text },
                      fieldState.error && { borderColor: theme.danger },
                    ]}
                  />
                  {fieldState.error && (
                    <Text style={[styles.errorHelper, { color: theme.danger }]}>{fieldState.error.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          {/* DESCRIPCIÓN */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Description</Text>

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
                      { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text },
                      fieldState.error && { borderColor: theme.danger },
                    ]}
                  />
                  {fieldState.error && (
                    <Text style={[styles.errorHelper, { color: theme.danger }]}>{fieldState.error.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          {/* PRICING (reutiliza el paso 2 del flujo de creación) */}
          <Step2Pricing />

          {errors.pricing && (
            <Text style={[styles.errorHelper, { color: theme.danger }]}>Revisa el precio ingresado.</Text>
          )}

          {updateMutation.isError && (
            <Text style={[styles.errorHelper, { color: theme.danger }]}>
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : 'No se pudo guardar el anuncio.'}
            </Text>
          )}

          <Button
            label="Guardar cambios"
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            loading={updateMutation.isPending}
            disabled={updateMutation.isPending}
            style={styles.saveButton}
          />

        </ScrollView>
        </View>
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

  flexCentered: {
    flex: 1,
    alignItems: 'center',
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },

  errorText: {
    textAlign: 'center',
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
    borderRadius: BorderRadius.input,
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
    borderRadius: BorderRadius.input,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  readOnlyChipText: {
    fontWeight: '600',
  },

  saveButton: {
    marginTop: 8,
  },
});
