import type { PlatformName, PresentationKind, SeenState, StorageAdapter } from './types.js';

const PREFIX = '@vibelabsdotto/vibeupdate:v1';

export interface StorageKeys {
  cache: string;
  lastSuccess: string;
  changelogSeen: string;
  optionalSeen: string;
}

export function createStorageKeys(
  appId: string,
  platform: PlatformName,
  installedBuild: number,
  targetBuild: number,
): StorageKeys {
  const scope = `${PREFIX}:${encodeURIComponent(appId)}:${platform}`;
  return {
    cache: `${scope}:check-cache`,
    lastSuccess: `${scope}:last-success`,
    changelogSeen: `${scope}:changelog:${installedBuild}`,
    optionalSeen: `${scope}:optional:${targetBuild}`,
  };
}

export async function getSeenState(storage: StorageAdapter, keys: StorageKeys): Promise<SeenState> {
  const [changelog, optional] = await Promise.all([
    storage.getItem(keys.changelogSeen),
    storage.getItem(keys.optionalSeen),
  ]);
  return { changelogSeen: changelog === '1', optionalSeen: optional === '1' };
}

export async function markPresentationSeen(
  storage: StorageAdapter,
  keys: StorageKeys,
  kind: PresentationKind,
): Promise<void> {
  if (kind === 'changelog') {
    await storage.setItem(keys.changelogSeen, '1');
  } else if (kind === 'optional') {
    await storage.setItem(keys.optionalSeen, '1');
  }
}
