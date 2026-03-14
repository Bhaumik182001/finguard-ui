import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Initialize to true if a token exists in local storage on first load
  isAuthenticated: !!localStorage.getItem('finguard_token'),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('finguard_token');
    set({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  },
}));