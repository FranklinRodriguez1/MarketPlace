import { useState } from 'react';
import {
  View,
  Pressable,
} from 'react-native';

import {
  FormProvider,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { CreateListingHeader } from './components/CreateListingHeader';

import {
  createListingSchema,
  type CreateListingForm,
} from './schemas/create-listing.schema';

import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2Pricing } from './components/Step2Pricing';
import { Step3LocationPhotos } from './components/Step3LocationPhotos';
import { Step4Review } from './components/Step4Review';

import { createListing } from '@/services/listing.service';
import { Button } from '@/components/ui/button';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function CreateListingScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const methods = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),

    defaultValues: {
      categoryId: '',
      title: '',
      description: '',

      pricing: {
        model: 'fixed',

        price: {
          amountMinor: 0,
          currency: 'COP',
        },
      },

      latitude: undefined,
      longitude: undefined,

      photos: [],
    },
  });

  const handlePublish = async () => {
    try {
      setLoading(true);

      const data = methods.getValues();

      console.log(
        'Datos del formulario:',
        data,
      );

      // --------------------------------
      // Crear anuncio
      // --------------------------------
      // priceMinorFrom/currency no se envían: el backend los deriva de
      // `pricing` y rechaza (422) cualquier campo que no reconoce.

      const listing = await createListing({
        categoryId: data.categoryId,

        title: data.title,

        description: data.description,

        pricing: data.pricing,

        location:
          data.latitude !== undefined &&
          data.longitude !== undefined
            ? {
                lat: data.latitude,
                lng: data.longitude,
              }
            : undefined,
      });

      console.log(
        'Anuncio creado:',
        listing,
      );

      // --------------------------------
      // Ir a Mis anuncios
      // --------------------------------

      router.replace(
        './my-listings',
      );

    } catch (error) {
      console.error(
        'Error creando anuncio:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    // STEP 1
    if (step === 1) {
      const valid =
        await methods.trigger([
          'title',
          'description',
          'categoryId',
        ]);

      if (!valid) {
        return;
      }
    }

    // STEP 2
    if (step === 2) {
      const valid =
        await methods.trigger('pricing');

      if (!valid) {
        return;
      }
    }

    // STEP 3
    if (step === 3) {
      const valid =
        await methods.trigger([
          'latitude',
          'longitude',
        ]);

      if (!valid) {
        return;
      }
    }

    setStep(
      (current) =>
        Math.min(4, current + 1),
    );
  };

  const previousStep = () => {
    setStep(
      (current) =>
        Math.max(1, current - 1),
    );
  };

  return (
    <FormProvider {...methods}>

      <CreateListingHeader
        step={step}
        totalSteps={4}
        onBack={previousStep}
      />

      <ThemedView
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
      <View
        style={{
          flex: 1,
          width: '100%',
          maxWidth: MaxContentWidth,
          padding: 24,
          gap: 20,
        }}
      >

        <ThemedText themeColor="textSecondary">
          {t('createListing.stepOf', { step, totalSteps: 4 })}
        </ThemedText>

        {/* STEP 1 */}

        {step === 1 && (
          <Step1BasicInfo />
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <Step2Pricing />
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <Step3LocationPhotos />
        )}

        {/* STEP 4 */}

        {step === 4 && (
          <Step4Review
            onPublish={handlePublish}
            loading={loading}
          />
        )}

        {/* BOTONES */}

         <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >

          {step > 1 && (
            <Button
              label="Previous"
              onPress={previousStep}
              variant="outlined"
            />
          )}

          {step < 4 && (
            <Button
              label="Next"
              onPress={nextStep}
              variant="primary"
            />
          )}

        </View>
        </View>

      </ThemedView>

    </FormProvider>
  );
}