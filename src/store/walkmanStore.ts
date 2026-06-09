import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Song, UserReward } from '@/types';
import { walkmanRewards } from '@/data/walkmanRewards';

export interface WalkmanReward {
  id: string;
  name: string;
  type: 'sticker' | 'tape-cover' | 'badge';
  description: string;
  cost: number;
  emoji?: string;
  imageUrl?: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface WalkmanState {
  tapeMileage: number;
  totalPlayTime: number;
  flipCount: number;
  volumeAdjustCount: number;
  operationCount: number;
  isPlaying: boolean;
  currentSide: 'A' | 'B';
  volume: number;
  currentSongIndex: number;
  playlist: Song[];
  userRewards: UserReward[];
  unlockedStickers: string[];
  unlockedCovers: string[];
  addMileage: (amount: number) => void;
  incrementFlip: () => void;
  incrementVolume: () => void;
  incrementOperation: () => void;
  setPlaying: (playing: boolean) => void;
  toggleSide: () => void;
  setVolume: (volume: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  setPlaylist: (songs: Song[]) => void;
  redeemReward: (rewardId: string) => boolean;
  hasReward: (rewardId: string) => boolean;
  getObtainedRewards: () => WalkmanReward[];
  resetStats: () => void;
}

export const useWalkmanStore = create<WalkmanState>()(
  persist(
    (set, get) => ({
      tapeMileage: 0,
      totalPlayTime: 0,
      flipCount: 0,
      volumeAdjustCount: 0,
      operationCount: 0,
      isPlaying: false,
      currentSide: 'A',
      volume: 60,
      currentSongIndex: 0,
      playlist: [],
      userRewards: [],
      unlockedStickers: [],
      unlockedCovers: [],

      addMileage: (amount: number) =>
        set((state) => ({ tapeMileage: state.tapeMileage + amount })),

      incrementFlip: () =>
        set((state) => ({
          flipCount: state.flipCount + 1,
          operationCount: state.operationCount + 1,
          tapeMileage: state.tapeMileage + 5,
        })),

      incrementVolume: () =>
        set((state) => ({
          volumeAdjustCount: state.volumeAdjustCount + 1,
          operationCount: state.operationCount + 1,
          tapeMileage: state.tapeMileage + 1,
        })),

      incrementOperation: () =>
        set((state) => ({
          operationCount: state.operationCount + 1,
          tapeMileage: state.tapeMileage + 2,
        })),

      setPlaying: (playing: boolean) =>
        set((state) => ({
          isPlaying: playing,
          operationCount: state.operationCount + 1,
          tapeMileage: state.tapeMileage + (playing ? 3 : 1),
        })),

      toggleSide: () =>
        set((state) => ({
          currentSide: state.currentSide === 'A' ? 'B' : 'A',
          flipCount: state.flipCount + 1,
          operationCount: state.operationCount + 1,
          tapeMileage: state.tapeMileage + 8,
        })),

      setVolume: (volume: number) =>
        set((state) => ({
          volume: Math.max(0, Math.min(100, volume)),
          volumeAdjustCount: state.volumeAdjustCount + 1,
          operationCount: state.operationCount + 1,
          tapeMileage: state.tapeMileage + 1,
        })),

      nextSong: () =>
        set((state) => {
          const next =
            state.playlist.length > 0
              ? (state.currentSongIndex + 1) % state.playlist.length
              : 0;
          return {
            currentSongIndex: next,
            operationCount: state.operationCount + 1,
            tapeMileage: state.tapeMileage + 4,
          };
        }),

      prevSong: () =>
        set((state) => {
          const prev =
            state.playlist.length > 0
              ? (state.currentSongIndex - 1 + state.playlist.length) %
                state.playlist.length
              : 0;
          return {
            currentSongIndex: prev,
            operationCount: state.operationCount + 1,
            tapeMileage: state.tapeMileage + 4,
          };
        }),

      setPlaylist: (songs: Song[]) =>
        set({ playlist: songs, currentSongIndex: 0 }),

      redeemReward: (rewardId: string) => {
        const state = get();
        const reward = walkmanRewards.find((r) => r.id === rewardId);
        if (!reward) return false;
        if (state.userRewards.some((ur) => ur.rewardId === rewardId)) return false;
        if (state.tapeMileage < reward.cost) return false;

        const newStickers =
          reward.type === 'sticker'
            ? [...state.unlockedStickers, rewardId]
            : state.unlockedStickers;
        const newCovers =
          reward.type === 'tape-cover'
            ? [...state.unlockedCovers, rewardId]
            : state.unlockedCovers;

        set({
          tapeMileage: state.tapeMileage - reward.cost,
          userRewards: [
            ...state.userRewards,
            { rewardId, obtainedAt: new Date().toISOString() },
          ],
          unlockedStickers: newStickers,
          unlockedCovers: newCovers,
        });
        return true;
      },

      hasReward: (rewardId: string) => {
        const state = get();
        return state.userRewards.some((ur) => ur.rewardId === rewardId);
      },

      getObtainedRewards: () => {
        const state = get();
        return walkmanRewards.filter((r) =>
          state.userRewards.some((ur) => ur.rewardId === r.id)
        );
      },

      resetStats: () =>
        set({
          tapeMileage: 0,
          totalPlayTime: 0,
          flipCount: 0,
          volumeAdjustCount: 0,
          operationCount: 0,
        }),
    }),
    {
      name: 'walkman-storage',
    }
  )
);
