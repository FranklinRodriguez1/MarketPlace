import { describe, it, expect } from 'vitest';
import { Actor, can, has } from './actor';

describe('can()', () => {
  it('customer NO puede listing:create', () => {
    const actor: Actor = { capacities: ['customer'] };
    expect(can(actor, 'listing:create')).toBe(false);
  });

  it('provider SÍ puede listing:create', () => {
    const actor: Actor = { capacities: ['provider'] };
    expect(can(actor, 'listing:create')).toBe(true);
  });

  it('admin puede listing:create y user:suspend aunque no tenga capacities', () => {
    const actor: Actor = { capacities: [], platformRole: 'admin' };
    expect(can(actor, 'listing:create')).toBe(true);
    expect(can(actor, 'user:suspend')).toBe(true);
  });

  it('actor con customer y provider puede booking:request y listing:create', () => {
    const actor: Actor = { capacities: ['customer', 'provider'] };
    expect(can(actor, 'booking:request')).toBe(true);
    expect(can(actor, 'listing:create')).toBe(true);
  });
});

describe('moderator', () => {
  const actor: Actor = { capacities: [], platformRole: 'moderator' };

  it('puede listing:read, listing:moderate, review:moderate, report:resolve', () => {
    expect(can(actor, 'listing:read')).toBe(true);
    expect(can(actor, 'listing:moderate')).toBe(true);
    expect(can(actor, 'review:moderate')).toBe(true);
    expect(can(actor, 'report:resolve')).toBe(true);
  });

  it('NO puede listing:create ni user:suspend', () => {
    expect(can(actor, 'listing:create')).toBe(false);
    expect(can(actor, 'user:suspend')).toBe(false);
  });
});

describe('user sin rol elevado', () => {
  it('NO puede user:suspend aunque tenga capacidades', () => {
    const actor: Actor = { capacities: ['customer', 'provider'] };
    expect(can(actor, 'user:suspend')).toBe(false);
  });
});

describe('has()', () => {
  it('detecta correctamente si tiene una capacidad específica', () => {
    const actor: Actor = { capacities: ['customer'] };
    expect(has(actor, 'customer')).toBe(true);
    expect(has(actor, 'provider')).toBe(false);
  });
});
