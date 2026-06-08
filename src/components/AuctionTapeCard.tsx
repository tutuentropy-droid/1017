import { useState, useEffect } from 'react';
import {
  Gavel,
  Clock,
  Users,
  Eye,
  Trophy,
  Sparkles,
  User,
  Crown,
  Play,
  Lock,
} from 'lucide-react';
import type { AuctionPlaylist } from '@/types';
import { useGuessStore } from '@/store/guessStore';
import { useUserStore } from '@/store/userStore';

interface Props {
  playlist: AuctionPlaylist;
  onClick: () => void;
  onBid: () => void;
}

const statusConfig = {
  active: {
    label: '竞拍中',
    badge: 'bg-vintage-brick text-vintage-paper',
    pulse: true,
  },
  upcoming: {
    label: '即将开拍',
    badge: 'bg-vintage-gold/20 text-vintage-gold border border-vintage-gold/40',
    pulse: false,
  },
  ended: {
    label: '已结拍',
    badge: 'bg-vintage-inkLight/30 text-vintage-inkLight border border-vintage-inkLight/30',
    pulse: false,
  },
};

function formatTimeRemaining(endTime: string): string {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return '已结束';

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

  if (days > 0) return `${days}天${hours}小时`;
  if (hours > 0) return `${hours}小时${minutes}分`;
  return `${minutes}分钟`;
}

function formatCountdown(startTime: string): string {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const diff = start - now;

  if (diff <= 0) return '即将开始';

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) return `${days}天后开始`;
  return `${hours}小时后开始`;
}

