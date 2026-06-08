import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Users,
  Eye,
  MessageCircle,
  Heart,
  Send,
  Gift,
  Sparkles,
  Palette,
  Star,
  Trophy,
  Music,
  MapPin,
  Calendar,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useConcertStore, DANMAKU_COLORS } from '@/store/concertStore';
import { useGuessStore } from '@/store/guessStore';
import { getCurrentMonthConcert, virtualGifts, monthlyConcerts } from '@/data/concerts';
import ConcertDanmaku from '@/components/ConcertDanmaku';

export default function ConcertHall() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [danmakuText, setDanmakuText] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'memories' | 'rankings' | 'setlist'>('memories');
  const [selectedConcertId, setSelectedConcertId] = useState(getCurrentMonthConcert().id);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    danmakus,
    giftEffects,
    memories,
    giftRankings,
    onlineCount,
    userDanmakuColor,
    danmakuEnabled,
    addDanmaku,
    addGift,
    addMemory,
    likeMemory,
    setUserDanmakuColor,
    toggleDanmaku,
    incrementOnline,
    spawnRandomDanmaku,
  } = useConcertStore();

  const { points } = useGuessStore();

  const currentConcert = monthlyConcerts.find((c) => c.id === selectedConcertId) || getCurrentMonthConcert();
  const isCurrentMonth = currentConcert.id === getCurrentMonthConcert().id;

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        spawnRandomDanmaku();
        if (Math.random() > 0.6) {
          incrementOnline();
        }
      }
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(timer);
  }, [isPlaying, spawnRandomDanmaku, incrementOnline]);

  const handleSendDanmaku = () => {
    if (!danmakuText.trim()) return;
    addDanmaku(danmakuText.trim());
    setDanmakuText('');
  };

  const handleSendMemory = () => {
    if (!memoryText.trim()) return;
    addMemory(memoryText.trim());
    setMemoryText('');
  };

  const handleSendGift = (gift: (typeof virtualGifts)[0]) => {
    const success = addGift(gift.type, gift.emoji, gift.name, gift.cost, gift.weight);
    if (!success) {
      alert(`积分不足！${gift.name}需要 ${gift.cost} 积分，当前只有 ${points} 积分。去猜歌赢取更多积分吧！`);
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return n.toLocaleString();
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-vintage-brownDark">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-vintage-brick/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-vintage-moss/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vintage-gold to-vintage-brick flex items-center justify-center shadow-gold-glow animate-stage-glow">
                <Sparkles size={28} className="text-vintage-brown" />
              </div>
              <div>
                <h1 className="vintage-heading text-2xl md:text-3xl">岁月演唱会直播厅</h1>
                <p className="text-vintage-paper/60 text-sm font-serif">每月一位时代歌者 · 集体怀旧仪式</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30">
                <Users size={16} className="text-vintage-gold" />
                <span className="text-vintage-gold text-sm font-medium">{formatNumber(onlineCount)} 人在线</span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-brick/10 border border-vintage-brick/30">
                <Star size={16} className="text-vintage-gold" />
                <span className="text-vintage-gold text-sm font-medium">{points} 积分</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {monthlyConcerts.map((concert) => (
              <button
                key={concert.id}
                onClick={() => {
                  setSelectedConcertId(concert.id);
                  setIsPlaying(false);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedConcertId === concert.id
                    ? 'bg-vintage-gold text-vintage-brown shadow-gold-glow'
                    : 'bg-vintage-brownLight/40 text-vintage-paper/70 hover:bg-vintage-brownLight/60 hover:text-vintage-paper border border-vintage-gold/20'
                }`}
              >
                <span className="mr-2">{concert.month === getCurrentMonthConcert().month ? '🎤 本月' : '📼 ' + concert.month.slice(5) + '月'}</span>
                {concert.singerName}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div
                ref={containerRef}
                className="relative rounded-2xl overflow-hidden animate-stage-glow"
                style={{ aspectRatio: '16/9' }}
              >
                <div className="absolute inset-0 bg-vintage-brown">
                  <div className="absolute inset-0">
                    <img
                      src={currentConcert.coverUrl}
                      alt={currentConcert.concertTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vintage-brownDark via-vintage-brownDark/50 to-transparent" />
                  </div>
                </div>

                <div className="crt-scanlines absolute inset-0 pointer-events-none" />
                <div className="tv-snow absolute inset-0 pointer-events-none opacity-20" />

                <ConcertDanmaku
                  danmakus={danmakus}
                  giftEffects={giftEffects}
                  enabled={danmakuEnabled && isPlaying}
                />

                <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
                  <div className="pointer-events-auto flex items-center gap-3 bg-vintage-brownDark/70 backdrop-blur-md px-4 py-2 rounded-xl border border-vintage-gold/30">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-vintage-gold">
                      <img src={currentConcert.singerAvatar} alt={currentConcert.singerName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-vintage-gold font-bold text-sm">{currentConcert.singerName}</p>
                      <p className="text-vintage-paper/60 text-xs">{currentConcert.concertTitle}</p>
                    </div>
                  </div>
                  {isCurrentMonth && (
                    <div className="pointer-events-auto px-3 py-1.5 rounded-full bg-vintage-brick/90 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE 直播中
                    </div>
                  )}
                </div>

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-vintage-brownDark/40 backdrop-blur-sm">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="group relative"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vintage-gold to-vintage-goldDark flex items-center justify-center shadow-gold-glow transition-transform group-hover:scale-110">
                        <Play size={40} className="text-vintage-brown ml-1" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-vintage-gold/40 animate-ping" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-vintage-brownDark/90 to-transparent">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-vintage-gold/20 flex items-center justify-center text-vintage-gold hover:bg-vintage-gold/30 transition-colors border border-vintage-gold/30"
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-10 h-10 rounded-full bg-vintage-gold/20 flex items-center justify-center text-vintage-gold hover:bg-vintage-gold/30 transition-colors border border-vintage-gold/30"
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <div className="flex items-center gap-1.5 ml-2 text-vintage-paper/60 text-xs">
                        <Eye size={14} />
                        <span>{formatNumber(currentConcert.totalViews + onlineCount)} 观看</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleDanmaku}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                          danmakuEnabled
                            ? 'bg-vintage-gold/20 text-vintage-gold border-vintage-gold/40'
                            : 'bg-vintage-brownLight/40 text-vintage-paper/50 border-vintage-gold/20'
                        }`}
                      >
                        <MessageCircle size={14} />
                        {danmakuEnabled ? '弹幕开' : '弹幕关'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={danmakuText}
                        onChange={(e) => setDanmakuText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendDanmaku()}
                        placeholder="发送一条弹幕，和大家一起怀旧..."
                        maxLength={50}
                        className="w-full py-3 px-4 pr-12 rounded-xl bg-vintage-paper/10 border border-vintage-gold/30 text-vintage-paper placeholder:text-vintage-paper/40 text-sm focus:outline-none focus:border-vintage-gold backdrop-blur-md"
                        style={{ color: userDanmakuColor }}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={() => setShowColorPicker(!showColorPicker)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-vintage-gold/20 transition-colors"
                          title="选择颜色"
                        >
                          <Palette size={16} style={{ color: userDanmakuColor }} />
                        </button>
                        {showColorPicker && (
                          <div className="absolute right-0 bottom-full mb-2 p-2 rounded-xl bg-vintage-brown border border-vintage-gold/30 flex gap-1.5 shadow-vintage-lg">
                            {DANMAKU_COLORS.map((color) => (
                              <button
                                key={color}
                                onClick={() => {
                                  setUserDanmakuColor(color);
                                  setShowColorPicker(false);
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                                  userDanmakuColor === color ? 'border-vintage-gold scale-110' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleSendDanmaku}
                      disabled={!danmakuText.trim()}
                      className="px-5 py-3 rounded-xl bg-vintage-gold text-vintage-brown font-bold text-sm hover:bg-vintage-goldLight transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <Send size={16} />
                      发送
                    </button>
                    <button
                      onClick={() => setShowGiftPanel(!showGiftPanel)}
                      className={`px-5 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 ${
                        showGiftPanel
                          ? 'bg-vintage-brick text-white'
                          : 'bg-gradient-to-r from-vintage-brick to-vintage-brickLight text-white hover:opacity-90'
                      }`}
                    >
                      <Gift size={16} />
                      打榜
                    </button>
                  </div>
                </div>

                {showGiftPanel && (
                  <div className="absolute bottom-28 right-4 left-4 lg:left-auto lg:w-96 p-4 rounded-2xl bg-vintage-brown/95 backdrop-blur-xl border border-vintage-gold/30 shadow-vintage-lg animate-popup-bounce-in z-30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-vintage-gold font-bold text-lg flex items-center gap-2">
                        <Sparkles size={20} />
                        送出心意礼物
                      </h3>
                      <div className="text-vintage-paper/60 text-sm">
                        我的积分：<span className="text-vintage-gold font-bold">{points}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {virtualGifts.map((gift) => (
                        <button
                          key={gift.id}
                          onClick={() => handleSendGift(gift)}
                          className="group flex flex-col items-center p-3 rounded-xl bg-vintage-gold/5 hover:bg-vintage-gold/15 border border-vintage-gold/20 hover:border-vintage-gold/40 transition-all hover:-translate-y-1"
                          title={gift.description}
                        >
                          <span className="text-3xl mb-1 group-hover:animate-gift-pulse">{gift.emoji}</span>
                          <span className="text-vintage-paper text-xs font-medium">{gift.name}</span>
                          <span className="text-vintage-gold text-xs mt-0.5">{gift.cost}分</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-vintage-paper/40 text-xs mt-3 text-center">
                      💡 去「猜歌挑战」可赢取更多积分哦
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 vintage-card p-6">
                <div className="flex items-start gap-5">
                  <div className="hidden sm:block flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-vintage-gold/40 shadow-vintage">
                      <img src={currentConcert.singerAvatar} alt={currentConcert.singerName} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="vintage-heading text-xl md:text-2xl mb-2">{currentConcert.concertTitle}</h2>
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-vintage-inkLight text-sm">
                      <span className="flex items-center gap-1">
                        <Music size={14} className="text-vintage-gold" />
                        {currentConcert.singerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-vintage-gold" />
                        {currentConcert.concertYear}年
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-vintage-gold" />
                        {currentConcert.venue}
                      </span>
                    </div>
                    <p className="text-vintage-ink/80 font-serif leading-relaxed">{currentConcert.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 vintage-card p-6">
                <h3 className="vintage-heading text-lg mb-4 flex items-center gap-2">
                  <Quote size={20} />
                  歌词同步 · 跟着一起唱
                </h3>
                <div className="bg-vintage-brownDark/5 rounded-xl p-6 max-h-48 overflow-y-auto">
                  <pre className="font-serif text-vintage-ink/70 text-sm leading-loose whitespace-pre-wrap text-center">
                    {currentConcert.lyrics}
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="vintage-card overflow-hidden">
                <div className="flex border-b border-vintage-gold/20">
                  {[
                    { key: 'memories', label: '回忆分享', icon: Heart },
                    { key: 'rankings', label: '打榜排行', icon: Trophy },
                    { key: 'setlist', label: '演唱曲目', icon: Music },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`flex-1 py-3 px-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                        activeTab === tab.key
                          ? 'bg-vintage-gold/15 text-vintage-gold border-b-2 border-vintage-gold'
                          : 'text-vintage-inkLight/60 hover:text-vintage-ink hover:bg-vintage-gold/5'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 max-h-[600px] overflow-y-auto">
                  {activeTab === 'memories' && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-vintage-brown/10 border border-vintage-gold/20">
                        <textarea
                          value={memoryText}
                          onChange={(e) => setMemoryText(e.target.value)}
                          placeholder="分享你与这场演唱会或这位歌手的回忆..."
                          maxLength={200}
                          rows={3}
                          className="w-full bg-transparent text-vintage-ink text-sm focus:outline-none resize-none placeholder:text-vintage-inkLight/40 font-serif"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-vintage-inkLight/40 text-xs">{memoryText.length}/200</span>
                          <button
                            onClick={handleSendMemory}
                            disabled={!memoryText.trim()}
                            className="px-4 py-1.5 rounded-lg bg-vintage-gold text-vintage-brown text-xs font-bold hover:bg-vintage-goldLight transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <Send size={12} />
                            发布回忆
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {memories.map((memory) => (
                          <div key={memory.id} className="p-4 rounded-xl bg-vintage-paperLight/50 border border-vintage-gold/15 hover:border-vintage-gold/30 transition-colors">
                            <div className="flex items-start gap-3 mb-2">
                              <img
                                src={memory.userAvatar}
                                alt={memory.userNickname}
                                className="w-9 h-9 rounded-full border border-vintage-gold/30 object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-vintage-brown font-bold text-sm">{memory.userNickname}</span>
                                  <span className="text-vintage-inkLight/40 text-xs">
                                    {new Date(memory.createdAt).toLocaleDateString('zh-CN')}
                                  </span>
                                </div>
                                <p className="text-vintage-ink/80 text-sm font-serif leading-relaxed mt-1.5">
                                  {memory.content}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => likeMemory(memory.id)}
                              className="flex items-center gap-1 text-vintage-brick text-xs hover:text-vintage-brickLight transition-colors ml-12"
                            >
                              <Heart size={13} className="fill-current" />
                              {memory.likes}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'rankings' && (
                    <div className="space-y-2">
                      <div className="text-center text-vintage-inkLight/60 text-xs mb-4 pb-3 border-b border-vintage-gold/15">
                        本月演唱会 · 贡献榜
                      </div>
                      {giftRankings.map((ranking, index) => (
                        <div
                          key={ranking.userId}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            index === 0
                              ? 'bg-gradient-to-r from-vintage-gold/20 to-transparent border border-vintage-gold/30'
                              : index < 3
                              ? 'bg-vintage-gold/10 border border-vintage-gold/15'
                              : 'hover:bg-vintage-gold/5'
                          }`}
                        >
                          <span className={`w-8 text-center font-bold ${
                            index === 0 ? 'text-xl' : index < 3 ? 'text-lg text-vintage-gold' : 'text-vintage-inkLight/50 text-sm'
                          }`}>
                            {getRankBadge(index)}
                          </span>
                          <img
                            src={ranking.userAvatar}
                            alt={ranking.userNickname}
                            className="w-9 h-9 rounded-full border border-vintage-gold/30 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold text-sm truncate ${index === 0 ? 'text-vintage-gold' : 'text-vintage-ink'}`}>
                              {ranking.userNickname}
                            </p>
                            <p className="text-vintage-inkLight/50 text-xs">
                              送出 {ranking.giftCount} 件礼物
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-vintage-brick font-bold text-sm">{ranking.totalWeight}</p>
                            <p className="text-vintage-inkLight/40 text-xs">热度值</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'setlist' && (
                    <div className="space-y-1">
                      <div className="text-center text-vintage-inkLight/60 text-xs mb-4 pb-3 border-b border-vintage-gold/15">
                        本场演唱会 · 经典曲目
                      </div>
                      {currentConcert.setlist.map((song, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-vintage-gold/5 transition-colors group"
                        >
                          <span className="w-6 text-center text-vintage-gold font-serif font-bold text-sm">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <Music size={14} className="text-vintage-inkLight/40 group-hover:text-vintage-gold transition-colors" />
                          <span className="flex-1 text-vintage-ink font-serif text-sm group-hover:text-vintage-gold transition-colors">
                            {song}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="vintage-card p-5 text-center">
                <div className="text-4xl mb-2 animate-crowd-wave inline-block">🎤</div>
                <p className="text-vintage-ink font-serif text-sm mb-2">
                  每月一位8090年代经典歌手
                </p>
                <p className="text-vintage-inkLight/60 text-xs">
                  重温时代金曲 · 分享青春记忆 · 集体怀旧仪式
                </p>
                <div className="mt-3 pt-3 border-t border-vintage-gold/15 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-vintage-gold font-bold text-lg">{monthlyConcerts.length}</p>
                    <p className="text-vintage-inkLight/50 text-xs">已举办</p>
                  </div>
                  <div>
                    <p className="text-vintage-gold font-bold text-lg">{formatNumber(monthlyConcerts.reduce((s, c) => s + c.totalViews, 0))}</p>
                    <p className="text-vintage-inkLight/50 text-xs">总观看</p>
                  </div>
                  <div>
                    <p className="text-vintage-gold font-bold text-lg">{memories.length}</p>
                    <p className="text-vintage-inkLight/50 text-xs">条回忆</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Quote({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  );
}
