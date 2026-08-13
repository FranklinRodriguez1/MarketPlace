import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { refreshSession } from '@/features/auth/auth.api';
import { getRefreshToken, saveTokens } from '@/features/auth/session';

import { activateProvider, getMe, type MeData } from './profile.api';

// Máquina de estados de la pantalla
type ScreenState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; me: MeData };

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [state, setState] = useState<ScreenState>({ status: 'loading' });
  const [isActivating, setIsActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);

  useEffect(() => {
    void loadMe();
  }, []);

  async function loadMe(): Promise<void> {
    setState({ status: 'loading' });
    try {
      const me = await getMe();
      setState({ status: 'success', me });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : t('common.unexpectedError'),
      });
    }
  }

  async function handleActivateProvider(): Promise<void> {
    setActivateError(null);
    setIsActivating(true);
    try {
      const updatedMe = await activateProvider();

      // El accessToken actual todavía tiene las capacities viejas como
      // claims — sin renovarlo, los endpoints que chequean capacity
      // (ej. crear anuncio) seguirían devolviendo 403 aunque el perfil
      // ya muestre "provider".
      const refreshToken = await getRefreshToken();
      if (refreshToken !== null) {
        const renewed = await refreshSession(refreshToken);
        await saveTokens(renewed.accessToken, renewed.refreshToken);
      }

      // Actualiza la pantalla con el actor nuevo sin recargar
      setState({ status: 'success', me: updatedMe });
    } catch (error) {
      setActivateError(error instanceof Error ? error.message : t('common.unexpectedError'));
    } finally {
      setIsActivating(false);
    }
  }

  // — Estado: carga ——————————————————————————————————————————
  if (state.status === 'loading') {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  // — Estado: error de red ———————————————————————————————————
  if (state.status === 'error') {
    return (
      <ThemedView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={40} color={theme.danger} />
        <ThemedText type="small" themeColor="textSecondary" style={styles.errorMessage}>
          {state.message}
        </ThemedText>
        <Pressable
          onPress={() => void loadMe()}
          style={[styles.retryButton, { borderColor: theme.border }]}
        >
          <ThemedText type="smallBold" themeColor="primary">
            {t('common.retry')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  // — Estado: éxito ——————————————————————————————————————————
  const { me } = state;
  const isProvider = me.capacities.includes('provider');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText type="subtitle" style={styles.heading}>
          {t('profile.title')}
        </ThemedText>

        {/* Datos del actor */}
        <ThemedView type="backgroundElement" style={styles.card}>
          <InfoRow label={t('profile.id')} value={me.id} />
          <InfoRow label={t('profile.role')} value={me.platformRole ?? 'user'} />
          <View style={styles.capRow}>
            <ThemedText type="smallBold">{t('profile.capacities')}</ThemedText>
            <View style={styles.chips}>
              {me.capacities.length === 0 ? (
                <ThemedText type="small" themeColor="textSecondary">
                  {t('profile.none')}
                </ThemedText>
              ) : (
                me.capacities.map((cap) => (
                  <View key={cap} style={[styles.chip, { backgroundColor: theme.primary }]}>
                    <ThemedText type="small" style={styles.chipText}>
                      {cap}
                    </ThemedText>
                  </View>
                ))
              )}
            </View>
          </View>
        </ThemedView>

        {/* "Convertirme en proveedor" — oculto si ya tiene la capacidad */}
        {!isProvider && (
          <View style={styles.section}>
            {activateError && (
              <View style={styles.activateErrorRow}>
                <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
                <ThemedText type="small" themeColor="danger">
                  {activateError}
                </ThemedText>
              </View>
            )}
            <Pressable
              onPress={() => void handleActivateProvider()}
              disabled={isActivating}
              style={({ pressed }) => [
                styles.providerButton,
                { backgroundColor: theme.primary },
                isActivating && styles.buttonDisabled,
                pressed && !isActivating && styles.buttonPressed,
              ]}
            >
              {isActivating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText type="smallBold" style={styles.buttonText}>
                  {t('profile.becomeProvider')}
                </ThemedText>
              )}
            </Pressable>
          </View>
        )}

        {/* Selector de idioma */}
        <View style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>
            {t('profile.language')}
          </ThemedText>
          <View style={styles.languageRow}>
            <LanguageButton
              label="ES"
              active={i18n.language === 'es'}
              onPress={() => void i18n.changeLanguage('es')}
            />
            <LanguageButton
              label="EN"
              active={i18n.language === 'en'}
              onPress={() => void i18n.changeLanguage('en')}
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

// — Componentes auxiliares ————————————————————————————————————

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="smallBold" style={styles.infoLabel}>
        {label}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.infoValue}>
        {value}
      </ThemedText>
    </View>
  );
}

interface LanguageButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function LanguageButton({ label, active, onPress }: LanguageButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.langButton,
        {
          backgroundColor: active ? theme.primary : theme.backgroundElement,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText type="smallBold" style={active ? styles.langButtonTextActive : undefined}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

// — Estilos ————————————————————————————————————————————————

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  errorMessage: {
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
  retryButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.four,
  },
  heading: {
    marginBottom: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 2,
    textAlign: 'right',
  },
  capRow: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  chipText: {
    color: '#FFFFFF',
  },
  section: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  sectionLabel: {
    marginBottom: Spacing.one,
  },
  activateErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  providerButton: {
    height: 48,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  languageRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  langButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    minWidth: 64,
    alignItems: 'center',
  },
  langButtonTextActive: {
    color: '#FFFFFF',
  },
});
