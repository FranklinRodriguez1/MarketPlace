import type { BookingStatus } from '../booking/booking-status';

export type ReviewBlockedReason =
  | 'not_your_booking'
  | 'not_completed'
  | 'already_reviewed'
  | 'window_closed';

export type ReviewEligibility =
  | { ok: true }
  | { ok: false; reason: ReviewBlockedReason };

export const REVIEW_WINDOW_DAYS = 30;

export type Actor = {
  id: string;
};

export type Booking = {
  customerId: string;
  status: {
    kind: BookingStatus['kind'];
    completedAt?: string;
  };
  reviewId: string | null;
};

export function canReviewBooking(
  actor: Actor,
  booking: Booking,
  now: Date,
): ReviewEligibility {
  // 1. La reserva debe pertenecer al usuario
  if (booking.customerId !== actor.id) {
    return {
      ok: false,
      reason: 'not_your_booking',
    };
  }

  // 2. La reserva debe estar completada
  if (booking.status.kind !== 'completed') {
    return {
      ok: false,
      reason: 'not_completed',
    };
  }

  // 3. No debe existir una reseña previamente creada
  if (booking.reviewId !== null) {
    return {
      ok: false,
      reason: 'already_reviewed',
    };
  }

  // 4. Deben haber pasado máximo 30 días
  const completedAt = new Date(booking.status.completedAt!);

  const daysBetween =
    (now.getTime() - completedAt.getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysBetween > REVIEW_WINDOW_DAYS) {
    return {
      ok: false,
      reason: 'window_closed',
    };
  }

  return {
    ok: true,
  };
}