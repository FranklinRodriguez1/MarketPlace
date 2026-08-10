export type Capacity = 'customer' | 'provider';
export type PlatformRole = 'user' | 'moderator' | 'admin';

export type Action =
  | 'listing:read'
  | 'listing:create'
  | 'listing:update'
  | 'listing:moderate'
  | 'booking:request'
  | 'booking:accept'
  | 'review:write'
  | 'review:moderate'
  | 'report:resolve'
  | 'user:suspend';

export type Actor = {
  capacities: Capacity[];
  platformRole?: PlatformRole;
};

// Actions gated by the actor's transactional role (customer/provider).
const CAPACITY_PERMISSIONS: Record<Action, Capacity[]> = {
  'listing:read':     ['customer', 'provider'],
  'listing:create':   ['provider'],
  'listing:update':   ['provider'],
  'listing:moderate': [],
  'booking:request':  ['customer'],
  'booking:accept':   ['provider'],
  'review:write':     ['customer'],
  'review:moderate':  [],
  'report:resolve':   [],
  'user:suspend':     [],
};

// Actions gated by elevated platform role (moderator/admin overrides).
// 'user' is not listed: it has no elevated access beyond capacity.
const PLATFORM_ROLE_PERMISSIONS: Record<Action, PlatformRole[]> = {
  'listing:read':     ['moderator', 'admin'],
  'listing:create':   ['admin'],
  'listing:update':   ['admin'],
  'listing:moderate': ['moderator', 'admin'],
  'booking:request':  ['admin'],
  'booking:accept':   ['admin'],
  'review:write':     ['admin'],
  'review:moderate':  ['moderator', 'admin'],
  'report:resolve':   ['moderator', 'admin'],
  'user:suspend':     ['admin'],
};

export function has(actor: Actor, capacity: Capacity): boolean {
  return actor.capacities.includes(capacity);
}

export function can(actor: Actor, action: Action): boolean {
  if (actor.platformRole && PLATFORM_ROLE_PERMISSIONS[action].includes(actor.platformRole)) {
    return true;
  }
  return CAPACITY_PERMISSIONS[action].some(cap => actor.capacities.includes(cap));
}
