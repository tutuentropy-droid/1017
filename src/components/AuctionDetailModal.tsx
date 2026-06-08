import { useState } from 'react';
import {
  X,
  Lock,
  Crown,
  Gavel,
  Clock,
  User,
  Trophy,
  Music,
  Eye,
  Users,
  Sparkles,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import type { AuctionPlaylist } from '@/types';
import { mockSongs } from '@/data/songs';
import { useUserStore } from '@/store/userStore';
import { useAuctionStore } from '@/store/auctionStore';

interface Props {
  playlist: AuctionPlaylist;
  onClose: () => void;
  onBid: () => void;
}

function formatBidTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
}

export default function AuctionDetailModal({ playlist, onClose, onBid }: Props) {
  const { currentUser } = useUserStore();
  const { canAccessFullPlaylist, isWinner } = useAuctionStore();
  const [activeTab, setActiveTab] = useState<'tracks' | 'history' | 'info'>('tracks');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const canAccess = canAccessFullPlaylist(playlist.id, currentUser.id);
  const userIsWinner = isWinner(playlist.id, currentUser.id);
  const songs = playlist.songIds
    .map((id) => mockSongs.find((s) => s.id === id))
    .filter(Boolean);

  const togglePlay = (songId: string) => {
    if (!canAccess) return;
    setPlayingId(playingId === songId ? null : songId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="vintage-card max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-popup-bounce-in">
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <div className="cassette-tape absolute inset-0">
            <div className="absolute inset-4 z-10 rounded">
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vintage-brownDark via-vintage-brownDark/80 to-transparent rounded" />
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
          </div>

          {userIsWinner && (
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-gradient-to-r from-vintage-gold to-vintage-goldDark text-vintage-brown px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Crown size={14} />
                您独占此歌单
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-black/40 text-vintage-paper flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
            {playlist.status === 'ended' && playlist.winnerNickname && (
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <img
                    src={playlist.winnerAvatar}
                    alt={playlist.winnerNickname}
                    className="w-8 h-8 rounded-full border-2 border-vintage-gold"
                  />
                  <Crown
                    size={12}
                    className="absolute -top-1 -right-1 text-vintage-gold"
                  />
                </div>
                <div>
                  <p className="text-vintage-gold text-xs font-bold">
                    {playlist.winnerNickname}
                  </p>
                  <p className="text-vintage-paper/60 text-[10px]">
                    以 {playlist.finalPrice || playlist.currentBid} 积分竞得
                  </p>
                </div>
              </div>
            )}
            <h2 className="text-vintage-paper text-2xl font-bold font-serif">
              {playlist.title}
            </h2>
            <p className="text-vintage-paper/70 text-sm mt-0.5 font-serif">
              {playlist.theme} · {playlist.songIds.length} 首歌曲
            </p>
          </div>
        </div>

        <div className="border-b border-vintage-gold/20 flex bg-vintage-paperLight/30">
          {(['tracks', 'history', 'info'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-vintage-gold border-b-2 border-vintage-gold bg-vintage-gold/5'
                  : 'text-vintage-inkLight/70 hover:text-vintage-ink'
              }`}
            >
              {tab === 'tracks' && <Music size={14} className="inline mr-1.5" />}
              {tab === 'history' && <Gavel size={14} className="inline mr-1.5" />}
              {tab === 'info' && <Sparkles size={14} className="inline mr-1.5" />}
              {tab === 'tracks' ? '曲目列表' : tab === 'history' ? '竞价记录' : '歌单介绍'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'tracks' && (
            <div className="space-y-2">
              {!canAccess && playlist.status !== 'upcoming' && (
                <div className="mb-4 p-3 rounded-xl bg-vintage-brick/10 border border-vintage-brick/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vintage-brick/20 flex items-center justify-center flex-shrink-0">
                    <Lock size={20} className="text-vintage-brick" />
                  </div>
                  <div className="flex-1">
                    <p className="text-vintage-ink text-sm font-medium">
                      {playlist.status === 'ended'
                        ? '此歌单已被独占'
                        : '竞拍成功者方可完整播放'}
                    </p>
                    <p className="text-vintage-inkLight/60 text-xs">
                      {playlist.status === 'ended'
                        ? `「${playlist.winnerNickname}」已永久获得此歌单播放权`
                        : `当前最高出价：${playlist.currentBid || playlist.startingPrice} 积分`}
                    </p>
                  </div>
                  {playlist.status === 'active' && (
                    <button
                      onClick={onBid}
                      className="px-4 py-2 rounded-lg bg-vintage-brick text-vintage-paper text-xs font-bold"
                    >
                      <Gavel size={14} className="inline mr-1" />
                      出价
                    </button>
                  )}
                </div>
              )}

              {canAccess && (
                <div className="mb-4 p-3 rounded-xl bg-vintage-gold/10 border border-vintage-gold/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vintage-gold/20 flex items-center justify-center flex-shrink-0">
                    <Crown size={20} className="text-vintage-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-vintage-ink text-sm font-bold">恭喜！您可完整播放此歌单</p>
                    <p className="text-vintage-inkLight/60 text-xs">
                      您的名字已永久镌刻在此绝版磁带封面
                    </p>
                  </div>
                </div>
              )}

              {songs.map((song, idx) => {
                const canPlayThis = canAccess;
                const isPlaying = playingId === song!.id;

                return (
                  <div
                    key={song!.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isPlaying
                        ? 'bg-vintage-gold/15 border border-vintage-gold/40'
                        : 'hover:bg-vintage-brownLight/20'
                    } ${canPlayThis ? 'cursor-pointer' : ''}`}
                    onClick={() => canPlayThis && togglePlay(song!.id)}
                  >
                    <span className="w-7 h-7 rounded-full bg-vintage-brownLight/40 flex items-center justify-center flex-shrink-0 text-vintage-inkLight/70 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={song!.coverUrl}
                        alt={song!.title}
                        className="w-full h-full object-cover"
                      />
                      {!canPlayThis && (
                        <div className="absolute inset-0 bg-vintage-brownDark/60 flex items-center justify-center">
                          <Lock size={14} className="text-vintage-paper/70" />
                        </div>
                      )}
                      {canPlayThis && isPlaying && (
                        <div className="absolute inset-0 bg-vintage-brownDark/50 flex items-center justify-center">
                          <PauseCircle size={20} className="text-vintage-gold" />
                        </div>
                      )}
                      {canPlayThis && !isPlaying && (
                        <div className="absolute inset-0 bg-vintage-brownDark/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <PlayCircle size={20} className="text-vintage-gold" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        canPlayThis ? 'text-vintage-ink' : 'text-vintage-inkLight/50'
                      }`}>
                        {canPlayThis ? song!.title : '???'}
                      </p>
                      <p className={`text-xs truncate ${
                        canPlayThis ? 'text-vintage-inkLight/60' : 'text-vintage-inkLight/30'
                      }`}>
                        {canPlayThis ? `${song!.artist} · ${song!.album}` : '竞拍成功解锁'}
                      </p>
                    </div>
                    {canPlayThis && (
                      <span className="text-[10px] text-vintage-gold/60 flex-shrink-0">
                        {song!.year}
                      </span>
                    )}
                    {!canPlayThis && (
                      <Lock size={14} className="text-vintage-inkLight/30 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {playlist.bidHistory.length === 0 ? (
                <div className="text-center py-10">
                  <Gavel size={40} className="mx-auto text-vintage-gold/30 mb-3" />
                  <p className="text-vintage-inkLight/60 font-serif">暂无竞价记录</p>
                  <p className="text-vintage-inkLight/40 text-xs mt-1">
                    {playlist.status === 'active'
                      ? '成为第一个出价的人吧！'
                      : '此拍卖尚未开始'}
                  </p>
                </div>
              ) : (
                playlist.bidHistory.map((bid, idx) => (
                  <div
                    key={bid.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      idx === 0
                        ? 'bg-gradient-to-r from-vintage-gold/10 to-transparent border border-vintage-gold/30'
                        : 'bg-vintage-brownLight/15'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={bid.userAvatar}
                        alt={bid.userNickname}
                        className="w-10 h-10 rounded-full border-2 border-vintage-gold/30"
                      />
                      {idx === 0 && (
                        <Crown
                          size={14}
                          className="absolute -top-1 -right-1 text-vintage-gold"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-vintage-ink text-sm font-medium truncate">
                          {bid.userNickname}
                        </p>
                        {bid.userId === currentUser.id && (
                          <span className="px-1.5 py-0.5 rounded bg-vintage-moss/20 text-vintage-moss text-[10px] font-medium">
                            我
                          </span>
                        )}
                      </div>
                      <p className="text-vintage-inkLight/50 text-xs">
                        {formatBidTime(bid.bidAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className={`font-bold font-display ${
                        idx === 0 ? 'text-vintage-gold text-lg' : 'text-vintage-ink text-base'
                      }`}>
                        {bid.amount}
                      </p>
                      <p className="text-vintage-inkLight/40 text-[10px]">积分</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-vintage-brownLight/15">
                <p className="text-vintage-ink font-serif leading-relaxed">
                  {playlist.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-vintage-brownLight/15 text-center">
                  <Eye size={18} className="mx-auto text-vintage-gold/70 mb-1" />
                  <p className="text-vintage-ink text-sm font-bold">{playlist.viewCount}</p>
                  <p className="text-vintage-inkLight/50 text-xs">围观次数</p>
                </div>
                <div className="p-3 rounded-xl bg-vintage-brownLight/15 text-center">
                  <Users size={18} className="mx-auto text-vintage-gold/70 mb-1" />
                  <p className="text-vintage-ink text-sm font-bold">
                    {playlist.bidHistory.length}
                  </p>
                  <p className="text-vintage-inkLight/50 text-xs">参与竞价</p>
                </div>
                <div className="p-3 rounded-xl bg-vintage-brownLight/15 text-center">
                  <Trophy size={18} className="mx-auto text-vintage-gold/70 mb-1" />
                  <p className="text-vintage-ink text-sm font-bold">{playlist.startingPrice}</p>
                  <p className="text-vintage-inkLight/50 text-xs">起拍价</p>
                </div>
                <div className="p-3 rounded-xl bg-vintage-brownLight/15 text-center">
                  <Gavel size={18} className="mx-auto text-vintage-gold/70 mb-1" />
                  <p className="text-vintage-ink text-sm font-bold">
                    {playlist.finalPrice || playlist.currentBid || '-'}
                  </p>
                  <p className="text-vintage-inkLight/50 text-xs">
                    {playlist.status === 'ended' ? '成交价' : '当前价'}
                  </p>
                </div>
              </div>

              {playlist.creatorNickname && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-vintage-gold/5 border border-vintage-gold/20">
                  <div className="w-10 h-10 rounded-full bg-vintage-gold/20 flex items-center justify-center">
                    <User size={18} className="text-vintage-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-vintage-ink text-sm font-medium">
                      {playlist.creatorNickname}
                    </p>
                    <p className="text-vintage-inkLight/50 text-xs">歌单制作人</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-xl bg-vintage-brick/5 border border-vintage-brick/20">
                <div className="w-10 h-10 rounded-full bg-vintage-brick/20 flex items-center justify-center">
                  <Clock size={18} className="text-vintage-brick" />
                </div>
                <div className="flex-1">
                  <p className="text-vintage-ink text-sm font-medium">
                    {playlist.status === 'active'
                      ? '拍卖进行中'
                      : playlist.status === 'upcoming'
                      ? '开拍时间'
                      : '拍卖已结束'}
                  </p>
                  <p className="text-vintage-inkLight/50 text-xs">
                    {new Date(playlist.startTime).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    —{' '}
                    {new Date(playlist.endTime).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {playlist.status === 'active' && (
          <div className="p-4 border-t border-vintage-gold/20 bg-vintage-paperLight/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-vintage-inkLight/60 text-xs">当前最高</p>
                <p className="text-vintage-brick text-xl font-bold font-display">
                  {playlist.currentBid || playlist.startingPrice}
                  <span className="text-xs font-normal ml-1 text-vintage-brick/60">积分</span>
                </p>
              </div>
              <button
                onClick={onBid}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-vintage-brick to-vintage-brick/80 text-vintage-paper text-sm font-bold flex items-center gap-1.5 hover:shadow-lg transition-all"
              >
                <Gavel size={16} />
                参与竞拍
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
