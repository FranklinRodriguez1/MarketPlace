import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

import { createListingSchema, type CreateListingForm } from './schemas/create-listing.schema';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2Pricing } from './components/Step2Pricing';

export function CreateListingScreen() {
    const theme = useTheme();
    const [ step, setStep ] = useState(1);

    const methods = useForm<CreateListingForm>({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            categoryId: '',
            title: '',
            pricing: {
            model: 'fixed',
            price: {
            amountMinor: 0,
             currency: 'COP',
    },
  },
  photos: [],
        },
    });
    const nextStep = async () => {
        if(step === 1){
            const valid = await methods.trigger(['title', 'categoryId']);
            if(!valid)
                return;
            }
            if(step === 2){
                const valid = await methods.trigger('pricing');
                if(!valid) return;
            }
            setStep((current) => current + 1);
        };
        const previousStep = () => {
            setStep((current) => Math.max(1, current - 1));
        }


    return (
        <FormProvider {...methods}>
            <ThemedView style={styles.container}>
                <ThemedText type="smallBold" themeColor="textSecondary">Step {step} of 4</ThemedText>
                {step === 1 &&<Step1BasicInfo />}
                {step === 2 && <Step2Pricing />}

                <View style={styles.actions}>
            {step > 1 && (
                <Pressable
                    onPress={previousStep}
                    style={[styles.button, styles.outlinedButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
                >
                    <ThemedText type="smallBold">previous</ThemedText>
                </Pressable>
            )}

            <Pressable onPress={nextStep} style={[styles.button, { backgroundColor: theme.primary }]}>
                <ThemedText type="smallBold" style={styles.primaryLabel}>Next</ThemedText>
            </Pressable>

                </View>
            </ThemedView>
        </FormProvider>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  outlinedButton: {
    borderWidth: 1,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
});
