import '../src/global.css';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { queryClient } from '@/infrastructure/query/query-client';
import { SystemBars } from 'react-native-edge-to-edge';



export default function RootLayout() {
  useEffect(() =>{
    if(Platform.OS === 'android'){
      NavigationBar.setVisibilityAsync('hidden');
    }
  },[])
  return (
    <QueryClientProvider client={queryClient}>
      <SystemBars style="dark" hidden={{ statusBar: true, navigationBar: true }} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </QueryClientProvider>
  );
}

