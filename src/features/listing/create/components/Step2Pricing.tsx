import { View, Text, Pressable, TextInput } from 'react-native';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import type { CreateListingForm } from '../schemas/create-listing.schema';

export function Step2Pricing() {
 const { control, setValue } =
  useFormContext<CreateListingForm>();

const pricing = useWatch({
  control,
  name: 'pricing',
});
  const model = pricing.model;

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
      <Text>Prices</Text>

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        How do you want to charge?
      </Text>

      <Text>
        You can select how you want to charge for this service.
        You will be able to adjust the amounts in the next step.
      </Text>

      <View style={{ gap: 12 }}>

        {/* ========================= */}
        {/* FIXED */}
        {/* ========================= */}
        <View
          style={{
            backgroundColor:
              model === 'fixed' ? '#E0F2FE' : '#FFF',

            borderWidth: 1,

            borderColor:
              model === 'fixed'
                ? '#0284C7'
                : '#E5E7EB',

            padding: 16,
            borderRadius: 8,
          }}
        >
          {/* SOLO ESTA PARTE ES PRESSABLE */}
          <Pressable onPress={selectFixed}>
            <Text>
              {model === 'fixed' ? '●' : '○'} Fixed price
            </Text>

            <Text>
              A fixed amount for the entire job, ideal for
              well-defined tasks.
            </Text>
          </Pressable>

          {/* INPUT FUERA DEL PRESSABLE */}
          {model === 'fixed' && (
            <View
              style={{
                gap: 8,
                marginTop: 16,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>
                Price
              </Text>

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
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: '#fff',
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
          )}
        </View>

        {/* ========================= */}
        {/* HOURLY */}
        {/* ========================= */}
        <View
          style={{
            backgroundColor:
              model === 'hourly' ? '#E0F2FE' : '#FFF',

            borderWidth: 1,

            borderColor:
              model === 'hourly'
                ? '#0284C7'
                : '#E5E7EB',

            padding: 16,
            borderRadius: 8,
          }}
        >
          {/* SOLO EL ENCABEZADO ES PRESSABLE */}
          <Pressable onPress={selectHourly}>
            <Text>
              {model === 'hourly' ? '●' : '○'} Per hour
            </Text>

            <Text>
              You charge a fee for each hour of work performed.
            </Text>
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
                <Text style={{ fontWeight: 'bold' }}>
                  Hourly rate
                </Text>

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
                        style={{
                          borderWidth: 1,
                          borderColor: '#ccc',
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: '#fff',
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

              {/* HORAS MÍNIMAS */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>
                  Minimum hours
                </Text>

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
                        style={{
                          borderWidth: 1,
                          borderColor: '#ccc',
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: '#fff',
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
          )}
        </View>

        {/* ========================= */}
        {/* QUOTE */}
        {/* ========================= */}
        <View
          style={{
            backgroundColor:
              model === 'quote' ? '#E0F2FE' : '#FFF',

            borderWidth: 1,

            borderColor:
              model === 'quote'
                ? '#0284C7'
                : '#E5E7EB',

            padding: 16,
            borderRadius: 8,
          }}
        >
          {/* SOLO ESTA PARTE ES PRESSABLE */}
          <Pressable onPress={selectQuote}>
            <Text>
              {model === 'quote' ? '●' : '○'} A budget
            </Text>

            <Text>
              You assess the work on-site before giving a
              final price.
            </Text>
          </Pressable>

          {model === 'quote' && (
            <Text style={{ marginTop: 16 }}>
              The customer can request a quote before the
              final price is agreed.
            </Text>
          )}
        </View>

      </View>
    </View>
  );
}