import {beforeEach, describe, expect, it} from 'vitest';
import {
  STORAGE_VERSION,
  safeParse,
  readJSON,
  writeJSON,
  safeExternalUrl,
  safeFilename,
  migrateStorage,
  clearStudioData
} from './storage';

describe('storage helpers', () => {
  beforeEach(() => localStorage.clear());

  it('returns fallback for malformed JSON', () => {
    expect(safeParse('{broken', {ok:true})).toEqual({ok:true});
  });

  it('round-trips structured data', () => {
    expect(writeJSON('security-studio-test', {a:1})).toBe(true);
    expect(readJSON('security-studio-test', {})).toEqual({a:1});
  });

  it('rejects javascript URLs', () => {
    expect(safeExternalUrl('javascript:alert(1)')).toBe('');
  });

  it('accepts HTTPS URLs', () => {
    expect(safeExternalUrl('https://notes.asifnawazminhas.com/windows/')).toMatch(/^https:/);
  });

  it('sanitises generated filenames', () => {
    expect(safeFilename('../../bad <name>')).toBe('..-..-bad-name');
  });

  it('migrates storage schema', () => {
    const result = migrateStorage();
    expect(result.to).toBe(STORAGE_VERSION);
    expect(localStorage.getItem('security-studio-storage-version')).toBe(String(STORAGE_VERSION));
  });

  it('clears Studio-prefixed data without touching unrelated keys', () => {
    localStorage.setItem('security-studio-test','1');
    localStorage.setItem('other-key','2');
    clearStudioData();
    expect(localStorage.getItem('security-studio-test')).toBeNull();
    expect(localStorage.getItem('other-key')).toBe('2');
  });
});
