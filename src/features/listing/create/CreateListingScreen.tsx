import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
} from 'react-native';

import {
  FormProvider,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { router } from 'expo-router';

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

export function CreateListingScreen() {
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
      // Obtener precio
      // --------------------------------

      const price =
        data.pricing.model === 'fixed'
          ? data.pricing.price
          : data.pricing.model === 'hourly'
            ? data.pricing.hourlyRate
            : data.pricing.startingFrom;

      // --------------------------------
      // Crear anuncio
      // --------------------------------

      const listing = await createListing({
        categoryId: data.categoryId,

        title: data.title,

        description: data.description,

        pricing: data.pricing,

        priceMinorFrom:
          price?.amountMinor,

        currency:
          price?.currency,

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
        './(provider)/my-listings',
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

      <View
        style={{
          flex: 1,
          padding: 24,
          gap: 20,
        }}
      >

        <Text>
          Step {step} of 4
        </Text>

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
            <Pressable
              onPress={previousStep}
              style={{
                backgroundColor: '#075985',
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                }}
              >
                Previous
              </Text>
            </Pressable>
          )}

          {step < 4 && (
            <Pressable
              onPress={nextStep}
              style={{
                backgroundColor: '#075985',
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                }}
              >
                Next
              </Text>
            </Pressable>
          )}

        </View>

      </View>

    </FormProvider>
  );
}