import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { BiometricLockScreen } from '@/features/auth/components/BiometricLockScreen';
import { getAccessToken, getBiometricsEnabled } from '@/features/auth/session';
import { useTheme } from '@/hooks/use-theme';

type AuthState = 'checking' | 'locked' | 'authenticated' | 'unauthenticated';

export default function Index() {
  const theme = useTheme();
  const [authState, setAuthState] = useState<AuthState>('checking');

  useEffect(() => {
    async function checkSession(): Promise<void> {
      const token = await getAccessToken();

      if (token === null) {
        setAuthState('unauthenticated');
      } else {
        const biometricsEnabled = await getBiometricsEnabled();
        setAuthState(biometricsEnabled ? 'locked' : 'authenticated');
      }

      // Ocultamos el splash aquí, cuando ya sabemos a dónde vamos.
      // El Redirect de abajo ya está listo en el próximo render,
      // así que el usuario ve: splash → pantalla correcta, sin parpadeo.
      void SplashScreen.hideAsync();
    }

    void checkSession();
  }, []);

  // Estado de carga: splash sigue visible encima, pero si se oculta antes
  // de que el chequeo termine, el usuario ve este spinner en vez de login.
  if (authState === 'checking') {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (authState === 'locked') {
    return <BiometricLockScreen onUnlock={() => setAuthState('authenticated')} />;
  }

  return <Redirect href={authState === 'authenticated' ? '/(tabs)' : '/login'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