export default function AuctionTapeCard({ playlist, onClick, onBid }: Props) {
  const { currentUser } = useUserStore();
  const { points } = useGuessStore();
  const status = statusConfig[playlist.status];
  const isHighestBidder = playlist.currentBidderId === currentUser.id;
  const isWinner = playlist.status === 'ended' && playlist.winnerId === currentUser.id;
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="vintage-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-vintage-lg">
        <div className="relative">
          <div className="cassette-tape aspect-[16/10] relative">
            <div className="absolute inset-2 z-10 rounded">
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-full h-full object-cover rounded opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded" />
            </div>
            <div className="cassette-reel cassette-reel-left" />
            <div className="cassette-reel cassette-reel-right" />
            <div className="cassette-label flex items-center justify-center px-3">
              <div className="text-center">
                <p className="text-[10px] text-vintage-ink/60 font-bold tracking-widest">
                  {playlist.eraTag} · {playlist.year}
                </p>
              </div>
            </div>

            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${status.badge} ${
                  status.pulse ? 'animate-pulse' : ''
                }`}
              >
                {status.label}
              </span>
              {playlist.createdBy === 'system' && (
                <span className="px-2 py-1 rounded-full bg-vintage-gold/90 text-vintage-brown text-[10px] font-bold flex items-center gap-1">
                  <Crown size={10} />
                  官方出品
                </span>
              )}
            </div>

            {playlist.status === 'ended' && playlist.winnerId && (
              <div className="absolute top-3 right-3 z-20">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-vintage-gold to-vintage-goldDark text-vintage-brown text-[11px] font-bold shadow-lg">
                  <Trophy size={12} />
                  <span>已售出</span>
                </div>
              </div>
            )}

            {isWinner && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-vintage-gold/10 rounded">
                <div className="bg-vintage-gold text-vintage-brown px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 shadow-lg animate-bounce">
                  <Crown size={14} />
                  您是得主
                </div>
              </div>
            )}

            {isHighestBidder && playlist.status === 'active' && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-vintage-moss/90 text-vintage-paper px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Sparkles size={11} />
                  当前领先
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 z-20">
              <h3 className="text-vintage-paper font-bold text-lg font-serif leading-tight drop-shadow-lg line-clamp-2">
                {playlist.title}
              </h3>
              <p className="text-vintage-paper/70 text-xs mt-0.5 font-serif">
                {playlist.theme}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-vintage-brownLight/20 rounded-lg py-2 px-1">
              <p className="text-vintage-inkLight/60 text-[10px] mb-0.5">起拍价</p>
              <p className="text-vintage-gold font-bold text-sm">
                {playlist.startingPrice}
                <span className="text-[10px] ml-0.5 font-normal">积分</span>
              </p>
            </div>
            <div className="bg-vintage-brick/10 rounded-lg py-2 px-1">
              <p className="text-vintage-inkLight/60 text-[10px] mb-0.5">
                {playlist.status === 'ended' ? '成交价' : '当前价'}
              </p>
              <p className="text-vintage-brick font-bold text-base">
                {playlist.status === 'ended'
                  ? playlist.finalPrice || playlist.currentBid
                  : playlist.currentBid || playlist.startingPrice}
                <span className="text-[10px] ml-0.5 font-normal text-vintage-brick/70">积分</span>
              </p>
            </div>
            <div className="bg-vintage-brownLight/20 rounded-lg py-2 px-1">
              <p className="text-vintage-inkLight/60 text-[10px] mb-0.5">
                {playlist.status === 'upcoming' ? '开拍' : playlist.status === 'ended' ? '围观' : '剩余'}
              </p>
              <p className="text-vintage-ink font-bold text-xs">
                {playlist.status === 'upcoming'
                  ? formatCountdown(playlist.startTime)
                  : playlist.status === 'ended'
                  ? `${playlist.viewCount}`
                  : formatTimeRemaining(playlist.endTime)}
              </p>
            </div>
          </div>

          {playlist.status === 'active' && playlist.currentBidderNickname && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-vintage-gold/5 border border-vintage-gold/20">
              <img
                src={playlist.currentBidderAvatar}
                alt={playlist.currentBidderNickname}
                className="w-7 h-7 rounded-full border border-vintage-gold/40"
              />
              <div className="flex-1 min-w-0">
                <p className="text-vintage-ink text-xs font-medium truncate">
                  {playlist.currentBidderNickname}
                </p>
                <p className="text-vintage-inkLight/60 text-[10px]">
                  当前最高出价者
                </p>
              </div>
              <Gavel size={14} className="text-vintage-gold" />
            </div>
          )}

          {playlist.status === 'ended' && playlist.winnerNickname && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-gradient-to-r from-vintage-gold/15 to-vintage-gold/5 border border-vintage-gold/30">
              <div className="relative">
                <img
                  src={playlist.winnerAvatar}
                  alt={playlist.winnerNickname}
                  className="w-7 h-7 rounded-full border border-vintage-gold/60"
                />
                <Crown
                  size={12}
                  className="absolute -top-1 -right-1 text-vintage-gold"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-vintage-ink text-xs font-bold truncate">
                  {playlist.winnerNickname}
                </p>
                <p className="text-vintage-gold text-[10px] font-medium">
                  永久独占播放权
                </p>
              </div>
              <Trophy size={14} className="text-vintage-gold" />
            </div>
          )}

          <div className="flex items-center justify-between mb-3 text-xs text-vintage-inkLight/60">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users size={12} />
                {playlist.bidHistory.length || 0}次竞价
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {playlist.viewCount}
              </span>
            </div>
            <span className="flex items-center gap-1">
              {playlist.songIds.length}
              <Play size={12} />
            </span>
          </div>

          {playlist.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBid();
              }}
              className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                points >= playlist.currentBid + playlist.minBidIncrement
                  ? 'bg-gradient-to-r from-vintage-brick to-vintage-brick/80 text-vintage-paper hover:from-vintage-brickLight hover:to-vintage-brick shadow-md'
                  : 'bg-vintage-inkLight/10 text-vintage-inkLight/50 cursor-not-allowed'
              }`}
              disabled={points < playlist.currentBid + playlist.minBidIncrement}
            >
              <Gavel size={15} />
              {points < playlist.currentBid + playlist.minBidIncrement
                ? '积分不足'
                : '立即出价'}
            </button>
          )}

          {playlist.status === 'upcoming' && (
            <button
              className="w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 bg-vintage-gold/15 text-vintage-gold border border-vintage-gold/30"
              disabled
            >
              <Clock size={15} />
              等待开拍
            </button>
          )}

          {playlist.status === 'ended' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                isWinner
                  ? 'bg-gradient-to-r from-vintage-gold to-vintage-goldDark text-vintage-brown hover:shadow-md'
                  : 'bg-vintage-inkLight/10 text-vintage-inkLight/70 border border-vintage-inkLight/20'
              }`}
            >
              {isWinner ? (
                <>
                  <Play size={15} />
                  播放我的歌单
                </>
              ) : (
                <>
                  <Lock size={15} />
                  查看曲目
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
