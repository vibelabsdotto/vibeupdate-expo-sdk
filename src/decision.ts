import type { CheckResponse, Presentation, SeenState } from './types.js';

export function choosePresentation(response: CheckResponse, seen: SeenState): Presentation | null {
  const update = response.update;
  if (update?.mode === 'required' || update?.mode === 'persistent') {
    return { kind: update.mode, update };
  }
  if (response.changelog !== null && !seen.changelogSeen) {
    return { kind: 'changelog', changelog: response.changelog };
  }
  if (update?.mode === 'optional' && !seen.optionalSeen) {
    return { kind: 'optional', update };
  }
  return null;
}
