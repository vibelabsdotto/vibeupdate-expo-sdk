import { describe, expect, it } from 'vitest';
import { createStorageKeys, getSeenState, markPresentationSeen } from '../src/storage.js';
import type { StorageAdapter } from '../src/types.js';
import { optionalResponse } from './fixtures.js';

function memoryStorage(): StorageAdapter & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => { data.set(key, value); },
    removeItem: async (key) => { data.delete(key); },
  };
}

describe('namespaced seen storage', () => {
  it('scopes keys by schema, app, platform, installed and target build', () => {
    expect(createStorageKeys('app/a', 'ios', 41, 42)).toEqual({
      cache: '@vibelabsdotto/vibeupdate:v1:app%2Fa:ios:check-cache',
      lastSuccess: '@vibelabsdotto/vibeupdate:v1:app%2Fa:ios:last-success',
      changelogSeen: '@vibelabsdotto/vibeupdate:v1:app%2Fa:ios:changelog:41',
      optionalSeen: '@vibelabsdotto/vibeupdate:v1:app%2Fa:ios:optional:42',
    });
  });

  it('shows changelog and optional only once, but never persists persistent or required', async () => {
    const storage = memoryStorage();
    const keys = createStorageKeys('app_x', 'ios', 41, 42);
    await markPresentationSeen(storage, keys, 'changelog');
    expect(await getSeenState(storage, keys)).toEqual({ changelogSeen: true, optionalSeen: false });
    await markPresentationSeen(storage, keys, 'optional');
    await markPresentationSeen(storage, keys, 'persistent');
    await markPresentationSeen(storage, keys, 'required');
    expect(await getSeenState(storage, keys)).toEqual({ changelogSeen: true, optionalSeen: true });
    expect(storage.data.size).toBe(2);
    expect(optionalResponse.update?.targetBuildNumber).toBe(42);
  });
});
