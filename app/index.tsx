import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { getAccessToken } from '@/features/auth/session';
import { useTheme } from '@/hooks/use-theme';

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

export default function Index() {
  const theme = useTheme();
  const [authState, setAuthState] = useState<AuthState>('checking');

  useEffect(() => {
    async function checkSession(): Promise<void> {
      const token = await getAccessToken();

      setAuthState(token !== null ? 'authenticated' : 'unauthenticated');

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

  // TEMPORAL: el backend todavía no está operativo, así que se salta el
  // chequeo de JWT para poder validar las pantallas con datos mock.
  // Revertir a `authState === 'authenticated'` (y mandar a /login en el
  // else) apenas haya backend real para probar el flujo de auth de verdad.
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
