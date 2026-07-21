import * as Application from 'expo-application';
import { getLocales } from 'expo-localization';
import { Platform } from 'react-native';
import type { RuntimeMetadata, VibeUpdateError } from './types.js';

function invalid(message: string, onError?: (error: VibeUpdateError) => void): null {
  const error: VibeUpdateError = { code: 'invalid-metadata', message };
  if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn(`[VibeUpdate] ${message}`);
  try { onError?.(error); } catch { /* Host callbacks must not break fail-open behavior. */ }
  return null;
}

export function getRuntimeMetadata(
  localeOverride?: string,
  onError?: (error: VibeUpdateError) => void,
): RuntimeMetadata | null {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return invalid(`Unsupported platform: ${Platform.OS}. Only iOS and Android are supported.`, onError);
  }
  const applicationId = Application.applicationId?.trim();
  const version = Application.nativeApplicationVersion?.trim();
  const rawBuild = Application.nativeBuildVersion?.trim();
  const buildNumber = rawBuild === undefined ? Number.NaN : Number(rawBuild);
  const locale = localeOverride?.trim() || getLocales()[0]?.languageTag?.trim();
  if (!applicationId) return invalid('expo-application did not provide an applicationId.', onError);
  if (!version) return invalid('expo-application did not provide a native application version.', onError);
  if (!Number.isSafeInteger(buildNumber) || buildNumber <= 0) return invalid('The native build version must be a positive integer.', onError);
  if (!locale) return invalid('expo-localization did not provide a device locale.', onError);
  return { platform: Platform.OS, nativeApplicationId: applicationId, buildNumber, version, locale };
}
