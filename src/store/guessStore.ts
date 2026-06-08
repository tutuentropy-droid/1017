import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GuessQuestion, UserGuessRecord, UserReward, Reward } from '@/types';
import { rewards } from '@/data/guessSongs';

interface GuessState {
  points: number;
  totalCorrect: number;
  totalAttempts: number;
  guessRecords: UserGuessRecord[];
  userRewards: UserReward[];
  userCreatedQuestions: GuessQuestion[];
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  recordGuess: (record: UserGuessRecord) => void;
  hasAnswered: (questionId: string) => boolean;
  getCorrectCount: (questionId: string) => number;
  redeemReward: (rewardId: string) => boolean;
  hasReward: (rewardId: string) => boolean;
  createQuestion: (question: GuessQuestion) => void;
  getObtainedRewards: () => Reward[];
}

export const useGuessStore = create<GuessState>()(
  persist(
    (set, get) => ({
      points: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      guessRecords: [],
      userRewards: [],
      userCreatedQuestions: [],

      addPoints: (amount: number) =>
        set((state) => ({ points: state.points + amount })),

      spendPoints: (amount: number) => {
        const state = get();
        if (state.points >= amount) {
          set({ points: state.points - amount });
          return true;
        }
        return false;
      },

      recordGuess: (record: UserGuessRecord) =>
        set((state) => ({
          guessRecords: [...state.guessRecords, record],
          totalAttempts: state.totalAttempts + 1,
          totalCorrect: record.isCorrect ? state.totalCorrect + 1 : state.totalCorrect,
        })),

      hasAnswered: (questionId: string) => {
        const state = get();
        return state.guessRecords.some((r) => r.questionId === questionId);
      },

      getCorrectCount: (questionId: string) => {
        const state = get();
        return state.guessRecords.filter((r) => r.questionId === questionId && r.isCorrect).length;
      },

      redeemReward: (rewardId: string) => {
        const state = get();
        const reward = rewards.find((r) => r.id === rewardId);
        if (!reward) return false;
        if (state.userRewards.some((ur) => ur.rewardId === rewardId)) return false;
        if (state.points < reward.cost) return false;

        set({
          points: state.points - reward.cost,
          userRewards: [
            ...state.userRewards,
            { rewardId, obtainedAt: new Date().toISOString() },
          ],
        });
        return true;
      },

      hasReward: (rewardId: string) => {
        const state = get();
        return state.userRewards.some((ur) => ur.rewardId === rewardId);
      },

      createQuestion: (question: GuessQuestion) =>
        set((state) => ({
          userCreatedQuestions: [...state.userCreatedQuestions, question],
        })),

      getObtainedRewards: () => {
        const state = get();
        return rewards.filter((r) =>
          state.userRewards.some((ur) => ur.rewardId === r.id)
        );
      },
    }),
    {
      name: 'guess-game-storage',
    }
  )
);
