import { View, Text, Pressable } from 'react-native';

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
        <View>
            <View style={{
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginTop: 15,
        }}>
            <Pressable onPress={onBack}
          style={{
            position: 'absolute',
            left: 16,
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
            <Text style={{
            fontSize: 14,
            fontWeight: '700',
            color: '#075985',
          }}>
                Step {step} of {totalSteps}
            </Text>
            </View>
            <View
        style={{
          height: 3,
          backgroundColor: '#E5E7EB',
        }}
      >
        <View
          style={{
            height: 3,
            width: `${progress * 100}%`,
            backgroundColor: '#0369A1',
          }}
        />
      </View>
        </View>
    )
}