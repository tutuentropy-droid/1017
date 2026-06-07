import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Collection } from '@/types';

interface CollectionState {
  collections: Collection[];
  addCollection: (userId: string, songId: string) => void;
  removeCollection: (userId: string, songId: string) => void;
  isCollected: (userId: string, songId: string) => boolean;
  getUserCollections: (userId: string) => Collection[];
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collections: [],
      addCollection: (userId, songId) => {
        const exists = get().collections.find(
          (c) => c.userId === userId && c.songId === songId
        );
        if (exists) return;
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: `col-${Date.now()}`,
              userId,
              songId,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },
      removeCollection: (userId, songId) =>
        set((state) => ({
          collections: state.collections.filter(
            (c) => !(c.userId === userId && c.songId === songId)
          ),
        })),
      isCollected: (userId, songId) =>
        get().collections.some(
          (c) => c.userId === userId && c.songId === songId
        ),
      getUserCollections: (userId) =>
        get().collections.filter((c) => c.userId === userId),
    }),
    {
      name: 'memory-collection-storage',
    }
  )
);
