import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createListingSchema, type CreateListingForm } from './schemas/create-listing.schema';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2Pricing } from './components/Step2Pricing';

export function CreateListingScreen() {
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
            <View style={{flex: 1,
                padding: 24,
                gap: 20,}}>
                <Text>Step {step} of 4</Text>
                {step === 1 &&<Step1BasicInfo />}
                {step === 2 && <Step2Pricing />}

                <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            {step > 1 && (
                <Pressable onPress={previousStep} style={{backgroundColor: '#234', padding: 10, borderRadius: 5}}>
                    <Text>previous</Text>
                </Pressable>
            )}
            
            <Pressable onPress={nextStep}>
                <Text>Next</Text>
            </Pressable>

                </View>
            </View>
        </FormProvider>
    )
}