import { useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { translateFieldError } from '@/i18n/translate-field-error';

import { Button } from '@/components/ui/button';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { darkenColor } from '@/utils/color';

import type { CreateListingForm } from '../schemas/create-listing.schema';

export function Step3LocationPhotos() {
  const theme = useTheme();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateListingForm>();
  const { t } = useTranslation();

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const hasLocation = latitude !== undefined && longitude !== undefined;

  async function handleUseCurrentLocation(): Promise<void> {
    setLocationError(null);
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('createListing.step3.locationPermissionDenied'));
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setValue('latitude', position.coords.latitude, { shouldValidate: true });
      setValue('longitude', position.coords.longitude, { shouldValidate: true });
    } catch {
      setLocationError(t('createListing.step3.locationError'));
    } finally {
      setIsLocating(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >

      <ScrollView contentContainerStyle={{ gap: 20, padding: 16, backgroundColor: theme.background }}>

        <View style={styles.container}>

          {/* LOCATION */}
          <View style={styles.section}>
            <ThemedText style={styles.title}>
              {t('createListing.step3.locationTitle')}
            </ThemedText>

            <ThemedText themeColor="textSecondary" style={styles.description}>
              {t('createListing.step3.locationDescription')}
            </ThemedText>

            {/* MAPA */}
            <View style={styles.mapContainer}>
              <View style={[styles.mapPlaceholder, { backgroundColor: theme.backgroundElement }]}>
                <MaterialIcons
                  name="location-on"
                  size={42}
                  color={hasLocation ? theme.primary : theme.textSecondary}
                />

                <ThemedText themeColor="textSecondary" style={styles.mapText}>
                  {hasLocation
                    ? `${latitude!.toFixed(5)}, ${longitude!.toFixed(5)}`
                    : t('createListing.step3.noLocationSet')}
                </ThemedText>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.locateButton,
                { backgroundColor: pressed && !isLocating ? '#0369A1' : theme.primary },
                isLocating && styles.locateButtonDisabled,
              ]}
              onPress={() => void handleUseCurrentLocation()}
              disabled={isLocating}
            >
              {isLocating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="my-location" size={18} color="#FFFFFF" />
                  <ThemedText style={styles.locateButtonText}>
                    {hasLocation ? t('createListing.step3.updateCurrentLocation') : t('createListing.step3.useCurrentLocation')}
                  </ThemedText>
                </>
              )}
            </Pressable>

            {(locationError || errors.latitude || errors.longitude) && (
              <ThemedText themeColor="danger" style={styles.error}>
                {locationError ?? translateFieldError(t, errors.latitude?.message) ?? translateFieldError(t, errors.longitude?.message)}
              </ThemedText>
            )}

            <ThemedText themeColor="textSecondary" style={styles.helper}>
              {t('createListing.step3.locationHelper')}
            </ThemedText>
          </View>

          {/* PHOTOS */}
          <View style={styles.section}>
            <ThemedText style={styles.title}>
              {t('createListing.step3.photosTitle')}
            </ThemedText>

            <ThemedText themeColor="textSecondary" style={styles.description}>
              {t('createListing.step3.photosDescription')}
            </ThemedText>

            {/* ÁREA PARA AGREGAR FOTOS */}
            <Pressable
              style={({ pressed }) => [
                styles.uploadContainer,
                {
                  borderColor: theme.border,
                  backgroundColor: pressed ? darkenColor(theme.backgroundElement) : theme.backgroundElement,
                },
              ]}
            >
              <View style={[styles.uploadIcon, { backgroundColor: theme.background }]}>
                <MaterialIcons
                  name="add-a-photo"
                  size={32}
                  color={theme.textSecondary}
                />
              </View>

              <ThemedText style={styles.uploadTitle}>
                {t('createListing.step3.addPhotos')}
              </ThemedText>

              <ThemedText themeColor="textSecondary" style={styles.uploadDescription}>
                {t('createListing.step3.uploadPhotosDescription')}
              </ThemedText>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 28,
  },

  section: {
    gap: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 14,
  },

  mapContainer: {
    marginTop: 8,
    height: 220,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },

  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapText: {
    marginTop: 8,
    fontWeight: '600',
  },

  helper: {
    fontSize: 13,
  },

  locateButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    paddingVertical: 12,
  },

  locateButtonDisabled: {
    opacity: 0.7,
  },

  locateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },

  error: {
    fontSize: 13,
  },

  uploadContainer: {
    marginTop: 8,
    height: 220,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  uploadDescription: {
    marginTop: 4,
    fontSize: 13,
  },
});
