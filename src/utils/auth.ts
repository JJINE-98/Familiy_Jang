import type { FamilyUser } from '../types/database';

const STORAGE_KEY = 'family-app-current-user';

export const getStoredUser = (): FamilyUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FamilyUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const storeUser = (user: FamilyUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};
