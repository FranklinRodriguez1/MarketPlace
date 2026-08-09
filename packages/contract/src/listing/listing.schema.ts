import { z } from 'zod';

export const listingStatusSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('draft'),
  }),

  z.object({
    kind: z.literal('published'),
    publishedAt: z.string().datetime(),
  }),

  z.object({
    kind: z.literal('paused'),
  }),

  z.object({
    kind: z.literal('under_review'),
    reportId: z.string(),
  }),

  z.object({
    kind: z.literal('removed'),
    removedBy: z.string(),
    reason: z.string(),
  }),
]);

export type ListingStatus = z.infer<typeof listingStatusSchema>;