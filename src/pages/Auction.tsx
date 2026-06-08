import { useState } from 'react';
import {
  Gavel,
  Trophy,
  Clock,
  Sparkles,
  Crown,
  Flame,
  Award,
  Disc3,
  ChevronRight,
} from 'lucide-react';
import AuctionTapeCard from '@/components/AuctionTapeCard';
import BidModal from '@/components/BidModal';
import AuctionDetailModal from '@/components/AuctionDetailModal';
import { useAuctionStore } from '@/store/auctionStore';
import { useGuessStore } from '@/store/guessStore';
import { useUserStore } from '@/store/userStore';
import type { AuctionPlaylist } from '@/types';

type TabType = 'active' | 'upcoming' | 'ended' | 'won';

export default function Auction() {
  const { playlists, getWonPlaylists } = useAuctionStore();
  const { points } = useGuessStore();
  const { currentUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedPlaylist, setSelectedPlaylist] = useState<AuctionPlaylist | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const activeAuctions = playlists.filter((p) => p.status === 'active');
  const upcomingAuctions = playlists.filter((p) => p.status === 'upcoming');
  const endedAuctions = playlists.filter((p) => p.status === 'ended');
  const wonAuctions = getWonPlaylists(currentUser.id);

  const displayList =
    activeTab === 'active'
      ? activeAuctions
      : activeTab === 'upcoming'
      ? upcomingAuctions
      : activeTab === 'ended'
      ? endedAuctions
      : wonAuctions;

  const handleCardClick = (playlist: AuctionPlaylist) => {
    setSelectedPlaylist(playlist);
    setShowDetailModal(true);
  };

  const handleBidClick = (playlist: AuctionPlaylist) => {
    setSelectedPlaylist(playlist);
    setShowBidModal(true);
  };

  const tabs: { key: TabType; label: string; count: number; icon: typeof Flame }[] = [
    { key: 'active', label: '竞拍中', count: activeAuctions.length, icon: Flame },
    { key: 'upcoming', label: '即将开拍', count: upcomingAuctions.length, icon: Clock },
    { key: 'ended', label: '已结拍', count: endedAuctions.length, icon: Award },
    { key: 'won', label: '我的拍品', count: wonAuctions.length, icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-vintage-brownDark relative">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-vintage-brick/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-vintage-moss/5 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30 mb-6">
              <Gavel size={16} className="text-vintage-gold" />
              <span className="text-vintage-gold/90 text-sm">每周限定 · 年代歌单拍卖周</span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-6xl mb-5 leading-tight">
              绝版虚拟磁带拍卖会
            </h1>
            <p className="text-vintage-paper/70 font-serif text-lg max-w-2xl mx-auto leading-relaxed mb-6">
              竞拍由系统或高信用用户制作的「绝版虚拟磁带」，独占获胜者才能完整播放该歌单，
              您的名字将永久显示在封面上，镌刻那段独一无二的时光。
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-brick/15 border border-vintage-brick/30">
                <Trophy size={16} className="text-vintage-brick" />
                <span className="text-vintage-paper/80 text-sm">
                  当前积分：<span className="text-vintage-brick font-bold">{points}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30">
                <Disc3 size={16} className="text-vintage-gold" />
                <span className="text-vintage-paper/80 text-sm">
                  本周竞拍：<span className="text-vintage-gold font-bold">{activeAuctions.length}</span> 场
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-moss/10 border border-vintage-moss/30">
                <Crown size={16} className="text-vintage-moss" />
                <span className="text-vintage-paper/80 text-sm">
                  我的拍品：<span className="text-vintage-moss font-bold">{wonAuctions.length}</span> 份
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-vintage-paper/60">
                <Sparkles size={16} className="text-vintage-gold" />
                积分可通过猜歌获得
              </div>
              <div className="flex items-center gap-2 text-vintage-paper/60">
                <Gavel size={16} className="text-vintage-gold" />
                被超越自动退还积分
              </div>
              <div className="flex items-center gap-2 text-vintage-paper/60">
                <Crown size={16} className="text-vintage-gold" />
                得主永久独占播放权
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeAuctions.length > 0 && (
        <section className="pb-10">
          <div className="container">
            <div className="vintage-card p-5 mb-2 overflow-hidden relative">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-vintage-brick/8 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-vintage-brick to-vintage-brick/70 flex items-center justify-center shadow-lg">
                  <Flame size={28} className="text-vintage-paper" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-vintage-brick/15 text-vintage-brick text-xs font-bold animate-pulse">
                      火热竞拍中
                    </span>
                    <span className="text-vintage-inkLight/50 text-xs">
                      {activeAuctions[0].viewCount} 人围观
                    </span>
                  </div>
                  <h3 className="text-vintage-ink font-bold text-lg font-serif truncate">
                    {activeAuctions[0].title}
                  </h3>
                  <p className="text-vintage-inkLight/70 text-sm truncate">
                    {activeAuctions[0].theme} · 当前最高
                    <span className="text-vintage-brick font-bold mx-1">
                      {activeAuctions[0].currentBid || activeAuctions[0].startingPrice}
                    </span>
                    积分
                  </p>
                </div>
                <button
                  onClick={() => handleCardClick(activeAuctions[0])}
                  className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-vintage-brick to-vintage-brick/80 text-vintage-paper text-sm font-bold flex items-center gap-1.5 hover:shadow-lg transition-all"
                >
                  查看详情
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="pb-20">
        <div className="container">
          <div className="vintage-card overflow-hidden mb-6">
            <div className="flex border-b border-vintage-gold/20">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === tab.key
                        ? 'text-vintage-gold bg-vintage-gold/8 border-b-2 border-vintage-gold'
                        : 'text-vintage-inkLight/70 hover:text-vintage-ink hover:bg-vintage-gold/3'
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        activeTab === tab.key
                          ? 'bg-vintage-gold/20 text-vintage-gold'
                          : 'bg-vintage-inkLight/10 text-vintage-inkLight/60'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {displayList.length === 0 ? (
            <div className="vintage-card p-16 text-center">
              <Disc3 size={56} className="mx-auto text-vintage-gold/20 mb-4" />
              <p className="text-vintage-inkLight font-serif text-lg mb-2">
                {activeTab === 'won'
                  ? '您还没有竞得任何绝版磁带'
                  : activeTab === 'upcoming'
                  ? '暂无即将开拍的歌单'
                  : activeTab === 'ended'
                  ? '暂无已结束的拍卖'
                  : '暂无竞拍中的歌单'}
              </p>
              <p className="text-vintage-inkLight/50 text-sm font-serif">
                {activeTab === 'won'
                  ? '去参与竞拍，赢取属于您的年代记忆吧！'
                  : '敬请期待更多精彩的年代歌单'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayList.map((playlist) => (
                <AuctionTapeCard
                  key={playlist.id}
                  playlist={playlist}
                  onClick={() => handleCardClick(playlist)}
                  onBid={() => handleBidClick(playlist)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {showBidModal && selectedPlaylist && (
        <BidModal
          playlist={selectedPlaylist}
          onClose={() => {
            setShowBidModal(false);
            setSelectedPlaylist(null);
          }}
        />
      )}

      {showDetailModal && selectedPlaylist && (
        <AuctionDetailModal
          playlist={selectedPlaylist}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPlaylist(null);
          }}
          onBid={() => {
            setShowDetailModal(false);
            setShowBidModal(true);
          }}
        />
      )}
    </div>
  );
}
