import { describe, expect, it } from 'vitest';
import { canReviewBooking } from './review-policy';

describe('canReviewBooking', () => {
  const now = new Date('2026-08-11T12:00:00.000Z');

  const actor = {
    id: 'user-1',
  };

  it('returns true when the booking is completed', () => {
    const booking = {
      customerId: 'user-1',
      status: {
        kind: 'completed' as const,
        completedAt: '2026-08-10T12:00:00.000Z',
      },
      reviewId: null,
    };

    expect(
      canReviewBooking(actor, booking, now),
    ).toEqual({
      ok: true,
    });
  });

  it('returns not_completed when the booking is requested', () => {
    const booking = {
      customerId: 'user-1',
      status: {
        kind: 'requested' as const,
        requestedAt: '2026-08-10T12:00:00.000Z',
      },
      reviewId: null,
    };

    expect(
      canReviewBooking(actor, booking, now),
    ).toEqual({
      ok: false,
      reason: 'not_completed',
    });
  });

  it('returns not_completed when the booking is accepted', () => {
    const booking = {
      customerId: 'user-1',
      status: {
        kind: 'accepted' as const,
        acceptedAt: '2026-08-10T10:00:00.000Z',
        scheduledFor: '2026-08-12T10:00:00.000Z',
      },
      reviewId: null,
    };

    expect(
      canReviewBooking(actor, booking, now),
    ).toEqual({
      ok: false,
      reason: 'not_completed',
    });
  });

  it('returns not_completed when the booking is cancelled', () => {
    const booking = {
      customerId: 'user-1',
      status: {
        kind: 'cancelled' as const,
        cancelledBy: 'customer',
        at: '2026-08-10T12:00:00.000Z',
      },
      reviewId: null,
    };

    expect(
      canReviewBooking(actor, booking, now),
    ).toEqual({
      ok: false,
      reason: 'not_completed',
    });
  });

  it('blocks when it is not the actor booking', () => {
  const booking = {
    customerId: 'user-2',
    status: {
      kind: 'completed' as const,
      completedAt: '2026-08-10T12:00:00.000Z',
    },
    reviewId: null,
  };

  expect(canReviewBooking(actor, booking, now)).toEqual({
    ok: false,
    reason: 'not_your_booking',
  });
});

it('blocks when the booking already has a review', () => {
  const booking = {
    customerId: 'user-1',
    status: {
      kind: 'completed' as const,
      completedAt: '2026-08-10T12:00:00.000Z',
    },
    reviewId: 'review-1',
  };

  expect(canReviewBooking(actor, booking, now)).toEqual({
    ok: false,
    reason: 'already_reviewed',
  });
});

it('blocks when more than 30 days have passed', () => {
  const booking = {
    customerId: 'user-1',
    status: {
      kind: 'completed' as const,
      completedAt: '2026-07-01T12:00:00.000Z',
    },
    reviewId: null,
  };

  expect(canReviewBooking(actor, booking, now)).toEqual({
    ok: false,
    reason: 'window_closed',
  });
});
});