import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import type { CreateListingForm } from '../schemas/create-listing.schema';

export function Step1BasicInfo() {
    const theme = useTheme();
    const { control } = useFormContext<CreateListingForm>();
    const categories = [
        { id:"1", name:" Plomeria", icon: "water" },
        { id:"2", name:" Electricidad", icon: "power" },
        { id:"3", name:" Carpinteria", icon: "build" },
        { id:"4", name:" Pintura", icon: "palette" },
    ]
    return (
       <View>
        <ThemedText themeColor="textSecondary">
            Basic Information
        </ThemedText>
            <ThemedText style={styles.title}>Select a category</ThemedText>
         <FlatList
        data={categories}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <MaterialIcons name="plumbing" size={24} color={theme.primary} />

            <ThemedText style={styles.name}>
              {item.name}
            </ThemedText>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
        <View style={[styles.field, { backgroundColor: theme.surface }]}>
            <ThemedText type="smallBold">Title</ThemedText>
            <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (<>
                    <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Ej. Clases de ingles"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                    />
                    {fieldState.error && (
                        <ThemedText type="small" themeColor="danger">{fieldState.error.message}</ThemedText>
                    )}
                </>
            )}
            />
            <ThemedText type="small" themeColor="textSecondary">A descriptive title helps users find your service easily.</ThemedText>
        </View>
        <View>
            <ThemedText type="smallBold">Category</ThemedText>
            <Controller
          control={control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Escribe una categoría"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              />

              {fieldState.error && (
                <ThemedText type="small" themeColor="danger">
                  {fieldState.error.message}
                </ThemedText>
              )}
            </>
          )}
        />
      </View>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },

  card: {
    width: "48%",
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
  },

  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "400",
  },

  field: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
});
