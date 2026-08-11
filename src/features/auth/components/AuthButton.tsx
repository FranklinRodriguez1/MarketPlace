import { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface AuthButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outlined';
}

export function AuthButton({ label, onPress, variant = 'primary' }: AuthButtonProps) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          styles.button,
          isPrimary
            ? { backgroundColor: theme.primary }
            : { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
        ]}
      >
        <ThemedText style={isPrimary ? styles.primaryLabel : styles.label}>{label}</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
