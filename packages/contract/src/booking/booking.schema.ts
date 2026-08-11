import { z } from 'zod';

export const bookingStatusSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('requested'),
        requestedAt: z.string().datetime(),
    }),
    z.object({
    kind: z.literal('accepted'),
    acceptedAt: z.string().datetime(),
    scheduledFor: z.string().datetime(),
  }),

    z.object({
    kind: z.literal('declined'),
    reason: z.string(),
  }),

    z.object({
    kind: z.literal('completed'),
    completedAt: z.string().datetime(),
  }),

    z.object({
    kind: z.literal('cancelled'),
    cancelledBy: z.string(),
    at: z.string().datetime(),
  }),
])

export type BookingStatusInput = z.infer<typeof bookingStatusSchema>;