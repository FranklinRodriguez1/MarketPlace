import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { CreateListingForm } from '../schemas/create-listing.schema';

export function Step3LocationPhotos() {
  const theme = useTheme();
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

      <ScrollView contentContainerStyle={{ gap: 20, padding: 16, backgroundColor: theme.background }}>

        <View style={styles.container}>

          {/* LOCATION */}
          <View style={styles.section}>
            <Text style={[styles.title, { color: theme.text }]}>
              Location
            </Text>

            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Confirm your service location
            </Text>

            {/* MAPA */}
            <View style={styles.mapContainer}>
              <View style={[styles.mapPlaceholder, { backgroundColor: theme.backgroundElement }]}>
                <MaterialIcons
                  name="location-on"
                  size={42}
                  color={hasLocation ? theme.primary : theme.textSecondary}
                />

                <Text style={[styles.mapText, { color: theme.textSecondary }]}>
                  {hasLocation
                    ? `${latitude!.toFixed(5)}, ${longitude!.toFixed(5)}`
                    : 'No location set yet'}
                </Text>
              </View>
            </View>

            <Button
              label={hasLocation ? 'Update current location' : 'Use my current location'}
              onPress={() => void handleUseCurrentLocation()}
              loading={isLocating}
              variant="primary"
              style={styles.locateButton}
              icon={(color) => <MaterialIcons name="my-location" size={18} color={color} />}
            />

            {(locationError || errors.latitude || errors.longitude) && (
              <Text style={[styles.error, { color: theme.danger }]}>
                {locationError ?? errors.latitude?.message ?? errors.longitude?.message}
              </Text>
            )}

            <Text style={[styles.helper, { color: theme.textSecondary }]}>
              We use this to show your service to nearby customers.
            </Text>
          </View>

          {/* PHOTOS */}
          <View style={styles.section}>
            <Text style={[styles.title, { color: theme.text }]}>
              Photos
            </Text>

            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Add photos of your work to build more trust. (Optional)
            </Text>

            {/* ÁREA PARA AGREGAR FOTOS */}
            <Pressable style={[styles.uploadContainer, { borderColor: theme.border, backgroundColor: theme.background }]}>
              <View style={[styles.uploadIcon, { backgroundColor: theme.backgroundElement }]}>
                <MaterialIcons
                  name="add-a-photo"
                  size={32}
                  color={theme.textSecondary}
                />
              </View>

              <Text style={[styles.uploadTitle, { color: theme.text }]}>
                Add photos
              </Text>

              <Text style={[styles.uploadDescription, { color: theme.textSecondary }]}>
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
