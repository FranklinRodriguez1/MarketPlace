import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import type { CreateListingForm } from '../schemas/create-listing.schema';

export function Step2Pricing() {
  const theme = useTheme();
 const { control, setValue } =
  useFormContext<CreateListingForm>();

const pricing = useWatch({
  control,
  name: 'pricing',
});
  const model = pricing.model;

  const inputStyle = { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text };

  const optionCardStyle = (selected: boolean) => ({
    backgroundColor: selected ? theme.backgroundSelected : theme.surface,
    borderWidth: 1,
    borderColor: selected ? theme.primary : theme.border,
    padding: 16,
    borderRadius: 12,
  });

  const selectFixed = () => {
    setValue(
      'pricing',
      {
        model: 'fixed',
        price: {
          amountMinor: 0,
          currency: 'COP',
        },
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const selectHourly = () => {
    setValue(
      'pricing',
      {
        model: 'hourly',
        hourlyRate: {
          amountMinor: 0,
          currency: 'COP',
        },
        minimumHours: 1,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const selectQuote = () => {
    setValue(
      'pricing',
      {
        model: 'quote',
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  return (
    <View style={{ gap: 20 }}>
      <ThemedText themeColor="textSecondary">Prices</ThemedText>

      <ThemedText style={styles.title}>
        How do you want to charge?
      </ThemedText>

      <ThemedText themeColor="textSecondary">
        You can select how you want to charge for this service.
        You will be able to adjust the amounts in the next step.
      </ThemedText>

      <View style={{ gap: 12 }}>

        {/* ========================= */}
        {/* FIXED */}
        {/* ========================= */}
        <View style={optionCardStyle(model === 'fixed')}>
          {/* SOLO ESTA PARTE ES PRESSABLE */}
          <Pressable onPress={selectFixed}>
            <ThemedText>
              {model === 'fixed' ? '●' : '○'} Fixed price
            </ThemedText>

            <ThemedText type="small" themeColor="textSecondary">
              A fixed amount for the entire job, ideal for
              well-defined tasks.
            </ThemedText>
          </Pressable>

          {/* INPUT FUERA DEL PRESSABLE */}
          {model === 'fixed' && (
            <View
              style={{
                gap: 8,
                marginTop: 16,
              }}
            >
              <ThemedText type="smallBold">
                Price
              </ThemedText>

              <Controller
                control={control}
                name="pricing.price.amountMinor"
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      value={String(field.value ?? '')}
                      onChangeText={(value) =>
                        field.onChange(
                          value === ''
                            ? 0
                            : Number(value)
                        )
                      }
                      keyboardType="numeric"
                      placeholder="50000"
                      placeholderTextColor={theme.textSecondary}
                      style={[styles.input, inputStyle]}
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
          )}
        </View>

        {/* ========================= */}
        {/* HOURLY */}
        {/* ========================= */}
        <View style={optionCardStyle(model === 'hourly')}>
          {/* SOLO EL ENCABEZADO ES PRESSABLE */}
          <Pressable onPress={selectHourly}>
            <ThemedText>
              {model === 'hourly' ? '●' : '○'} Per hour
            </ThemedText>

            <ThemedText type="small" themeColor="textSecondary">
              You charge a fee for each hour of work performed.
            </ThemedText>
          </Pressable>

          {/* INPUTS FUERA DEL PRESSABLE */}
          {model === 'hourly' && (
            <View
              style={{
                gap: 12,
                marginTop: 16,
              }}
            >
              {/* PRECIO POR HORA */}
              <View style={{ gap: 8 }}>
                <ThemedText type="smallBold">
                  Hourly rate
                </ThemedText>

                <Controller
                  control={control}
                  name="pricing.hourlyRate.amountMinor"
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        value={String(field.value ?? '')}
                        onChangeText={(value) =>
                          field.onChange(
                            value === ''
                              ? 0
                              : Number(value)
                          )
                        }
                        keyboardType="numeric"
                        placeholder="30000"
                        placeholderTextColor={theme.textSecondary}
                        style={[styles.input, inputStyle]}
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

              {/* HORAS MÍNIMAS */}
              <View style={{ gap: 8 }}>
                <ThemedText type="smallBold">
                  Minimum hours
                </ThemedText>

                <Controller
                  control={control}
                  name="pricing.minimumHours"
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        value={String(field.value ?? '')}
                        onChangeText={(value) =>
                          field.onChange(
                            value === ''
                              ? 0
                              : Number(value)
                          )
                        }
                        keyboardType="numeric"
                        placeholder="2"
                        placeholderTextColor={theme.textSecondary}
                        style={[styles.input, inputStyle]}
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
          )}
        </View>

        {/* ========================= */}
        {/* QUOTE */}
        {/* ========================= */}
        <View style={optionCardStyle(model === 'quote')}>
          {/* SOLO ESTA PARTE ES PRESSABLE */}
          <Pressable onPress={selectQuote}>
            <ThemedText>
              {model === 'quote' ? '●' : '○'} A budget
            </ThemedText>

            <ThemedText type="small" themeColor="textSecondary">
              You assess the work on-site before giving a
              final price.
            </ThemedText>
          </Pressable>

          {model === 'quote' && (
            <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: 16 }}>
              The customer can request a quote before the
              final price is agreed.
            </ThemedText>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
});
