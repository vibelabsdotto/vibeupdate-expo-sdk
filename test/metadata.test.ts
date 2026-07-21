import { beforeEach, describe, expect, it, vi } from 'vitest';

const application = vi.hoisted(() => ({
  applicationId: 'com.example.app' as string | null,
  nativeApplicationVersion: '1.2.3' as string | null,
  nativeBuildVersion: '123' as string | null,
}));
const platform = vi.hoisted(() => ({ OS: 'ios' }));
const locales = vi.hoisted(() => [{ languageTag: 'de-DE' }]);

vi.mock('expo-application', () => application);
vi.mock('expo-localization', () => ({ getLocales: () => locales }));
vi.mock('react-native', () => ({ Platform: platform }));

describe('runtime metadata', () => {
  beforeEach(() => {
    application.applicationId = 'com.example.app';
    application.nativeApplicationVersion = '1.2.3';
    application.nativeBuildVersion = '123';
    platform.OS = 'ios';
    locales[0] = { languageTag: 'de-DE' };
  });

  it('reads Expo Application, React Native platform and device locale', async () => {
    const { getRuntimeMetadata } = await import('../src/metadata.js');
    expect(getRuntimeMetadata()).toEqual({
      platform: 'ios', nativeApplicationId: 'com.example.app', buildNumber: 123, version: '1.2.3', locale: 'de-DE',
    });
  });

  it.each([
    ['missing application id', () => { application.applicationId = null; }],
    ['invalid build', () => { application.nativeBuildVersion = 'abc'; }],
    ['unsupported platform', () => { platform.OS = 'web'; }],
  ])('fails open and reports %s', async (_name, mutate) => {
    mutate();
    const onError = vi.fn();
    const { getRuntimeMetadata } = await import('../src/metadata.js');
    expect(getRuntimeMetadata(undefined, onError)).toBeNull();
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'invalid-metadata' }));
  });

  it('lets a locale override win', async () => {
    const { getRuntimeMetadata } = await import('../src/metadata.js');
    expect(getRuntimeMetadata('fr-CA')?.locale).toBe('fr-CA');
  });
});
