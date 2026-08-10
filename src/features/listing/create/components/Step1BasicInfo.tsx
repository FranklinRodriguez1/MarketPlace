import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';

import type { CreateListingForm } from '../schemas/create-listing.schema';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function Step1BasicInfo() {
    const { control } = useFormContext<CreateListingForm>();
    const categories = [
        { id:"1", name:" Plomeria", icon: "water" },
        { id:"2", name:" Electricidad", icon: "power" },
        { id:"3", name:" Carpinteria", icon: "build" },
        { id:"4", name:" Pintura", icon: "palette" },
    ]
    return (
       <View>
        <Text>
            Basic Information
        </Text>
            <Text style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 16,
            }}>Select a category</Text>
         <FlatList
        data={categories}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <MaterialIcons name="plumbing" size={24} color="black" />

            <Text style={styles.name}>
              {item.name}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
        <View style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
        }}>
            <Text>Title</Text>
            <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (<>
                    <TextInput 
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Ej. Clases de ingles"
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 12,
                        borderRadius: 8,
                    }}
                    />
                    {fieldState.error && (
                        <Text>{fieldState.error.message}</Text>
                    )}
                </>
            )}
            />
            <Text>A descriptive title helps users find your service easily.</Text>
        </View>
        <View>
            <Text>Category</Text>
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
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 12,
                  borderRadius: 8,
                }}
              />

              {fieldState.error && (
                <Text>
                  {fieldState.error.message}
                </Text>
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
    fontSize: 20,
    marginBottom: 16,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },

  card: {
    width: "50%",
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "white",
  },

  icon: {
    fontSize: 32,
  },

  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "400",
  },
});