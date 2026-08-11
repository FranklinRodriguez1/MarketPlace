import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { signIn } from '../auth.api';
import { loginFormSchema, type LoginFormData } from '../auth.schemas';
import { AuthButton } from '../components/AuthButton';
import { AuthCard } from '../components/AuthCard';
import { AuthTextField } from '../components/AuthTextField';

export function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginFormData): Promise<void> {
    setServerError(null);
    try {
      const result = await signIn(data.email, data.password);
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
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Inicia sesión para continuar
      </ThemedText>

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
            placeholder="tu@correo.com"
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

      {serverError && (
        <View style={styles.serverErrorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
          <ThemedText type="small" themeColor="danger">
            {serverError}
          </ThemedText>
        </View>
      )}

      <Pressable style={styles.forgotLink}>
        <ThemedText type="smallBold" themeColor="primary">
          ¿Olvidaste tu contraseña?
        </ThemedText>
      </Pressable>

      <AuthButton
        label="Iniciar sesión"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
      <View style={styles.gap} />
      <AuthButton label="Volver" variant="outlined" onPress={() => router.back()} />

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.footerRow}>
        <ThemedText type="small">¿No tienes cuenta? </ThemedText>
        <Pressable onPress={() => router.push('/register')}>
          <ThemedText type="smallBold" themeColor="primary">
            Regístrate
          </ThemedText>
        </Pressable>
      </View>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
    textAlign: 'center',
  },
  serverErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  gap: {
    height: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
