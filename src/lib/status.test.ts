import { describe, expect, it } from 'vitest';
import { formatAgo, isStale, parseStatus } from './status';

const good = {
  generatedAt: 1000,
  host: { load1: 0.4, mem_used_pct: 60, uptime_s: 100 },
  services: [
    { name: 'portfolio', state: 'up', uptime: '3 days' },
    { name: 'gateway', state: 'down', uptime: null },
  ],
};

describe('isStale', () => {
  it('is fresh at exactly 180 s and stale just after', () => {
    expect(isStale(1000, (1000 + 180) * 1000)).toBe(false);
    expect(isStale(1000, (1000 + 181) * 1000)).toBe(true);
  });
  it('treats a future timestamp as fresh', () => {
    expect(isStale(2000, 1000 * 1000)).toBe(false);
  });
});

describe('parseStatus', () => {
  it('accepts a valid payload', () => {
    expect(parseStatus(good)).toEqual(good);
  });
  it('strips unknown fields', () => {
    const out = parseStatus({ ...good, secret: 'x', services: [{ ...good.services[0], id: 'abc' }] });
    expect(out?.services[0]).toEqual(good.services[0]);
    expect(out).not.toHaveProperty('secret');
  });
  it.each([
    ['null', null],
    ['string', 'x'],
    ['missing generatedAt', { ...good, generatedAt: undefined }],
    ['bad host', { ...good, host: { load1: 'a' } }],
    ['services not array', { ...good, services: {} }],
    ['bad state', { ...good, services: [{ name: 'a', state: 'running', uptime: null }] }],
    ['missing uptime', { ...good, services: [{ name: 'a', state: 'up' }] }],
    ['NaN number', { ...good, generatedAt: NaN }],
  ])('rejects %s', (_label, input) => {
    expect(parseStatus(input)).toBeNull();
  });
});

describe('formatAgo', () => {
  it('formats units', () => {
    expect(formatAgo(5)).toBe('5 s');
    expect(formatAgo(300)).toBe('5 min');
    expect(formatAgo(7200)).toBe('2 h');
    expect(formatAgo(86400)).toBe('1 day');
    expect(formatAgo(172800)).toBe('2 days');
  });
});
