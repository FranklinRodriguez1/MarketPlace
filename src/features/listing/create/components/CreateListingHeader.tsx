import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

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
    const progress = step / totalSteps;

    return(
        <View style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 15,
          paddingHorizontal: 16,
        }}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Pressable onPress={onBack}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                    <Text style={{
                  fontSize: 28,
                  color: '#0369A1',
                }}> ‹ </Text>
                </Pressable>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#075985',
              }}>
                    Step {step} of {totalSteps}
                </Text>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Pressable onPress={() => router.push('/my-listings')}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                    <Text style={{
                  fontSize: 28,
                  color: '#0369A1',
                }}>X</Text>
                </Pressable>
            </View>
            </View>
    )
}