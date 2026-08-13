import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';

import { useTheme } from '@/hooks/use-theme';

interface CreateListingHeaderProps {
    step: number;
    totalSteps: number;
    onBack: () => void;
}

export function CreateListingHeader({
    step,
    totalSteps,
    onBack,
}: CreateListingHeaderProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const progress = step / totalSteps;

    return(
        <View style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 15,
          paddingHorizontal: 16,
          backgroundColor: theme.background,
        }}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Pressable onPress={onBack}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                    <ThemedText themeColor="primary" style={{ fontSize: 28 }}> ‹ </ThemedText>
                </Pressable>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
                <ThemedText themeColor="primary" style={{ fontSize: 14, fontWeight: '700' }}>
                    {t('createListing.stepOf', { step, totalSteps })}
                </ThemedText>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Pressable onPress={() => router.push('/my-listings')}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                    <ThemedText themeColor="primary" style={{ fontSize: 28 }}>X</ThemedText>
                </Pressable>
            </View>
            </View>
    )
}
