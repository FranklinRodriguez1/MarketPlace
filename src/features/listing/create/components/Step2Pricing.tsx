import {
  View,
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
import { useTranslation } from 'react-i18next';

import type { Pricing } from '@cerca/src';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { translateFieldError } from '@/i18n/translate-field-error';

// Tipado mínimo a propósito: este componente solo lee/escribe el campo
// `pricing`, así que cualquier formulario (crear, editar) que tenga ese
// campo puede reutilizarlo dentro de su propio FormProvider.
export interface PricingFormValues {
  pricing: Pricing;
}

export function Step2Pricing() {
  const { control, setValue } =
    useFormContext<PricingFormValues>();
  const theme = useTheme();
  const { t } = useTranslation();

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
            <ThemedText
              themeColor="textSecondary"
              style={{ fontSize: 14 }}
            >
              {t('createListing.step2.pricesLabel')}
            </ThemedText>

            <ThemedText
              style={{ fontSize: 24, fontWeight: 'bold' }}
            >
              {t('createListing.step2.howChargeTitle')}
            </ThemedText>

            <ThemedText
              themeColor="textSecondary"
              style={{ lineHeight: 21 }}
            >
              {t('createListing.step2.howChargeDescription')}
            </ThemedText>
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
                borderRadius: 8,
              }}
            >
              <Pressable onPress={selectFixed}>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: '600' }}
                >
                  {model === 'fixed' ? '●' : '○'} {t('createListing.step2.fixedTitle')}
                </ThemedText>

                <ThemedText
                  themeColor="textSecondary"
                  style={{ marginTop: 6, lineHeight: 20 }}
                >
                  {t('createListing.step2.fixedDescription')}
                </ThemedText>
              </Pressable>

              {/* SOLO EXISTE SI MODEL === FIXED */}

              {pricing.model === 'fixed' && (
                <View
                  style={{
                    gap: 8,
                    marginTop: 16,
                  }}
                >
                  <ThemedText style={{ fontWeight: 'bold' }}>
                    {t('createListing.step2.priceLabel')}
                  </ThemedText>

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
                            borderRadius: 8,
                            backgroundColor: theme.surface,
                            color: theme.text,
                          }}
                        />

                        {fieldState.error && (
                          <ThemedText
                            themeColor="danger"
                            style={{ fontSize: 13 }}
                          >
                            {translateFieldError(t, fieldState.error.message)}
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
                borderRadius: 8,
              }}
            >
              <Pressable onPress={selectHourly}>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: '600' }}
                >
                  {model === 'hourly' ? '●' : '○'} {t('createListing.step2.hourlyTitle')}
                </ThemedText>

                <ThemedText
                  themeColor="textSecondary"
                  style={{ marginTop: 6, lineHeight: 20 }}
                >
                  {t('createListing.step2.hourlyDescription')}
                </ThemedText>
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
                    <ThemedText style={{ fontWeight: 'bold' }}>
                      {t('createListing.step2.hourlyRateLabel')}
                    </ThemedText>

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
                              borderRadius: 8,
                              backgroundColor: theme.surface,
                              color: theme.text,
                            }}
                          />

                          {fieldState.error && (
                            <ThemedText
                              themeColor="danger"
                              style={{ fontSize: 13 }}
                            >
                              {translateFieldError(t, fieldState.error.message)}
                            </ThemedText>
                          )}
                        </>
                      )}
                    />
                  </View>

                  {/* HORAS MÍNIMAS */}

                  <View style={{ gap: 8 }}>
                    <ThemedText style={{ fontWeight: 'bold' }}>
                      {t('createListing.step2.minimumHoursLabel')}
                    </ThemedText>

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
                              borderRadius: 8,
                              backgroundColor: theme.surface,
                              color: theme.text,
                            }}
                          />

                          {fieldState.error && (
                            <ThemedText
                              themeColor="danger"
                              style={{ fontSize: 13 }}
                            >
                              {translateFieldError(t, fieldState.error.message)}
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
                borderRadius: 8,
              }}
            >
              <Pressable onPress={selectQuote}>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: '600' }}
                >
                  {model === 'quote' ? '●' : '○'} {t('createListing.step2.quoteTitle')}
                </ThemedText>

                <ThemedText
                  themeColor="textSecondary"
                  style={{ marginTop: 6, lineHeight: 20 }}
                >
                  {t('createListing.step2.quoteDescription')}
                </ThemedText>
              </Pressable>

              {model === 'quote' && (
                <ThemedText
                  themeColor="textSecondary"
                  style={{ marginTop: 16, lineHeight: 20 }}
                >
                  {t('createListing.step2.quoteNote')}
                </ThemedText>
              )}
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
