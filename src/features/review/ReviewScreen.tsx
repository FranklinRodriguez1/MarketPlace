import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { canReviewBooking } from '@cerca/src';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewSubmitted } from './components/ReviewSubmitted';
import { Button } from '@/components/ui/button';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TestReason =
  | 'not_completed'
  | 'already_reviewed'
  | 'window_closed'
  | 'not_your_booking'
  | null;


export function ReviewScreen() {
  const theme = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const TEST_REASON = null as TestReason;

  const actor = {
    id: 'user-2',
  };

  const booking = {
    id: 'booking-2',

    customerId:
      TEST_REASON === 'not_your_booking'
        ? 'user-999'
        : 'user-2',

    reviewId:
      TEST_REASON === 'already_reviewed'
        ? 'review-123'
        : null,

    status:
      TEST_REASON === 'not_completed'
        ? {
            kind: 'accepted' as const,
            acceptedAt: '2026-08-10T10:00:00.000Z',
            scheduledFor: '2026-08-12T10:00:00.000Z',
          }
        : TEST_REASON === 'window_closed'
        ? {
            kind: 'completed' as const,
            completedAt: '2026-07-01T12:00:00.000Z',
          }
        : {
            kind: 'completed' as const,
            completedAt: '2026-08-10T12:00:00.000Z',
          },
  };

  const eligibility = canReviewBooking(
    actor,
    booking,
    new Date('2026-08-11T12:00:00.000Z'),
  );

  // -------------------------
  // BLOQUEADO
  // -------------------------

   if (!eligibility.ok) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>

        <Text style={[styles.title, { color: theme.text }]}>
          Review
        </Text>

        <View
          style={[
            styles.bookingCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.bookingTitle, { color: theme.text }]}>
            Reparación de Tubería
          </Text>

          <Text style={[styles.bookingInfo, { color: theme.textSecondary }]}>
            Con Juan Pérez (Plomería)
          </Text>

          <Text style={[styles.bookingInfo, { color: theme.textSecondary }]}>
            Fecha solicitada: 15 Oct 2023, 10:00 AM
          </Text>

          <Text style={[styles.bookingInfo, { color: theme.textSecondary }]}>
            Dirección: Av. Siempre Viva 742
          </Text>
        </View>

        <View
          style={[
            styles.blockedCard,
            { backgroundColor: theme.surface, borderColor: theme.danger },
          ]}
        >

          <View style={[styles.iconContainer, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.icon, { color: theme.danger }]}>
              !
            </Text>
          </View>

          <Text style={[styles.blockedTitle, { color: theme.danger }]}>
            {getBlockedTitle(eligibility.reason)}
          </Text>

          <Text style={[styles.blockedMessage, { color: theme.textSecondary }]}>
            {getBlockedMessage(eligibility.reason)}
          </Text>

          <Button
            label="← Volver a Mis Reservas"
            variant="primary"
            style={styles.button}
          />

        </View>

      </View>
    );
  }

  if(submitted){
    return <ReviewSubmitted/>
  }


 return (
    <ReviewForm
  onSubmit={() => {
    console.log('Reseña enviada');
    setSubmitted(true);
  }}
/>
  );
  
}
function getBlockedTitle(
  reason:
    | 'not_your_booking'
    | 'not_completed'
    | 'already_reviewed'
    | 'window_closed',
) {
  switch (reason) {

    case 'not_your_booking':
      return 'Reseña no disponible';

    case 'not_completed':
      return 'Reseña no disponible';

    case 'already_reviewed':
      return 'Ya reseñaste esta reserva';

    case 'window_closed':
      return 'Reseña cerrada';
  }
}

function getBlockedMessage(
  reason:
    | 'not_your_booking'
    | 'not_completed'
    | 'already_reviewed'
    | 'window_closed',
) {
  switch (reason) {
    case 'not_your_booking':
      return 'This booking does not belong to you.';

    case 'not_completed':
      return 'You can only review a completed booking.';

    case 'already_reviewed':
      return 'You have already reviewed this booking.';

    case 'window_closed':
      return 'The 30-day review period has expired.';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  bookingCard: {
    borderRadius: BorderRadius.card,
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },

  bookingTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  bookingInfo: {
    fontSize: 14,
  },

  blockedCard: {
    borderRadius: BorderRadius.card,
    padding: 32,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 28,
    fontWeight: '700',
  },

  blockedTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  blockedMessage: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },

  button: {
    marginTop: 10,
  },
});