import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { defaultUser } from '@/data/users';

interface UserState {
  currentUser: User;
  setUser: (user: User) => void;
  updateNickname: (nickname: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: defaultUser,
      setUser: (user) => set({ currentUser: user }),
      updateNickname: (nickname) =>
        set((state) => ({
          currentUser: { ...state.currentUser, nickname },
        })),
    }),
    {
      name: 'memory-user-storage',
    }
  )
);
