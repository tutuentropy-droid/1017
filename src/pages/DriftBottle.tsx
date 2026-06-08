import { useState } from 'react';
import {
  Send,
  Waves,
  Inbox,
  Award,
  MessageCircleHeart,
  Anchor,
} from 'lucide-react';
import type { DriftBottle } from '@/types';
import DriftBottleCard from '@/components/DriftBottleCard';
import BottleModal from '@/components/BottleModal';
import BottleDetailModal from '@/components/BottleDetailModal';
import Empty from '@/components/Empty';
import { useDriftBottleStore } from '@/store/driftBottleStore';
import { useUserStore } from '@/store/userStore';
import { FRIEND_BADGE } from '@/data/driftBottles';

type TabType = 'sent' | 'received';

export default function DriftBottle() {
  const { currentUser } = useUserStore();
  const {
    sendBottle,
    receiveRandomBottle,
    replyToBottle,
    getSentBottles,
    getReceivedBottles,
    getStats,
    hasBadge,
  } = useDriftBottleStore();

  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyToBottleData, setReplyToBottleData] = useState<DriftBottle | null>(null);
  const [detailBottle, setDetailBottle] = useState<DriftBottle | null>(null);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [isFishing, setIsFishing] = useState(false);
  const [fishedBottle, setFishedBottle] = useState<DriftBottle | null>(null);

  const stats = getStats(currentUser.id);
  const sentBottles = getSentBottles(currentUser.id);
  const receivedBottles = getReceivedBottles(currentUser.id);
  const displayBottles = activeTab === 'sent' ? sentBottles : receivedBottles;
  const hasFriendBadge = hasBadge(currentUser.id, FRIEND_BADGE.id);

  const handleFishBottle = () => {
    setIsFishing(true);
    setTimeout(() => {
      const bottle = receiveRandomBottle(currentUser.id);
      setIsFishing(false);
      if (bottle) {
        setFishedBottle(bottle);
        setDetailBottle(bottle);
      } else {
        alert('暂时没有漂来的瓶子，稍后再试试吧~');
      }
    }, 1500);
  };

  const handleCreateBottle = (data: {
    lyric: string;
    story: string;
    songTitle?: string;
    songArtist?: string;
  }) => {
    sendBottle(
      currentUser.id,
      currentUser.nickname,
      currentUser.avatar,
      data.lyric,
      data.story,
      data.songTitle,
      data.songArtist
    );
  };

  const handleReplyBottle = (data: {
    lyric: string;
    story: string;
    songTitle?: string;
    songArtist?: string;
  }) => {
    if (!replyToBottleData) return;
    const hadBadge = hasFriendBadge;
    const success = replyToBottle(
      replyToBottleData.id,
      currentUser.id,
      currentUser.nickname,
      currentUser.avatar,
      data.lyric,
      data.story,
      data.songTitle,
      data.songArtist
    );
    if (success && !hadBadge) {
      setTimeout(() => {
        setShowBadgeNotification(true);
      }, 500);
    }
    setReplyToBottleData(null);
  };

  const tabOptions = [
    { key: 'received' as TabType, label: '我收到的', icon: Inbox, count: receivedBottles.length },
    { key: 'sent' as TabType, label: '我投出的', icon: Send, count: sentBottles.length },
  ];

  return (
    <div className="min-h-screen bg-vintage-brownDark">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vintage-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-vintage-brick/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/15 border border-vintage-gold/30 mb-6">
              <Waves size={16} className="text-vintage-gold" />
              <span className="text-vintage-gold/90 text-sm">歌词本漂流瓶</span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              海内存知己
            </h1>
            <p className="text-vintage-paper/70 text-lg font-serif leading-relaxed">
              将一句歌词、一段回忆投入时光的大海<br />
              也许会被某个有缘人拾起，与你共鸣
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto vintage-btn-gold px-8 py-4 text-base"
            >
              <Send size={20} />
              <span>投入我的漂流瓶</span>
            </button>
            <button
              onClick={handleFishBottle}
              disabled={isFishing}
              className="w-full sm:w-auto vintage-btn-outline px-8 py-4 text-base disabled:opacity-60"
            >
              <Anchor
                size={20}
                className={isFishing ? 'animate-bounce' : ''}
              />
              <span>{isFishing ? '打捞中…' : '捞一个漂流瓶'}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              {
                label: '已投出',
                value: stats.sentCount,
                icon: Send,
                color: 'text-vintage-gold',
                bg: 'bg-vintage-gold/10',
              },
              {
                label: '已收到',
                value: stats.receivedCount,
                icon: Inbox,
                color: 'text-vintage-mossLight',
                bg: 'bg-vintage-moss/10',
              },
              {
                label: '已回复',
                value: stats.repliedCount,
                icon: MessageCircleHeart,
                color: 'text-vintage-brick',
                bg: 'bg-vintage-brick/10',
              },
              {
                label: '获得徽章',
                value: stats.badges.length,
                icon: Award,
                color: 'text-vintage-gold',
                bg: 'bg-vintage-gold/10',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="vintage-card p-4 md:p-5 text-center"
                >
                  <div
                    className={`w-10 h-10 mx-auto mb-2 rounded-full ${item.bg} flex items-center justify-center`}
                  >
                    <Icon size={20} className={item.color} />
                  </div>
                  <p className={`font-display text-2xl md:text-3xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-vintage-inkLight/70 text-xs md:text-sm mt-1">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Badge Display */}
          {hasFriendBadge && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="vintage-card p-4 flex items-center gap-4 bg-gradient-to-r from-vintage-gold/10 to-transparent">
                <div className="w-14 h-14 rounded-full bg-vintage-gold/20 flex items-center justify-center text-3xl flex-shrink-0">
                  {FRIEND_BADGE.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-vintage-gold" />
                    <p className="text-vintage-gold font-display font-semibold">
                      {FRIEND_BADGE.name}
                    </p>
                  </div>
                  <p className="text-vintage-inkLight/70 text-xs font-serif mt-0.5">
                    {FRIEND_BADGE.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-16 md:top-20 z-30 bg-vintage-brownDark/95 backdrop-blur-md border-b border-vintage-gold/10">
        <div className="container py-4">
          <div className="inline-flex p-1 rounded-full bg-vintage-brown border border-vintage-gold/20">
            {tabOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  onClick={() => setActiveTab(opt.key)}
                  className={`inline-flex items-center gap-1.5 px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === opt.key
                      ? 'bg-gradient-to-br from-vintage-gold to-vintage-goldDark text-vintage-brown shadow-vintage'
                      : 'text-vintage-paper/60 hover:text-vintage-gold'
                  }`}
                >
                  <Icon size={16} />
                  <span>{opt.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === opt.key
                        ? 'bg-vintage-brown/20 text-vintage-brown'
                        : 'bg-vintage-paper/10 text-vintage-paper/50'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottles List */}
      <section className="py-12 md:py-16">
        <div className="container">
          {displayBottles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayBottles.map((bottle, index) => (
                <div
                  key={bottle.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index % 9) * 60}ms` }}
                >
                  <DriftBottleCard
                    bottle={bottle}
                    type={activeTab}
                    onReply={(b) => setReplyToBottleData(b)}
                    onOpen={(b) => {
                      setDetailBottle(b);
                      setShowBadgeNotification(false);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={activeTab === 'sent' ? Send : Inbox}
              title={activeTab === 'sent' ? '还没有投出任何瓶子' : '还没有收到任何瓶子'}
              description={
                activeTab === 'sent'
                  ? '把你的歌词摘抄和故事投入大海吧'
                  : '点击上方"捞一个漂流瓶"，与远方的知音相遇'
              }
              actionLabel={activeTab === 'sent' ? '投入漂流瓶' : '捞一个试试'}
              onAction={activeTab === 'sent' ? () => setShowCreateModal(true) : handleFishBottle}
            />
          )}
        </div>
      </section>

      {/* Create Bottle Modal */}
      <BottleModal
        isOpen={showCreateModal}
        mode="create"
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBottle}
      />

      {/* Reply Bottle Modal */}
      <BottleModal
        isOpen={!!replyToBottleData}
        mode="reply"
        replyToBottle={replyToBottleData || undefined}
        onClose={() => setReplyToBottleData(null)}
        onSubmit={handleReplyBottle}
      />

      {/* Bottle Detail Modal */}
      <BottleDetailModal
        isOpen={!!detailBottle}
        bottle={detailBottle}
        showBadgeNotification={showBadgeNotification && fishedBottle?.id === detailBottle?.id ? false : showBadgeNotification}
        onClose={() => {
          setDetailBottle(null);
          setShowBadgeNotification(false);
          setFishedBottle(null);
        }}
      />
    </div>
  );
}
