import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { Alert, ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Switch } from "@/components/ui/switch";
import { BorderRadius, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { authenticateWithBiometrics, isBiometricAvailable } from "@/features/auth/biometrics";
import { refreshSession } from "@/features/auth/auth.api";
import { useMyListings } from "@/features/listing/my-listings/hooks/use-my-listings";
import { activateProvider, getMe, type MeData } from "./profile.api";
import {
  clearTokens,
  getBiometricsEnabled,
  getRefreshToken,
  saveTokens,
  setBiometricsEnabled,
} from "@/features/auth/session";

// Idiomas soportados — el nombre se muestra en su propio idioma (Español/English),
// no se traduce, igual que hacen la mayoría de selectores de idioma.
const LANGUAGE_OPTIONS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
] as const;

// Máquina de estados de la pantalla
type ScreenState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; me: MeData };

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [state, setState] = useState<ScreenState>({ status: "loading" });
  const [isActivating, setIsActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricBusy, setBiometricBusy] = useState(false);
  const [biometricError, setBiometricError] = useState<string | null>(null);

  // Solo se necesita para las estadísticas de la vista de proveedor —
  // se evita el request de más mientras el actor sigue siendo cliente.
  const isProviderActor = state.status === "success" && state.me.capacities.includes("provider");
  const { data: myListings = [] } = useMyListings({ enabled: isProviderActor });

  useEffect(() => {
    void loadMe();
    void loadBiometricPreference();
  }, []);

  async function loadBiometricPreference(): Promise<void> {
    const [available, enabled] = await Promise.all([isBiometricAvailable(), getBiometricsEnabled()]);
    setBiometricAvailable(available);
    setBiometricEnabled(enabled);
  }

  async function handleToggleBiometrics(next: boolean): Promise<void> {
    setBiometricError(null);

    if (!next) {
      setBiometricEnabled(false);
      await setBiometricsEnabled(false);
      return;
    }

    setBiometricBusy(true);
    try {
      const success = await authenticateWithBiometrics(t("profile.biometricConfirmPrompt"));
      if (success) {
        setBiometricEnabled(true);
        await setBiometricsEnabled(true);
      } else {
        setBiometricError(t("profile.biometricConfirmError"));
      }
    } finally {
      setBiometricBusy(false);
    }
  }

  async function loadMe(): Promise<void> {
    setState({ status: "loading" });
    try {
      const me = await getMe();
      setState({ status: "success", me });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : t("common.unexpectedError"),
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
      setState({ status: "success", me: updatedMe });
    } catch (error) {
      setActivateError(
        error instanceof Error ? error.message : t("common.unexpectedError"),
      );
    } finally {
      setIsActivating(false);
    }
  }

  async function handleLogout(): Promise<void> {
    await clearTokens();
    router.replace("/login");
  }

  function confirmLogout(): void {
    Alert.alert(t("profile.logoutConfirmTitle"), t("profile.logoutConfirmMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("profile.logout"), style: "destructive", onPress: () => void handleLogout() },
    ]);
  }

  // Filas que todavía no tienen una pantalla propia en la app.
  function notifyComingSoon(label: string): void {
    Alert.alert(label, t("common.featureComingSoon"));
  }

  // — Estado: carga ——————————————————————————————————————————
  if (state.status === "loading") {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  // — Estado: error de red ———————————————————————————————————
  if (state.status === "error") {
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
            {t("common.retry")}
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  // — Estado: éxito ——————————————————————————————————————————
  const { me } = state;
  const isProvider = me.capacities.includes("provider");
  const currentLanguage = LANGUAGE_OPTIONS.find((option) => option.code === i18n.language);

  // Rating: promedio ponderado por ratingCount de los propios anuncios —
  // no existe (todavía) un endpoint de reservas completadas, así que
  // "servicios realizados" se aproxima con anuncios publicados en vez de
  // inventar un número.
  const totalRatingCount = myListings.reduce((sum, listing) => sum + listing.ratingCount, 0);
  const averageRating =
    totalRatingCount > 0
      ? myListings.reduce((sum, listing) => sum + listing.ratingAvg * listing.ratingCount, 0) / totalRatingCount
      : null;
  const activeListingsCount = myListings.filter((listing) => listing.status === "published").length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <Ionicons name="storefront-outline" size={22} color={theme.primary} />
          <ThemedText themeColor="primary" style={styles.wordmark}>
            Cerca
          </ThemedText>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* IDENTIDAD */}
          <View style={styles.identity}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <FontAwesome name="user-circle-o" size={48} color="#FFFFFF" />
            </View>

            <ThemedText type="small" themeColor="textSecondary">
              {me.email ?? "—"}
            </ThemedText>

            <View style={styles.identityActions}>
              {isProvider ? (
                <>
                  <View style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="smallBold" style={{ color: theme.text }}>
                      {t("profile.clientBadge")}
                    </ThemedText>
                  </View>
                  <View style={[styles.pill, { backgroundColor: theme.primary }]}>
                    <ThemedText type="smallBold" style={{ color: "#FFFFFF" }}>
                      {t("profile.providerBadge")}
                    </ThemedText>
                  </View>
                </>
              ) : (
                <>
                  <View style={[styles.pill, { backgroundColor: theme.primary }]}>
                    <ThemedText type="smallBold" style={{ color: "#FFFFFF" }}>
                      {t("profile.clientBadge")}
                    </ThemedText>
                  </View>
                  <Pressable
                    onPress={() => void handleActivateProvider()}
                    disabled={isActivating}
                    style={[
                      styles.outlinedButton,
                      { borderColor: theme.primary },
                      isActivating && styles.buttonDisabled,
                    ]}
                  >
                    {isActivating ? (
                      <ActivityIndicator color={theme.primary} />
                    ) : (
                      <ThemedText type="smallBold" style={{ color: theme.primary }}>
                        {t("profile.becomeProvider")}
                      </ThemedText>
                    )}
                  </Pressable>
                </>
              )}
            </View>

            {activateError && (
              <View style={styles.activateErrorRow}>
                <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
                <ThemedText type="small" themeColor="danger">
                  {activateError}
                </ThemedText>
              </View>
            )}
          </View>

          {/* ESTADÍSTICAS — solo proveedor */}
          {isProvider && (
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.statValueRow}>
                  <ThemedText style={styles.statValue}>
                    {averageRating !== null ? averageRating.toFixed(1) : "—"}
                  </ThemedText>
                  {averageRating !== null && <Ionicons name="star" size={16} color={theme.primary} />}
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {t("profile.rating")}
                </ThemedText>
              </View>

              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <ThemedText style={styles.statValue}>{activeListingsCount}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t("profile.activeListings")}
                </ThemedText>
              </View>
            </View>
          )}

          {/* MENÚ DE CUENTA */}
          <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }]}>
            {isProvider ? (
              <>
                <MenuRow
                  icon="storefront-outline"
                  label={t("profile.myListings")}
                  onPress={() => router.push("/(tabs)/my-listings")}
                />
                <MenuRow
                  icon="bar-chart-outline"
                  label={t("profile.salesStats")}
                  onPress={() => notifyComingSoon(t("profile.salesStats"))}
                />
                <MenuRow
                  icon="wallet-outline"
                  label={t("profile.walletPayments")}
                  onPress={() => notifyComingSoon(t("profile.walletPayments"))}
                />
                <MenuRow
                  icon="chatbubbles-outline"
                  label={t("profile.reviewsReceived")}
                  onPress={() => notifyComingSoon(t("profile.reviewsReceived"))}
                  isLast
                />
              </>
            ) : (
              <>
                <MenuRow
                  icon="calendar-outline"
                  label={t("profile.myBookings")}
                  onPress={() => notifyComingSoon(t("profile.myBookings"))}
                />
                <MenuRow
                  icon="heart-outline"
                  label={t("profile.favorites")}
                  onPress={() => notifyComingSoon(t("profile.favorites"))}
                />
                <MenuRow
                  icon="globe-outline"
                  label={t("profile.language")}
                  value={currentLanguage?.label}
                  onPress={() => setLanguageSheetOpen(true)}
                />
                <MenuRow
                  icon="cash-outline"
                  label={t("profile.currencyRegion")}
                  onPress={() => notifyComingSoon(t("profile.currencyRegion"))}
                />
                <MenuRow
                  icon="notifications-outline"
                  label={t("profile.notifications")}
                  onPress={() => notifyComingSoon(t("profile.notifications"))}
                />
                <MenuRow
                  icon="help-circle-outline"
                  label={t("profile.help")}
                  onPress={() => notifyComingSoon(t("profile.help"))}
                  isLast
                />
              </>
            )}
          </ThemedView>

          {/* DESBLOQUEO CON BIOMETRÍA — solo si el dispositivo la soporta */}
          {biometricAvailable && (
            <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }]}>
              <View style={styles.biometricRow}>
                <View style={styles.biometricRowLeft}>
                  <View style={[styles.menuRowIcon, { backgroundColor: theme.backgroundElement }]}>
                    <Ionicons name="finger-print-outline" size={18} color={theme.text} />
                  </View>
                  <ThemedText style={styles.menuRowLabel}>{t("profile.biometricToggle")}</ThemedText>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={(next) => void handleToggleBiometrics(next)}
                  disabled={biometricBusy}
                />
              </View>

              {biometricError && (
                <View style={styles.biometricErrorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
                  <ThemedText type="small" themeColor="danger">
                    {biometricError}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          )}

          {/* CERRAR SESIÓN */}
          <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }]}>
            <MenuRow icon="log-out-outline" label={t("profile.logout")} onPress={confirmLogout} isLast danger />
          </ThemedView>
        </ScrollView>

        {/* Selector de idioma */}
        <Modal
          visible={languageSheetOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setLanguageSheetOpen(false)}
        >
          <View style={styles.sheetBackdrop}>
            <View style={[styles.sheet, { backgroundColor: theme.background }]}>
              <ThemedText style={styles.sheetTitle}>{t("profile.language")}</ThemedText>

              {LANGUAGE_OPTIONS.map((option) => {
                const selected = option.code === i18n.language;

                return (
                  <Pressable
                    key={option.code}
                    onPress={() => {
                      void i18n.changeLanguage(option.code);
                      setLanguageSheetOpen(false);
                    }}
                    style={[
                      styles.sheetOption,
                      { borderColor: theme.border, backgroundColor: selected ? theme.backgroundSelected : theme.background },
                    ]}
                  >
                    <ThemedText>{option.label}</ThemedText>
                    {selected && <Ionicons name="checkmark" size={18} color={theme.primary} />}
                  </Pressable>
                );
              })}

              <Pressable
                onPress={() => setLanguageSheetOpen(false)}
                style={[styles.sheetCancel, { borderColor: theme.border }]}
              >
                <ThemedText type="smallBold">{t("common.cancel")}</ThemedText>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

