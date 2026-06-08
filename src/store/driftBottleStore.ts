import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DriftBottle, BottleBadge, DriftBottleStats } from '@/types';
import {
  mockDriftBottles,
  FRIEND_BADGE,
  createBottle as createBottleData,
  createReply as createReplyData,
} from '@/data/driftBottles';

interface DriftBottleState {
  bottles: DriftBottle[];
  sentBottleIds: string[];
  receivedBottleIds: string[];
  badges: BottleBadge[];

  sendBottle: (
    userId: string,
    nickname: string,
    avatar: string,
    lyric: string,
    story: string,
    songTitle?: string,
    songArtist?: string
  ) => DriftBottle;

  receiveRandomBottle: (userId: string) => DriftBottle | null;

  replyToBottle: (
    bottleId: string,
    userId: string,
    nickname: string,
    avatar: string,
    lyric: string,
    story: string,
    songTitle?: string,
    songArtist?: string
  ) => boolean;

  getSentBottles: (userId: string) => DriftBottle[];

  getReceivedBottles: (userId: string) => DriftBottle[];

  getStats: (userId: string) => DriftBottleStats;

  hasBadge: (userId: string, badgeId: string) => boolean;
}

export const useDriftBottleStore = create<DriftBottleState>()(
  persist(
    (set, get) => ({
      bottles: mockDriftBottles,
      sentBottleIds: [],
      receivedBottleIds: [],
      badges: [],

      sendBottle: (userId, nickname, avatar, lyric, story, songTitle, songArtist) => {
        const newBottle = createBottleData(
          userId,
          nickname,
          avatar,
          lyric,
          story,
          songTitle,
          songArtist
        );
        set((state) => ({
          bottles: [newBottle, ...state.bottles],
          sentBottleIds: [newBottle.id, ...state.sentBottleIds],
        }));
        return newBottle;
      },

      receiveRandomBottle: (userId) => {
        const available = get().bottles.filter(
          (b) =>
            b.status === 'floating' &&
            b.senderId !== userId &&
            !get().receivedBottleIds.includes(b.id)
        );
        if (available.length === 0) return null;
        const randomBottle = available[Math.floor(Math.random() * available.length)];
        set((state) => ({
          bottles: state.bottles.map((b) =>
            b.id === randomBottle.id
              ? { ...b, receiverId: userId, status: 'received' }
              : b
          ),
          receivedBottleIds: [randomBottle.id, ...state.receivedBottleIds],
        }));
        return { ...randomBottle, receiverId: userId, status: 'received' };
      },

      replyToBottle: (
        bottleId, userId, nickname, avatar, lyric, story, songTitle, songArtist
      ) => {
        const bottle = get().bottles.find((b) => b.id === bottleId);
        if (!bottle || bottle.status === 'replied') return false;

        const reply = createReplyData(
          bottleId, userId, nickname, avatar, lyric, story, songTitle, songArtist
        );

        const hasBadge = get().badges.some((b) => b.id === FRIEND_BADGE.id);

        set((state) => ({
          bottles: state.bottles.map((b) =>
            b.id === bottleId ? { ...b, reply, status: 'replied' } : b
          ),
          badges: hasBadge
            ? state.badges
            : [
                ...state.badges,
                { ...FRIEND_BADGE, obtainedAt: new Date().toISOString() },
              ],
        }));
        return true;
      },

      getSentBottles: (userId) => {
        return get()
          .bottles.filter((b) => b.senderId === userId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },

      getReceivedBottles: (userId) => {
        return get()
          .bottles.filter((b) => b.receiverId === userId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },

      getStats: (userId) => {
        const sent = get().getSentBottles(userId);
        const received = get().getReceivedBottles(userId);
        const replied = received.filter((b) => b.status === 'replied');
        return {
          sentCount: sent.length,
          receivedCount: received.length,
          repliedCount: replied.length,
          badges: get().badges,
        };
      },

      hasBadge: (_userId, badgeId) => {
        return get().badges.some((b) => b.id === badgeId);
      },
    }),
    {
      name: 'memory-drift-bottle-storage',
      partialize: (state) => ({
        bottles: state.bottles,
        sentBottleIds: state.sentBottleIds,
        receivedBottleIds: state.receivedBottleIds,
        badges: state.badges,
      }),
    }
  )
);
