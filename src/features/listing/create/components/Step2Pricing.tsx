import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Controller,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import type { CreateListingForm } from '../schemas/create-listing.schema';

export function Step2Pricing() {
  const { control, setValue } =
    useFormContext<CreateListingForm>();

  const pricing = useWatch({
    control,
    name: 'pricing',
  });

  const model = pricing.model;

  // =========================
  // SELECCIONAR PRECIO FIJO
  // =========================

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

  // =========================
  // SELECCIONAR PRECIO POR HORA
  // =========================

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

  // =========================
  // SELECCIONAR COTIZACIÓN
  // =========================

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          gap: 20,
          padding: 16,
          paddingBottom: 40,
        }}
      >
        <View style={{ gap: 20 }}>
          {/* ========================= */}
          {/* TÍTULO */}
          {/* ========================= */}

          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 14,
                color: '#64748B',
              }}
            >
              Prices
            </Text>

            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#0F172A',
              }}
            >
              How do you want to charge?
            </Text>

            <Text
              style={{
                color: '#475569',
                lineHeight: 21,
              }}
            >
              You can select how you want to charge for this
              service. You will be able to adjust the amounts
              in the next step.
            </Text>
          </View>

          <View style={{ gap: 12 }}>

            {/* ========================= */}
            {/* FIXED */}
            {/* ========================= */}

            <View
              style={{
                backgroundColor:
                  model === 'fixed'
                    ? '#E0F2FE'
                    : '#FFFFFF',

                borderWidth: 1,

                borderColor:
                  model === 'fixed'
                    ? '#0284C7'
                    : '#E5E7EB',

                padding: 16,
                borderRadius: 8,
              }}
            >
              <Pressable onPress={selectFixed}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#0F172A',
                  }}
                >
                  {model === 'fixed' ? '●' : '○'} Fixed price
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: '#475569',
                    lineHeight: 20,
                  }}
                >
                  A fixed amount for the entire job, ideal for
                  well-defined tasks.
                </Text>
              </Pressable>

              {/* SOLO EXISTE SI MODEL === FIXED */}

              {pricing.model === 'fixed' && (
                <View
                  style={{
                    gap: 8,
                    marginTop: 16,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#0F172A',
                    }}
                  >
                    Price
                  </Text>

                  <Controller
                    control={control}
                    name="pricing.price.amountMinor"
                    render={({ field, fieldState }) => (
                      <>
                        <TextInput
                          value={
                            field.value === 0
                              ? ''
                              : String(field.value)
                          }
                          onChangeText={(value) => {
                            const numericValue =
                              value === ''
                                ? 0
                                : Number(value);

                            field.onChange(numericValue);
                          }}
                          keyboardType="numeric"
                          placeholder="50000"
                          style={{
                            borderWidth: 1,
                            borderColor:
                              fieldState.error
                                ? '#DC2626'
                                : '#CBD5E1',
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor: '#FFFFFF',
                          }}
                        />

                        {fieldState.error && (
                          <Text
                            style={{
                              color: '#DC2626',
                              fontSize: 13,
                            }}
                          >
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
                  model === 'hourly'
                    ? '#E0F2FE'
                    : '#FFFFFF',

                borderWidth: 1,

                borderColor:
                  model === 'hourly'
                    ? '#0284C7'
                    : '#E5E7EB',

                padding: 16,
                borderRadius: 8,
              }}
            >
              <Pressable onPress={selectHourly}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#0F172A',
                  }}
                >
                  {model === 'hourly' ? '●' : '○'} Per hour
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: '#475569',
                    lineHeight: 20,
                  }}
                >
                  You charge a fee for each hour of work
                  performed.
                </Text>
              </Pressable>

              {/* SOLO EXISTE SI MODEL === HOURLY */}

              {model === 'hourly' && (
                <View
                  style={{
                    gap: 12,
                    marginTop: 16,
                  }}
                >

                  {/* PRECIO POR HORA */}

                  <View style={{ gap: 8 }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#0F172A',
                      }}
                    >
                      Hourly rate
                    </Text>

                    <Controller
                      control={control}
                      name="pricing.hourlyRate.amountMinor"
                      render={({ field, fieldState }) => (
                        <>
                          <TextInput
                            value={
                              field.value === 0
                                ? ''
                                : String(field.value)
                            }
                            onChangeText={(value) => {
                              const numericValue =
                                value === ''
                                  ? 0
                                  : Number(value);

                              field.onChange(numericValue);
                            }}
                            keyboardType="numeric"
                            placeholder="30000"
                            style={{
                              borderWidth: 1,
                              borderColor:
                                fieldState.error
                                  ? '#DC2626'
                                  : '#CBD5E1',
                              padding: 12,
                              borderRadius: 8,
                              backgroundColor: '#FFFFFF',
                            }}
                          />

                          {fieldState.error && (
                            <Text
                              style={{
                                color: '#DC2626',
                                fontSize: 13,
                              }}
                            >
                              {fieldState.error.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  {/* HORAS MÍNIMAS */}

                  <View style={{ gap: 8 }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#0F172A',
                      }}
                    >
                      Minimum hours
                    </Text>

                    <Controller
                      control={control}
                      name="pricing.minimumHours"
                      render={({ field, fieldState }) => (
                        <>
                          <TextInput
                            value={
                              field.value === 0
                                ? ''
                                : String(field.value)
                            }
                            onChangeText={(value) => {
                              const numericValue =
                                value === ''
                                  ? 0
                                  : Number(value);

                              field.onChange(numericValue);
                            }}
                            keyboardType="numeric"
                            placeholder="2"
                            style={{
                              borderWidth: 1,
                              borderColor:
                                fieldState.error
                                  ? '#DC2626'
                                  : '#CBD5E1',
                              padding: 12,
                              borderRadius: 8,
                              backgroundColor: '#FFFFFF',
                            }}
                          />

                          {fieldState.error && (
                            <Text
                              style={{
                                color: '#DC2626',
                                fontSize: 13,
                              }}
                            >
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
                  model === 'quote'
                    ? '#E0F2FE'
                    : '#FFFFFF',

                borderWidth: 1,

                borderColor:
                  model === 'quote'
                    ? '#0284C7'
                    : '#E5E7EB',

                padding: 16,
                borderRadius: 8,
              }}
            >
              <Pressable onPress={selectQuote}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#0F172A',
                  }}
                >
                  {model === 'quote' ? '●' : '○'} A budget
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: '#475569',
                    lineHeight: 20,
                  }}
                >
                  You assess the work on-site before giving a
                  final price.
                </Text>
              </Pressable>

              {model === 'quote' && (
                <Text
                  style={{
                    marginTop: 16,
                    color: '#475569',
                    lineHeight: 20,
                  }}
                >
                  The customer can request a quote before the
                  final price is agreed.
                </Text>
              )}
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}