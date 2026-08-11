import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { AuthButton } from '../components/AuthButton';
import { AuthCard } from '../components/AuthCard';
import { AuthTextField } from '../components/AuthTextField';

export function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <AuthCard>
      <ThemedText style={styles.headline} themeColor="primary">
        Cerca
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Inicia sesión para continuar
      </ThemedText>

      <AuthTextField
        label="Correo electrónico"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="tu@correo.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <AuthTextField
        label="Contraseña"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry={!showPassword}
        error={showError ? 'Correo o contraseña incorrectos' : undefined}
        rightElement={
          <Pressable onPress={() => setShowPassword((current) => !current)} hitSlop={8}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={theme.textSecondary}
            />
          </Pressable>
        }
      />

      <Pressable style={styles.forgotLink}>
        <ThemedText type="smallBold" themeColor="primary">
          ¿Olvidaste tu contraseña?
        </ThemedText>
      </Pressable>

      <AuthButton label="Iniciar sesión" onPress={() => setShowError(true)} />
      <View style={styles.gap} />
      <AuthButton label="Volver" variant="outlined" />

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
