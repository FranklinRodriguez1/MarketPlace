import { View, Text, Pressable, StyleSheet, ScrollView,  KeyboardAvoidingView, Platform  } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function Step3LocationPhotos() {
  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  style={{ flex: 1 }}
>

    <ScrollView contentContainerStyle={{ gap: 20, padding: 16,  }}>

    <View style={styles.container}>

      {/* LOCATION */}
      <View style={styles.section}>
        <Text style={styles.title}>
          Location
        </Text>

        <Text style={styles.description}>
          Confirm your service location on the map
        </Text>

        {/* MAPA */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <MaterialIcons
              name="location-on"
              size={42}
              color="#0284C7"
            />

            <Text style={styles.mapText}>
              Service location
            </Text>
          </View>
        </View>

        <Text style={styles.helper}>
          Drag the pin to adjust the exact location
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