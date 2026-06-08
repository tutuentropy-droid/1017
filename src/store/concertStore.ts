import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DanmakuMessage, GiftEffect, ConcertMemory, GiftType } from '@/types';
import { mockDanmakus, mockMemories, generateRandomDanmaku } from '@/data/concerts';
import { useGuessStore } from '@/store/guessStore';
import { useUserStore } from '@/store/userStore';

interface GiftRanking {
  userId: string;
  userNickname: string;
  userAvatar: string;
  totalWeight: number;
  giftCount: number;
}

interface ConcertState {
  danmakus: DanmakuMessage[];
  giftEffects: GiftEffect[];
  memories: ConcertMemory[];
  giftRankings: GiftRanking[];
  onlineCount: number;
  userDanmakuColor: string;
  danmakuEnabled: boolean;
  addDanmaku: (content: string) => void;
  addGift: (giftType: GiftType, giftEmoji: string, giftName: string, cost: number, weight: number) => boolean;
  addMemory: (content: string) => void;
  likeMemory: (memoryId: string) => void;
  setUserDanmakuColor: (color: string) => void;
  toggleDanmaku: () => void;
  incrementOnline: () => void;
  spawnRandomDanmaku: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const DANMAKU_COLORS = [
  '#F5E6C8',
  '#D4AF37',
  '#E8C96A',
  '#D46233',
  '#4A6B5A',
  '#FFFFFF',
];

export const useConcertStore = create<ConcertState>()(
  persist(
    (set, get) => ({
      danmakus: [...mockDanmakus],
      giftEffects: [],
      memories: [...mockMemories],
      giftRankings: [
        {
          userId: 'u100',
          userNickname: '永远的家驹',
          userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=King&backgroundColor=F5E6C8',
          totalWeight: 3280,
          giftCount: 56,
        },
        {
          userId: 'u101',
          userNickname: '海阔天空',
          userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Queen&backgroundColor=E8D4A8',
          totalWeight: 2150,
          giftCount: 38,
        },
        {
          userId: 'u102',
          userNickname: '光辉岁月',
          userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Prince&backgroundColor=F5E6C8',
          totalWeight: 1580,
          giftCount: 28,
        },
        {
          userId: 'u103',
          userNickname: '摇滚不死',
          userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rocker&backgroundColor=E8D4A8',
          totalWeight: 980,
          giftCount: 22,
        },
        {
          userId: 'u104',
          userNickname: '青春不散',
          userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Youth&backgroundColor=F5E6C8',
          totalWeight: 680,
          giftCount: 15,
        },
      ],
      onlineCount: 2847,
      userDanmakuColor: DANMAKU_COLORS[0],
      danmakuEnabled: true,

      addDanmaku: (content: string) => {
        const { currentUser } = useUserStore.getState();
        const newDanmaku: DanmakuMessage = {
          id: generateId(),
          userId: currentUser.id,
          userNickname: currentUser.nickname,
          content,
          color: get().userDanmakuColor,
          timestamp: Date.now(),
        };
        set((state) => ({
          danmakus: [...state.danmakus.slice(-50), newDanmaku],
        }));
      },

      addGift: (giftType, giftEmoji, giftName, cost, weight) => {
        const { spendPoints } = useGuessStore.getState();
        const { currentUser } = useUserStore.getState();

        if (!spendPoints(cost)) {
          return false;
        }

        const effect: GiftEffect = {
          id: generateId(),
          userId: currentUser.id,
          userNickname: currentUser.nickname,
          giftType,
          giftEmoji,
          giftName,
          timestamp: Date.now(),
        };

        set((state) => {
          const existingRanking = state.giftRankings.find((r) => r.userId === currentUser.id);
          let newRankings: GiftRanking[];
          if (existingRanking) {
            newRankings = state.giftRankings
              .map((r) =>
                r.userId === currentUser.id
                  ? {
                      ...r,
                      totalWeight: r.totalWeight + weight,
                      giftCount: r.giftCount + 1,
                    }
                  : r
              )
              .sort((a, b) => b.totalWeight - a.totalWeight);
          } else {
            newRankings = [
              ...state.giftRankings,
              {
                userId: currentUser.id,
                userNickname: currentUser.nickname,
                userAvatar: currentUser.avatar,
                totalWeight: weight,
                giftCount: 1,
              },
            ].sort((a, b) => b.totalWeight - a.totalWeight);
          }

          return {
            giftEffects: [...state.giftEffects.slice(-20), effect],
            giftRankings: newRankings,
          };
        });

        return true;
      },

      addMemory: (content: string) => {
        const { currentUser } = useUserStore.getState();
        const newMemory: ConcertMemory = {
          id: generateId(),
          userId: currentUser.id,
          userNickname: currentUser.nickname,
          userAvatar: currentUser.avatar,
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        set((state) => ({
          memories: [newMemory, ...state.memories],
        }));
      },

      likeMemory: (memoryId: string) => {
        set((state) => ({
          memories: state.memories.map((m) =>
            m.id === memoryId ? { ...m, likes: m.likes + 1 } : m
          ),
        }));
      },

      setUserDanmakuColor: (color: string) => set({ userDanmakuColor: color }),
      toggleDanmaku: () => set((state) => ({ danmakuEnabled: !state.danmakuEnabled })),
      incrementOnline: () => set((state) => ({ onlineCount: state.onlineCount + Math.floor(Math.random() * 3) })),

      spawnRandomDanmaku: () => {
        const random = generateRandomDanmaku();
        random.color = DANMAKU_COLORS[Math.floor(Math.random() * DANMAKU_COLORS.length)];
        set((state) => ({
          danmakus: [...state.danmakus.slice(-50), random],
        }));
      },
    }),
    {
      name: 'concert-hall-storage',
      partialize: (state) => ({
        memories: state.memories,
        giftRankings: state.giftRankings,
        userDanmakuColor: state.userDanmakuColor,
      }),
    }
  )
);

export { DANMAKU_COLORS };
