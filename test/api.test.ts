import { describe, expect, it, vi } from 'vitest';
import { checkApi } from '../src/api.js';
import type { StorageAdapter } from '../src/types.js';
import { metadata, optionalResponse } from './fixtures.js';

function memoryStorage(initial: Record<string, string> = {}): StorageAdapter & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => { data.set(key, value); },
    removeItem: async (key) => { data.delete(key); },
  };
}

describe('SDK API client', () => {
  it('sends metadata, saves ETag and validates a successful response', async () => {
    const storage = memoryStorage();
    const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      void input;
      void init;
      return new Response(JSON.stringify(optionalResponse), {
        status: 200,
        headers: { ETag: '"v1"', 'Content-Type': 'application/json' },
      });
    });
    const result = await checkApi({ appId: 'app_x', apiUrl: 'https://api.vibeupdate.app', timeoutMs: 3000, metadata, storage, fetcher });
    expect(result?.response).toEqual(optionalResponse);
    expect(result?.fromCache).toBe(false);
    const url = new URL(String(fetcher.mock.calls[0]?.[0]));
    expect(url.pathname).toBe('/api/v1/sdk/apps/app_x/check');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      platform: 'ios', nativeApplicationId: 'com.example.app', buildNumber: '41', version: '1.4.1', locale: 'de-DE',
    });
    expect([...storage.data.values()].some((value) => value.includes('"etag":"\\"v1\\""'))).toBe(true);
  });

  it('uses If-None-Match and treats 304 plus cached response as current success', async () => {
    const storage = memoryStorage();
    const first = vi.fn(async () => new Response(JSON.stringify(optionalResponse), { status: 200, headers: { ETag: 'abc' } }));
    await checkApi({ appId: 'app_x', apiUrl: 'https://api.vibeupdate.app', timeoutMs: 3000, metadata, storage, fetcher: first });
    const second = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('If-None-Match')).toBe('abc');
      return new Response(null, { status: 304 });
    });
    const result = await checkApi({ appId: 'app_x', apiUrl: 'https://api.vibeupdate.app', timeoutMs: 3000, metadata, storage, fetcher: second });
    expect(result).toMatchObject({ response: optionalResponse, fromCache: true });
  });

  it('times out through AbortController and fails open', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    const pending = checkApi({ appId: 'app_x', apiUrl: 'https://api.vibeupdate.app', timeoutMs: 20, metadata, storage: memoryStorage(), fetcher });
    await vi.advanceTimersByTimeAsync(20);
    await expect(pending).resolves.toBeNull();
    vi.useRealTimers();
  });

  it.each([500, 503])('never activates cached Required on HTTP %s', async (status) => {
    const storage = memoryStorage();
    const required = { ...optionalResponse, update: { ...optionalResponse.update!, mode: 'required' as const } };
    await checkApi({ appId: 'app_x', apiUrl: 'https://api.vibeupdate.app', timeoutMs: 3000, metadata, storage, fetcher: async () => new Response(JSON.stringify(required), { status: 200, headers: { ETag: 'required' } }) });
    const result = await checkApi({ appId: 'app_x', apiUrl: 'https://api.vibeupdate.app', timeoutMs: 3000, metadata, storage, fetcher: async () => new Response(null, { status }) });
    expect(result).toBeNull();
  });

  it('fails open for network errors, invalid JSON and invalid responses', async () => {
    const fetchers = [
      async () => { throw new TypeError('offline'); },
      async () => new Response('{', { status: 200 }),
      async () => new Response(JSON.stringify({ update: { mode: 'required', storeUrl: 'http://bad.test' }, changelog: null }), { status: 200 }),
    ];
    for (const fetcher of fetchers) {
      await expect(checkApi({ appId: 'app_x', apiUrl: 'https://api.vibeupdate.app', timeoutMs: 3000, metadata, storage: memoryStorage(), fetcher })).resolves.toBeNull();
    }
  });
});
