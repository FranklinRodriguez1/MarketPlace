import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getAccessToken } from '@/features/auth/session';

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

export default function Index() {
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2F6690" />
      </View>
    );
  }

  if (authState === 'authenticated') {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F1EC',
  },
});
