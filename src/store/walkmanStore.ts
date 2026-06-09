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
  currentSongIndexA: number;
  currentSongIndexB: number;
  playlistA: Song[];
  playlistB: Song[];
  activeCoverId: string | null;
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
  setPlaylists: (songsA: Song[], songsB: Song[]) => void;
  setActiveCover: (coverId: string | null) => void;
  getActiveCover: () => WalkmanReward | null;
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
      currentSongIndexA: 0,
      currentSongIndexB: 0,
      playlistA: [],
      playlistB: [],
      activeCoverId: null,
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
          const side = state.currentSide;
          const playlist = side === 'A' ? state.playlistA : state.playlistB;
          const idxKey =
            side === 'A' ? 'currentSongIndexA' : 'currentSongIndexB';
          const currentIdx = side === 'A' ? state.currentSongIndexA : state.currentSongIndexB;
          const next =
            playlist.length > 0 ? (currentIdx + 1) % playlist.length : 0;
          return {
            [idxKey]: next,
            operationCount: state.operationCount + 1,
            tapeMileage: state.tapeMileage + 4,
          } as Partial<WalkmanState>;
        }),

      prevSong: () =>
        set((state) => {
          const side = state.currentSide;
          const playlist = side === 'A' ? state.playlistA : state.playlistB;
          const idxKey =
            side === 'A' ? 'currentSongIndexA' : 'currentSongIndexB';
          const currentIdx = side === 'A' ? state.currentSongIndexA : state.currentSongIndexB;
          const prev =
            playlist.length > 0
              ? (currentIdx - 1 + playlist.length) % playlist.length
              : 0;
          return {
            [idxKey]: prev,
            operationCount: state.operationCount + 1,
            tapeMileage: state.tapeMileage + 4,
          } as Partial<WalkmanState>;
        }),

      setPlaylists: (songsA: Song[], songsB: Song[]) =>
        set({
          playlistA: songsA,
          playlistB: songsB,
          currentSongIndexA: 0,
          currentSongIndexB: 0,
        }),

      setActiveCover: (coverId: string | null) => {
        if (coverId === null) {
          set({ activeCoverId: null });
          return;
        }
        const state = get();
        if (!state.unlockedCovers.includes(coverId)) return;
        set({ activeCoverId: coverId });
      },

      getActiveCover: () => {
        const state = get();
        if (!state.activeCoverId) return null;
        return walkmanRewards.find((r) => r.id === state.activeCoverId) || null;
      },

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
        const newActiveCover =
          reward.type === 'tape-cover' && state.unlockedCovers.length === 0
            ? rewardId
            : state.activeCoverId;

        set({
          tapeMileage: state.tapeMileage - reward.cost,
          userRewards: [
            ...state.userRewards,
            { rewardId, obtainedAt: new Date().toISOString() },
          ],
          unlockedStickers: newStickers,
          unlockedCovers: newCovers,
          activeCoverId: newActiveCover,
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
      name: 'walkman-storage-v2',
    }
  )
);
