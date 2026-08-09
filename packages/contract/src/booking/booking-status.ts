export type BookingStatus =
  | { kind: 'requested'; requestedAt: string }
  | { kind: 'accepted'; acceptedAt: string; scheduledFor: string }
  | { kind: 'declined'; reason: string;  }
  | { kind: 'completed'; completedAt: string }
  | { kind: 'cancelled'; cancelledBy: string; at: string };