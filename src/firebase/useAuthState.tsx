import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/config';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: Error | null;
};

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setState({ user, loading: false, error: null });
      },
      (error) => {
        setState({ user: null, loading: false, error });
        console.error('Auth error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  return state;
};