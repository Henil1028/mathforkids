'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserSession } from '@/types';

const USER_COOKIE_KEY = 'math_master_user';

export function useUser() {
  const [user, setUserState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_COOKIE_KEY);
      if (stored) {
        setUserState(JSON.parse(stored));
      }
    } catch {
      // Invalid stored data
    }
    setLoading(false);
  }, []);

  const setUser = useCallback((userData: UserSession) => {
    localStorage.setItem(USER_COOKIE_KEY, JSON.stringify(userData));
    setUserState(userData);
  }, []);

  const clearUser = useCallback(() => {
    localStorage.removeItem(USER_COOKIE_KEY);
    setUserState(null);
  }, []);

  return { user, setUser, clearUser, loading };
}
