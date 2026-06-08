import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuctionPlaylist, AuctionBid, UserAuctionRecord } from '@/types';
import { auctionPlaylists } from '@/data/auctionPlaylists';
import { useGuessStore } from './guessStore';
import { useUserStore } from './userStore';

const generateBidId = () => Math.random().toString(36).substring(2, 11);

interface AuctionState {
  playlists: AuctionPlaylist[];
  userRecords: Record<string, UserAuctionRecord>;
  getPlaylist: (id: string) => AuctionPlaylist | undefined;
  placeBid: (playlistId: string, amount: number) => {
    success: boolean;
    message: string;
  };
  isWinner: (playlistId: string, userId: string) => boolean;
  canAccessFullPlaylist: (playlistId: string, userId: string) => boolean;
  getWonPlaylists: (userId: string) => AuctionPlaylist[];
  incrementViewCount: (playlistId: string) => void;
}

export const useAuctionStore = create<AuctionState>()(
  persist(
    (set, get) => ({
      playlists: auctionPlaylists,
      userRecords: {},

      getPlaylist: (id: string) => get().playlists.find((p) => p.id === id),

      placeBid: (playlistId: string, amount: number) => {
        const state = get();
        const playlist = state.playlists.find((p) => p.id === playlistId);
        const { currentUser } = useUserStore.getState();

        if (!playlist) {
          return { success: false, message: '拍卖不存在' };
        }
        if (playlist.status !== 'active') {
          return { success: false, message: '该拍卖已结束或尚未开始' };
        }

        const minRequired =
          (playlist.currentBid || playlist.startingPrice) + playlist.minBidIncrement;
        if (amount < minRequired) {
          return {
            success: false,
            message: `出价必须至少为 ${minRequired} 积分`,
          };
        }

        const { spendPoints } = useGuessStore.getState();
        if (!spendPoints(amount)) {
          return { success: false, message: '积分不足，请先答题赚取更多积分' };
        }

        if (playlist.currentBidderId) {
          const refundAmount = playlist.currentBid;
          useGuessStore.getState().addPoints(refundAmount);
        }

        const newBid: AuctionBid = {
          id: generateBidId(),
          userId: currentUser.id,
          userNickname: currentUser.nickname,
          userAvatar: currentUser.avatar,
          amount,
          bidAt: new Date().toISOString(),
        };

        set((prev) => {
          const updatedPlaylists = prev.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  currentBid: amount,
                  currentBidderId: currentUser.id,
                  currentBidderNickname: currentUser.nickname,
                  currentBidderAvatar: currentUser.avatar,
                  bidHistory: [newBid, ...p.bidHistory],
                }
              : p
          );

          const prevRecord = prev.userRecords[playlistId];
          const updatedRecords = {
            ...prev.userRecords,
            [playlistId]: {
              playlistId,
              isWinner: prevRecord?.isWinner || false,
              bids: prevRecord ? [newBid, ...prevRecord.bids] : [newBid],
            },
          };

          return { playlists: updatedPlaylists, userRecords: updatedRecords };
        });

        return { success: true, message: `出价 ${amount} 积分成功！` };
      },

      isWinner: (playlistId: string, userId: string) => {
        const playlist = get().playlists.find((p) => p.id === playlistId);
        if (!playlist) return false;
        if (playlist.status === 'ended') {
          return playlist.winnerId === userId;
        }
        return playlist.currentBidderId === userId;
      },

      canAccessFullPlaylist: (playlistId: string, userId: string) => {
        const playlist = get().playlists.find((p) => p.id === playlistId);
        if (!playlist) return false;
        if (playlist.status !== 'ended') {
          return playlist.currentBidderId === userId;
        }
        return playlist.winnerId === userId;
      },

      getWonPlaylists: (userId: string) =>
        get().playlists.filter(
          (p) => p.status === 'ended' && p.winnerId === userId
        ),

      incrementViewCount: (playlistId: string) =>
        set((prev) => ({
          playlists: prev.playlists.map((p) =>
            p.id === playlistId ? { ...p, viewCount: p.viewCount + 1 } : p
          ),
        })),
    }),
    {
      name: 'auction-storage',
    }
  )
);
