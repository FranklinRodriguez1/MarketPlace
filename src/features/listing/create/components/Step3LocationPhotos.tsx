import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { useFormContext } from 'react-hook-form';

import type { CreateListingForm } from '../schemas/create-listing.schema';

export function Step3LocationPhotos() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

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
        setLocationError('Location permission was denied.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setValue('latitude', position.coords.latitude, { shouldValidate: true });
      setValue('longitude', position.coords.longitude, { shouldValidate: true });
    } catch {
      setLocationError('Could not get your location. Try again.');
    } finally {
      setIsLocating(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >

      <ScrollView contentContainerStyle={{ gap: 20, padding: 16 }}>

        <View style={styles.container}>

          {/* LOCATION */}
          <View style={styles.section}>
            <Text style={styles.title}>
              Location
            </Text>

            <Text style={styles.description}>
              Confirm your service location
            </Text>

            {/* MAPA */}
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <MaterialIcons
                  name="location-on"
                  size={42}
                  color={hasLocation ? '#0284C7' : '#94A3B8'}
                />

                <Text style={styles.mapText}>
                  {hasLocation
                    ? `${latitude!.toFixed(5)}, ${longitude!.toFixed(5)}`
                    : 'No location set yet'}
                </Text>
              </View>
            </View>

            <Pressable
              style={[styles.locateButton, isLocating && styles.locateButtonDisabled]}
              onPress={() => void handleUseCurrentLocation()}
              disabled={isLocating}
            >
              {isLocating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="my-location" size={18} color="#FFFFFF" />
                  <Text style={styles.locateButtonText}>
                    {hasLocation ? 'Update current location' : 'Use my current location'}
                  </Text>
                </>
              )}
            </Pressable>

            {(locationError || errors.latitude || errors.longitude) && (
              <Text style={styles.error}>
                {locationError ?? errors.latitude?.message ?? errors.longitude?.message}
              </Text>
            )}

            <Text style={styles.helper}>
              We use this to show your service to nearby customers.
            </Text>
          </View>

          {/* PHOTOS */}
          <View style={styles.section}>
            <Text style={styles.title}>
              Photos
            </Text>

            <Text style={styles.description}>
              Add photos of your work to build more trust. (Optional)
            </Text>

            {/* ÁREA PARA AGREGAR FOTOS */}
            <Pressable style={styles.uploadContainer}>
              <View style={styles.uploadIcon}>
                <MaterialIcons
                  name="add-a-photo"
                  size={32}
                  color="#64748B"
                />
              </View>

              <Text style={styles.uploadTitle}>
                Add photos
              </Text>

              <Text style={styles.uploadDescription}>
                Upload photos of your work
              </Text>
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
    color: '#0F172A',
  },

  description: {
    fontSize: 14,
    color: '#64748B',
  },

  mapContainer: {
    marginTop: 8,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
  },

  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapText: {
    marginTop: 8,
    color: '#475569',
    fontWeight: '600',
  },

  helper: {
    fontSize: 13,
    color: '#64748B',
  },

  locateButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
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
    color: '#EF4444',
    fontSize: 13,
  },

  uploadContainer: {
    marginTop: 8,
    height: 220,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },

  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },

  uploadDescription: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
});
