import { describe, expect, it } from 'vitest';
import { choosePresentation } from '../src/decision.js';
import type { CheckResponse, SeenState } from '../src/types.js';
import { optionalResponse } from './fixtures.js';

const unseen: SeenState = { changelogSeen: false, optionalSeen: false };

function withMode(mode: 'optional' | 'persistent' | 'required'): CheckResponse {
  return { ...optionalResponse, update: { ...optionalResponse.update!, mode } };
}

describe('dialog priority', () => {
  it.each([
    ['required', 'required'],
    ['persistent', 'persistent'],
    ['optional', 'changelog'],
  ] as const)('chooses %s response as %s', (mode, expected) => {
    expect(choosePresentation(withMode(mode), unseen)?.kind).toBe(expected);
  });

  it('shows optional after the installed changelog was seen', () => {
    expect(choosePresentation(withMode('optional'), { ...unseen, changelogSeen: true })?.kind).toBe('optional');
  });

  it('shows nothing when both one-time messages were seen', () => {
    expect(choosePresentation(withMode('optional'), { changelogSeen: true, optionalSeen: true })).toBeNull();
  });

  it('prioritizes every update and changelog combination', () => {
    const cases = [
      [withMode('required'), unseen, 'required'],
      [withMode('persistent'), unseen, 'persistent'],
      [withMode('optional'), unseen, 'changelog'],
      [withMode('optional'), { changelogSeen: true, optionalSeen: false }, 'optional'],
      [{ update: null, changelog: optionalResponse.changelog }, unseen, 'changelog'],
      [{ update: optionalResponse.update, changelog: null }, unseen, 'optional'],
      [{ update: null, changelog: null }, unseen, null],
    ] as const;
    for (const [response, seen, expected] of cases) {
      expect(choosePresentation(response, seen)?.kind ?? null).toBe(expected);
    }
  });
});
