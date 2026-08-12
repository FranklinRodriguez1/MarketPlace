import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { canReviewBooking } from '@cerca/src';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewSubmitted } from './components/ReviewSubmitted';

type TestReason =
  | 'not_completed'
  | 'already_reviewed'
  | 'window_closed'
  | 'not_your_booking'
  | null;


export function ReviewScreen() {
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
      <View style={styles.container}>

        <Text style={styles.title}>
          Review
        </Text>

        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>
            Reparación de Tubería
          </Text>

          <Text style={styles.bookingInfo}>
            Con Juan Pérez (Plomería)
          </Text>

          <Text style={styles.bookingInfo}>
            Fecha solicitada: 15 Oct 2023, 10:00 AM
          </Text>

          <Text style={styles.bookingInfo}>
            Dirección: Av. Siempre Viva 742
          </Text>
        </View>

        <View style={styles.blockedCard}>

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              !
            </Text>
          </View>

          <Text style={styles.blockedTitle}>
            {getBlockedTitle(eligibility.reason)}
          </Text>

          <Text style={styles.blockedMessage}>
            {getBlockedMessage(eligibility.reason)}
          </Text>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>
              ← Volver a Mis Reservas
            </Text>
          </Pressable>

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
    backgroundColor: '#F8F7F2',
    padding: 24,
    gap: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D6DCE3',
    gap: 10,
  },

  bookingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  bookingInfo: {
    fontSize: 14,
    color: '#334155',
  },

  blockedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: '#D6DCE3',
    alignItems: 'center',
    gap: 16,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E7E5DF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 28,
    color: '#64748B',
    fontWeight: '700',
  },

  blockedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },

  blockedMessage: {
    fontSize: 15,
    lineHeight: 23,
    color: '#475569',
    textAlign: 'center',
  },

  button: {
    marginTop: 10,
    backgroundColor: '#075985',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});