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

import type { Pricing } from '@cerca/src';

import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Tipado mínimo a propósito: este componente solo lee/escribe el campo
// `pricing`, así que cualquier formulario (crear, editar) que tenga ese
// campo puede reutilizarlo dentro de su propio FormProvider.
export interface PricingFormValues {
  pricing: Pricing;
}

export function Step2Pricing() {
  const theme = useTheme();
  const { control, setValue } =
    useFormContext<PricingFormValues>();

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
          backgroundColor: theme.background,
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
                color: theme.textSecondary,
              }}
            >
              Prices
            </Text>

            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.text,
              }}
            >
              How do you want to charge?
            </Text>

            <Text
              style={{
                color: theme.textSecondary,
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
                    ? theme.backgroundSelected
                    : theme.surface,

                borderWidth: 1,

                borderColor:
                  model === 'fixed'
                    ? theme.primary
                    : theme.border,

                padding: 16,
                borderRadius: BorderRadius.input,
              }}
            >
              <Pressable onPress={selectFixed}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.text,
                  }}
                >
                  {model === 'fixed' ? '●' : '○'} Fixed price
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: theme.textSecondary,
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
                      color: theme.text,
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
                          placeholderTextColor={theme.textSecondary}
                          style={{
                            borderWidth: 1,
                            borderColor:
                              fieldState.error
                                ? theme.danger
                                : theme.border,
                            padding: 12,
                            borderRadius: BorderRadius.input,
                            backgroundColor: theme.surface,
                            color: theme.text,
                          }}
                        />

                        {fieldState.error && (
                          <Text
                            style={{
                              color: theme.danger,
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
                    ? theme.backgroundSelected
                    : theme.surface,

                borderWidth: 1,

                borderColor:
                  model === 'hourly'
                    ? theme.primary
                    : theme.border,

                padding: 16,
                borderRadius: BorderRadius.input,
              }}
            >
              <Pressable onPress={selectHourly}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.text,
                  }}
                >
                  {model === 'hourly' ? '●' : '○'} Per hour
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: theme.textSecondary,
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
                        color: theme.text,
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
                            placeholderTextColor={theme.textSecondary}
                            style={{
                              borderWidth: 1,
                              borderColor:
                                fieldState.error
                                  ? theme.danger
                                  : theme.border,
                              padding: 12,
                              borderRadius: BorderRadius.input,
                              backgroundColor: theme.surface,
                              color: theme.text,
                            }}
                          />

                          {fieldState.error && (
                            <Text
                              style={{
                                color: theme.danger,
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
                        color: theme.text,
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
                            placeholderTextColor={theme.textSecondary}
                            style={{
                              borderWidth: 1,
                              borderColor:
                                fieldState.error
                                  ? theme.danger
                                  : theme.border,
                              padding: 12,
                              borderRadius: BorderRadius.input,
                              backgroundColor: theme.surface,
                              color: theme.text,
                            }}
                          />

                          {fieldState.error && (
                            <Text
                              style={{
                                color: theme.danger,
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
                    ? theme.backgroundSelected
                    : theme.surface,

                borderWidth: 1,

                borderColor:
                  model === 'quote'
                    ? theme.primary
                    : theme.border,

                padding: 16,
                borderRadius: BorderRadius.input,
              }}
            >
              <Pressable onPress={selectQuote}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.text,
                  }}
                >
                  {model === 'quote' ? '●' : '○'} A budget
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: theme.textSecondary,
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
                    color: theme.textSecondary,
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
