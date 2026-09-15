export const STORAGE_VERSION = 100;

export const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const readJSON = (key, fallback) => {
  try {
    return safeParse(localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const readText = (key, fallback = '') => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeText = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
};

export const removeKey = key => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const safeExternalUrl = value => {
  if (!value) return '';
  try {
    const u = new URL(value, location.origin);
    return ['https:', 'http:'].includes(u.protocol) ? u.href : '';
  } catch {
    return '';
  }
};

export const safeFilename = (value, fallback = 'security-studio') => {
  const cleaned = String(value ?? '')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
  return cleaned || fallback;
};

const migrations = {
  100: () => {
    // v2.6 central schema marker. Earlier v2.x data is intentionally retained.
    writeText('security-studio-storage-version', String(STORAGE_VERSION));
  }
};

export const migrateStorage = () => {
  const current = Number(readText('security-studio-storage-version', '0')) || 0;
  if (current >= STORAGE_VERSION) return { from: current, to: current, migrated: false };

  for (let version = current + 1; version <= STORAGE_VERSION; version += 1) {
    if (migrations[version]) migrations[version]();
  }

  writeText('security-studio-storage-version', String(STORAGE_VERSION));
  return { from: current, to: STORAGE_VERSION, migrated: true };
};

export const clearStudioData = () => {
  const prefix = 'security-studio-';
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(prefix))
      .forEach(key => localStorage.removeItem(key));
    writeText('security-studio-storage-version', String(STORAGE_VERSION));
    return true;
  } catch {
    return false;
  }
};
