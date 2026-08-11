import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { signUp } from '../auth.api';
import { registerFormSchema, type RegisterFormData } from '../auth.schemas';
import { AuthButton } from '../components/AuthButton';
import { AuthCard } from '../components/AuthCard';
import { AuthTextField } from '../components/AuthTextField';

export function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(data: RegisterFormData): Promise<void> {
    setServerError(null);
    try {
      const result = await signUp(data.email, data.password);
      // TODO CERCA-8: guardar result.accessToken y result.refreshToken en SecureStore
      console.log('accessToken:', result.accessToken);
      console.log('refreshToken:', result.refreshToken);
      console.log('actor:', result.actor);
      router.replace('/');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Error inesperado. Intenta de nuevo.');
    }
  }

  return (
    <AuthCard>
      <ThemedText style={styles.headline} themeColor="primary">
        Cerca
      </ThemedText>
      <ThemedText style={styles.subtitle}>Crear cuenta</ThemedText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthTextField
            label="Correo electrónico"
            icon="mail-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="juan@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthTextField
            label="Contraseña"
            icon="lock-closed-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            error={errors.password?.message}
            rightElement={
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>
            }
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthTextField
            label="Confirmar contraseña"
            icon="lock-closed-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="••••••••"
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword?.message}
            rightElement={
              <Pressable onPress={() => setShowConfirmPassword((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>
            }
          />
        )}
      />

      {serverError && (
        <View style={styles.serverErrorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
          <ThemedText type="small" themeColor="danger">
            {serverError}
          </ThemedText>
        </View>
      )}

      <AuthButton
        label="Crear cuenta"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />

      <View style={styles.footerRow}>
        <Pressable onPress={() => router.push('/login')} style={styles.footerLinkRow}>
          <ThemedText type="smallBold" themeColor="primary">
            ¿Ya tienes cuenta? Inicia sesión
          </ThemedText>
          <Ionicons name="arrow-forward" size={14} color={theme.primary} />
        </Pressable>
      </View>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 24,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  serverErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  footerRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
