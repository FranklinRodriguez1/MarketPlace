import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';

import { can } from '@/domain/auth/actor';
import { getMe } from '@/features/profile/profile.api';

export default function TabsLayout() {
  // null = todavía verificando; false = sin permiso; true = puede moderar
  const [canModerate, setCanModerate] = useState<boolean | null>(null);

  useEffect(() => {
    getMe()
      .then((me) => setCanModerate(can(me, 'report:resolve')))
      .catch(() => setCanModerate(false));
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2874A6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 90,
          paddingBottom: 20,
          paddingTop: 6,
          elevation: 10,
         
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="my-listings"
        options={{
          title: 'Mis anuncios',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list-alt" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Solo visible para moderadores y admins (can report:resolve) */}
      <Tabs.Screen
        name="moderation"
        options={{
          href: canModerate === true ? undefined : null,
          title: 'Moderación',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shield" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
