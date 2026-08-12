import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import {
  getReports,
  moderateListing,
  resolveReport,
  type ListingStatus,
  type Report,
} from './moderation.api';

type ScreenState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; reports: Report[] };

export default function ModerationScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [state, setState] = useState<ScreenState>({ status: 'loading' });
  // ID del reporte que tiene una acción en vuelo — deshabilita todos sus botones
  const [busyReportId, setBusyReportId] = useState<string | null>(null);
  // Error de la última acción (moderate o resolve)
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    void loadReports();
  }, []);

  async function loadReports(): Promise<void> {
    setState({ status: 'loading' });
    try {
      const reports = await getReports();
      setState({ status: 'success', reports });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : t('common.unexpectedError'),
      });
    }
  }

  async function handleModerate(
    reportId: string,
    listingId: string,
    status: ListingStatus,
  ): Promise<void> {
    setBusyReportId(reportId);
    setActionErrors((prev) => ({ ...prev, [reportId]: '' }));
    try {
      await moderateListing(listingId, status);
    } catch (error) {
      setActionErrors((prev) => ({
        ...prev,
        [reportId]: error instanceof Error ? error.message : t('common.unexpectedError'),
      }));
    } finally {
      setBusyReportId(null);
    }
  }

  async function handleResolve(reportId: string): Promise<void> {
    setBusyReportId(reportId);
    setActionErrors((prev) => ({ ...prev, [reportId]: '' }));
    try {
      await resolveReport(reportId);
      // Quita el reporte de la lista sin recargar toda la pantalla
      setState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          status: 'success',
          reports: prev.reports.filter((r) => r.id !== reportId),
        };
      });
    } catch (error) {
      setActionErrors((prev) => ({
        ...prev,
        [reportId]: error instanceof Error ? error.message : t('common.unexpectedError'),
      }));
    } finally {
      setBusyReportId(null);
    }
  }

  // — Estado: carga —————————————————————————————————————————
  if (state.status === 'loading') {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  // — Estado: error de red ——————————————————————————————————
  if (state.status === 'error') {
    return (
      <ThemedView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={40} color={theme.danger} />
        <ThemedText type="small" themeColor="textSecondary" style={styles.errorMessage}>
          {state.message}
        </ThemedText>
        <Pressable
          onPress={() => void loadReports()}
          style={[styles.retryButton, { borderColor: theme.border }]}
        >
          <ThemedText type="smallBold" themeColor="primary">
            {t('common.retry')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const { reports } = state;

  // — Estado: lista vacía ———————————————————————————————————
  if (reports.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <Ionicons name="checkmark-circle-outline" size={40} color={theme.primary} />
        <ThemedText type="small" themeColor="textSecondary">
          {t('moderation.empty')}
        </ThemedText>
      </ThemedView>
    );
  }

  // — Estado: éxito con reportes ————————————————————————————
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle" style={styles.heading}>
          {t('moderation.title')}
        </ThemedText>
        <ScrollView showsVerticalScrollIndicator={false}>
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isBusy={busyReportId === report.id}
              actionError={actionErrors[report.id] ?? null}
              onModerate={(status) => void handleModerate(report.id, report.listingId, status)}
              onResolve={() => void handleResolve(report.id)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// — ReportCard ————————————————————————————————————————————————

interface ReportCardProps {
  report: Report;
  isBusy: boolean;
  actionError: string | null;
  onModerate: (status: ListingStatus) => void;
  onResolve: () => void;
}

function ReportCard({ report, isBusy, actionError, onModerate, onResolve }: ReportCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText type="smallBold">{t('moderation.listing')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.idText}>
          {report.listingId}
        </ThemedText>
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {t('moderation.reason', { value: report.reason })}
      </ThemedText>

      {actionError !== null && actionError !== '' && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={theme.danger} />
          <ThemedText type="small" themeColor="danger">
            {actionError}
          </ThemedText>
        </View>
      )}

      {/* Acciones sobre el listing */}
      <View style={styles.moderateRow}>
        <ModerateButton
          label={t('moderation.underReview')}
          disabled={isBusy}
          onPress={() => onModerate('under_review')}
        />
        <ModerateButton
          label={t('moderation.remove')}
          disabled={isBusy}
          danger
          onPress={() => onModerate('removed')}
        />
      </View>

      {/* Resolver el reporte */}
      <Pressable
        onPress={onResolve}
        disabled={isBusy}
        style={({ pressed }) => [
          styles.resolveButton,
          { borderColor: theme.primary },
          isBusy && styles.buttonDisabled,
          pressed && !isBusy && styles.buttonPressed,
        ]}
      >
        {isBusy ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <ThemedText type="smallBold" themeColor="primary">
            {t('moderation.resolve')}
          </ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

// — ModerateButton ————————————————————————————————————————————

interface ModerateButtonProps {
  label: string;
  onPress: () => void;
  disabled: boolean;
  danger?: boolean;
}

function ModerateButton({ label, onPress, disabled, danger = false }: ModerateButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.moderateButton,
        { backgroundColor: danger ? theme.danger : theme.primary },
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <ThemedText type="small" style={styles.moderateButtonText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

// — Estilos ———————————————————————————————————————————————————

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
  },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
  },
  heading: {
    marginBottom: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idText: {
    fontFamily: 'monospace',
    fontSize: 11,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  moderateRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  moderateButton: {
    flex: 1,
    height: 36,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moderateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resolveButton: {
    height: 40,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
