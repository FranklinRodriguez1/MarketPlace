import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { AuthButton } from '../components/AuthButton';
import { AuthCard } from '../components/AuthCard';
import { AuthCheckbox } from '../components/AuthCheckbox';
import { AuthTextField } from '../components/AuthTextField';

export function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  return (
    <AuthCard>
      <ThemedText style={styles.headline} themeColor="primary">
        Cerca
      </ThemedText>
      <ThemedText style={styles.subtitle}>Crear cuenta</ThemedText>

      <AuthTextField
        label="Nombre completo"
        icon="person-outline"
        value={name}
        onChangeText={setName}
        placeholder="Ej. Juan Pérez"
      />

      <AuthTextField
        label="Correo electrónico"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="juan@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        error={emailTaken ? 'Este correo ya está registrado' : undefined}
      />

      <AuthTextField
        label="Contraseña"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry={!showPassword}
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

      <AuthCheckbox
        checked={acceptedTerms}
        onToggle={() => setAcceptedTerms((current) => !current)}
        label="Acepto los términos y condiciones"
      />

      <AuthButton label="Crear cuenta" onPress={() => setEmailTaken(true)} />

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