// — Componentes auxiliares ————————————————————————————————————

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  isLast?: boolean;
  danger?: boolean;
}

function MenuRow({ icon, label, value, onPress, isLast, danger }: MenuRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuRow,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
        pressed && { backgroundColor: theme.backgroundElement },
      ]}
    >
      <View
        style={[
          styles.menuRowIcon,
          { backgroundColor: danger ? `${theme.danger}1F` : theme.backgroundElement },
        ]}
      >
        <Ionicons name={icon} size={18} color={danger ? theme.danger : theme.text} />
      </View>

      <ThemedText style={[styles.menuRowLabel, danger && { color: theme.danger, fontWeight: "700" }]}>
        {label}
      </ThemedText>

      {value && (
        <ThemedText type="small" themeColor="textSecondary">
          {value}
        </ThemedText>
      )}

      {!danger && <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />}
    </Pressable>
  );
}

// — Estilos ————————————————————————————————————————————————

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.three,
  },
  errorMessage: {
    textAlign: "center",
    paddingHorizontal: Spacing.four,
  },
  retryButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  wordmark: {
    fontSize: 20,
    fontWeight: "800",
  },
  scrollContent: {
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  identity: {
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  identityActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.pill,
  },
  outlinedButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  activateErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  card: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  menuRowIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.input,
    alignItems: "center",
    justifyContent: "center",
  },
  menuRowLabel: {
    flex: 1,
    fontWeight: "600",
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: Spacing.one,
  },
  sheetOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.input,
    padding: Spacing.three,
  },
  sheetCancel: {
    marginTop: Spacing.one,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    alignItems: "center",
  },
  biometricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  biometricRowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  biometricErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
