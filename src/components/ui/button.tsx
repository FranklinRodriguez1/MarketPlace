import { useRef, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Las 4 variantes de botón definidas en RULES.md — no crear variantes ad-hoc.
export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  // Render-prop en vez de nodo fijo: así el ícono siempre recibe el color de texto correcto de la variante.
  icon?: (color: string) => ReactNode;
  trailingIcon?: (color: string) => ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
  trailingIcon,
}: ButtonProps) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const pressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  const { container, textColor } = variantStyle(variant, theme);

  return (
    <Animated.View style={[{ transform: [{ scale }] }, isDisabled && styles.disabled, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={isDisabled ? undefined : pressIn}
        onPressOut={isDisabled ? undefined : pressOut}
        disabled={isDisabled}
        style={[styles.button, container]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.content}>
            {icon?.(textColor)}
            <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
            {trailingIcon?.(textColor)}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function variantStyle(variant: ButtonVariant, theme: ReturnType<typeof useTheme>) {
  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: theme.primary } as ViewStyle,
        // Texto blanco fijo sobre botón primario — contraste fijo permitido por RULES.md, no token de tema.
        textColor: '#FFFFFF',
      };
    case 'secondary':
      return {
        container: { backgroundColor: theme.secondary } as ViewStyle,
        textColor: theme.text,
      };
    case 'inverted':
      return {
        // Fondo oscuro fijo independiente del esquema de color — el punto de esta variante es máximo contraste.
        container: { backgroundColor: '#1A1A1A' } as ViewStyle,
        textColor: '#FFFFFF',
      };
    case 'outlined':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.border,
        } as ViewStyle,
        textColor: theme.text,
      };
  }
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    minHeight: 44,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
  },
});
