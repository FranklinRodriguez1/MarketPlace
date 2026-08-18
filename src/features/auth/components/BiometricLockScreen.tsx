import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { authenticateWithBiometrics } from '../biometrics';
import { clearTokens } from '../session';
import { AuthButton } from './AuthButton';
import { AuthCard } from './AuthCard';

interface BiometricLockScreenProps {
  onUnlock: () => void;
}

export function BiometricLockScreen({ onUnlock }: BiometricLockScreenProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock(): Promise<void> {
    setAuthenticating(true);
    setError(null);
    try {
      const success = await authenticateWithBiometrics(t('biometric.unlockPrompt'));
      if (success) {
        onUnlock();
      } else {
        setError(t('biometric.error'));
      }
    } finally {
      setAuthenticating(false);
    }
  }

  async function usePassword(): Promise<void> {
    await clearTokens();
    router.replace('/login');
  }

  return (
    <AuthCard>
      <View style={styles.iconWrap}>
        <Ionicons name="finger-print-outline" size={56} color={theme.primary} />
      </View>

      <ThemedText type="title" style={styles.title}>
        {t('biometric.unlockTitle')}
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        {t('biometric.unlockSubtitle')}
      </ThemedText>

      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        </View>
      )}

      <AuthButton label={t('biometric.unlockCta')} onPress={unlock} loading={authenticating} />
      <View style={styles.gap} />
      <Pressable style={styles.passwordLink} onPress={usePassword}>
        {({ pressed }) => (
          <ThemedText type="smallBold" style={{ color: pressed ? '#0369A1' : theme.primary }}>
            {t('biometric.usePassword')}
          </ThemedText>
        )}
      </Pressable>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
    textAlign: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  gap: {
    height: 12,
  },
  passwordLink: {
    alignSelf: 'center',
  },
});
