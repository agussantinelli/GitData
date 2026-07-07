import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TTLCache } from '../TTLCache';

describe('TTLCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct size 0', () => {
    const cache = new TTLCache<string>(1000);
    expect(cache.size()).toBe(0);
  });

  it('should store and retrieve a value within TTL', () => {
    const cache = new TTLCache<string>(1000);
    cache.set('key1', 'value1');
    expect(cache.size()).toBe(1);
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return null for non-existent keys', () => {
    const cache = new TTLCache<string>(1000);
    expect(cache.get('missing')).toBeNull();
  });

  it('should return null if the value has expired and delete the entry', () => {
    const cache = new TTLCache<string>(1000); // 1 sec TTL
    cache.set('key1', 'value1');
    
    // Fast-forward time by 1.5 seconds
    vi.advanceTimersByTime(1500);
    
    expect(cache.get('key1')).toBeNull();
    expect(cache.size()).toBe(0); // Item should be removed upon fetch attempt
  });

  it('should allow overwriting a key, renewing its TTL', () => {
    const cache = new TTLCache<string>(1000); // 1 sec TTL
    cache.set('key1', 'value1');
    
    // Forward half a second
    vi.advanceTimersByTime(500);
    
    // Overwrite
    cache.set('key1', 'value2');
    
    // Forward another half second (original would have expired)
    vi.advanceTimersByTime(600);
    
    expect(cache.get('key1')).toBe('value2'); // Should still be valid
  });

  it('should work with complex object data', () => {
    const cache = new TTLCache<{ id: number, name: string }>(1000);
    const obj = { id: 1, name: 'test' };
    cache.set('obj', obj);
    expect(cache.get('obj')).toEqual({ id: 1, name: 'test' });
    expect(cache.get('obj')).toBe(obj); // Exact reference
  });

  it('should support multiple concurrent keys with different TTLs independently', () => {
    const cache = new TTLCache<string>(1000);
    cache.set('key1', 'val1');
    
    vi.advanceTimersByTime(500);
    cache.set('key2', 'val2');
    
    vi.advanceTimersByTime(600); // key1 is 1100 old, key2 is 600 old
    
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('val2');
  });

  it('should not clean up expired items until get() is called on them', () => {
    const cache = new TTLCache<string>(1000);
    cache.set('key1', 'val1');
    
    vi.advanceTimersByTime(2000); // Expired
    
    expect(cache.size()).toBe(1); // Still 1 because get hasn't cleaned it
    cache.get('key1'); // This will trigger cleanup
    expect(cache.size()).toBe(0); // Now 0
  });

  it('should be able to handle exactly matching TTL boundary correctly (strictly greater than is expired)', () => {
    const cache = new TTLCache<string>(1000);
    cache.set('boundary', 'test');
    vi.advanceTimersByTime(1000);
    // At exactly 1000ms offset, Date.now() === expiresAt. The logic: Date.now() > entry.expiresAt.
    // So it should still be valid.
    expect(cache.get('boundary')).toBe('test');
    
    vi.advanceTimersByTime(1);
    expect(cache.get('boundary')).toBeNull();
  });
});
