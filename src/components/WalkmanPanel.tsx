import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Gift,
  X,
  Check,
  Lock,
  Sparkles,
  Disc3,
  Award,
  Sticker,
  Gauge,
  Activity,
  Radio,
} from 'lucide-react';
import { useWalkmanStore, type WalkmanReward } from '@/store/walkmanStore';
import { walkmanRewards } from '@/data/walkmanRewards';
import { mockSongs } from '@/data/songs';
import type { Song } from '@/types';

const typeIcons: Record<WalkmanReward['type'], typeof Disc3> = {
  'tape-cover': Disc3,
  badge: Award,
  sticker: Sticker,
};

const typeLabels: Record<WalkmanReward['type'], string> = {
  'tape-cover': '磁带封面',
  badge: '限定徽章',
  sticker: '怀旧贴纸',
};

const rarityStyles = {
  common: {
    badge: 'bg-vintage-inkLight/20 text-vintage-inkLight',
    border: 'border-vintage-gold/20',
    glow: '',
    label: '普通',
  },
  rare: {
    badge: 'bg-vintage-gold/20 text-vintage-gold',
    border: 'border-vintage-gold/50',
    glow: 'shadow-gold-glow',
    label: '稀有',
  },
  legendary: {
    badge: 'bg-vintage-brick/20 text-vintage-brick',
    border: 'border-vintage-brick/50',
    glow: 'shadow-[0_0_20px_rgba(183,65,14,0.25)]',
    label: '传说',
  },
};

export default function WalkmanPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [activeShopTab, setActiveShopTab] = useState<'shop' | 'owned'>('shop');
  const [redeemMessage, setRedeemMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [knobAngle, setKnobAngle] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const isDraggingKnob = useRef(false);

  const {
    tapeMileage,
    flipCount,
    volumeAdjustCount,
    operationCount,
    isPlaying,
    currentSide,
    volume,
    currentSongIndex,
    playlist,
    setPlaying,
    toggleSide,
    setVolume,
    nextSong,
    prevSong,
    setPlaylist,
    redeemReward,
    hasReward,
    getObtainedRewards,
  } = useWalkmanStore();

  useEffect(() => {
    if (playlist.length === 0) {
      setPlaylist(mockSongs.slice(0, 10));
    }
  }, [playlist.length, setPlaylist]);

  useEffect(() => {
    setKnobAngle((volume / 100) * 270 - 135);
  }, [volume]);

  const currentSong: Song | undefined = playlist[currentSongIndex];

  const handleButtonPress = useCallback(
    (button: string, action: () => void) => {
      setPressedButton(button);
      action();
      setTimeout(() => setPressedButton(null), 150);
    },
    []
  );

  const handlePlayPause = () => {
    handleButtonPress('play', () => setPlaying(!isPlaying));
  };

  const handlePrev = () => {
    handleButtonPress('prev', prevSong);
  };

  const handleNext = () => {
    handleButtonPress('next', nextSong);
  };

  const handleFlip = () => {
    setIsFlipping(true);
    handleButtonPress('flip', toggleSide);
    setTimeout(() => setIsFlipping(false), 600);
  };

  const handleKnobMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingKnob.current = true;
    document.addEventListener('mousemove', handleKnobMove);
    document.addEventListener('mouseup', handleKnobUp);
  };

  const handleKnobMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingKnob.current || !knobRef.current) return;
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      let normalizedAngle = angle + 90;
      if (normalizedAngle < 0) normalizedAngle += 360;
      if (normalizedAngle > 270) {
        normalizedAngle = normalizedAngle > 315 ? 0 : 270;
      }
      const newVolume = Math.round((normalizedAngle / 270) * 100);
      setVolume(newVolume);
    },
    [setVolume]
  );

  const handleKnobUp = () => {
    isDraggingKnob.current = false;
    document.removeEventListener('mousemove', handleKnobMove);
    document.removeEventListener('mouseup', handleKnobUp);
  };

  const handleRedeem = (reward: WalkmanReward) => {
    if (hasReward(reward.id)) {
      setRedeemMessage({ type: 'error', text: '您已拥有此奖励' });
      setTimeout(() => setRedeemMessage(null), 2500);
      return;
    }
    if (tapeMileage < reward.cost) {
      setRedeemMessage({
        type: 'error',
        text: '里程不足，继续使用随身听获取更多里程吧！',
      });
      setTimeout(() => setRedeemMessage(null), 2500);
      return;
    }
    const success = redeemReward(reward.id);
    if (success) {
      setRedeemMessage({ type: 'success', text: `成功兑换「${reward.name}」！` });
      setTimeout(() => setRedeemMessage(null), 2500);
    }
  };

  const ownedRewards = getObtainedRewards();
  const displayRewards = activeShopTab === 'shop' ? walkmanRewards : ownedRewards;

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden shadow-vintage-lg transition-all duration-500"
        style={{
          background:
            'linear-gradient(145deg, #4a3728 0%, #2C1810 50%, #1a0f08 100%)',
          boxShadow:
            '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10">
          <div
            className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Radio
                  size={24}
                  className={`text-vintage-gold ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                />
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-vintage-brick animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="font-display text-vintage-gold text-lg font-bold tracking-wide">
                  我的随身听
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <Gauge size={12} className="text-vintage-gold/60" />
                  <span className="text-vintage-gold/70">
                    磁带里程: <span className="text-vintage-gold font-bold">{tapeMileage}</span> km
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStats(!showStats);
                }}
                className="p-2 rounded-lg bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-gold/80 hover:bg-vintage-gold/20 transition-colors"
                title="查看统计"
              >
                <Activity size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShop(true);
                }}
                className="p-2 rounded-lg bg-vintage-brick/15 border border-vintage-brick/30 text-vintage-brick hover:bg-vintage-brick/25 transition-colors"
                title="兑换商店"
              >
                <Gift size={18} />
              </button>
              <div className="p-1 rounded-lg bg-vintage-gold/10 border border-vintage-gold/30">
                {isExpanded ? (
                  <ChevronUp size={20} className="text-vintage-gold" />
                ) : (
                  <ChevronDown size={20} className="text-vintage-gold" />
                )}
              </div>
            </div>
          </div>

          {showStats && (
            <div className="px-5 pb-4 animate-fade-in">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-vintage-brownDark/60 border border-vintage-gold/20">
                <div className="text-center">
                  <p className="text-vintage-gold text-xl font-bold font-display">
                    {flipCount}
                  </p>
                  <p className="text-vintage-paper/50 text-[10px] mt-0.5">翻面次数</p>
                </div>
                <div className="text-center border-x border-vintage-gold/20">
                  <p className="text-vintage-gold text-xl font-bold font-display">
                    {volumeAdjustCount}
                  </p>
                  <p className="text-vintage-paper/50 text-[10px] mt-0.5">调音次数</p>
                </div>
                <div className="text-center">
                  <p className="text-vintage-gold text-xl font-bold font-display">
                    {operationCount}
                  </p>
                  <p className="text-vintage-paper/50 text-[10px] mt-0.5">总操作数</p>
                </div>
              </div>
            </div>
          )}

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-5 pb-5 space-y-4">
              <div
                className="relative rounded-xl p-4 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, #1a0f08 0%, #0d0704 100%)',
                  boxShadow:
                    'inset 0 2px 8px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(255,255,255,0.03)',
                  border: '2px solid #3E2723',
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        currentSide === 'A'
                          ? 'bg-vintage-gold text-vintage-brown'
                          : 'bg-vintage-brownLight text-vintage-paper/60'
                      }`}
                    >
                      SIDE {currentSide}
                    </span>
                    {isPlaying && (
                      <span className="flex items-center gap-1 text-vintage-brick text-[10px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-vintage-brick animate-pulse" />
                        PLAY
                      </span>
                    )}
                  </div>
                  <div className="text-vintage-gold/40 text-[10px] font-mono">
                    WM-1985
                  </div>
                </div>

                <div
                  className={`relative perspective-1000 transition-transform duration-500 ${
                    isFlipping ? 'animate-tape-flip' : ''
                  }`}
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="crate relative rounded-lg py-6 px-4"
                    style={{
                      background:
                        'linear-gradient(180deg, #2a1810 0%, #1a0f08 50%, #0d0704 100%)',
                      border: '2px solid #4a3728',
                      boxShadow:
                        'inset 0 2px 4px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="absolute top-2 left-2 right-2 h-14 rounded opacity-80"
                      style={{
                        background:
                          'linear-gradient(180deg, #f5e6c8 0%, #e8d4a8 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="h-full flex flex-col items-center justify-center px-3">
                        <p className="text-vintage-ink text-[10px] font-bold font-serif truncate w-full text-center">
                          {currentSong ? currentSong.title : '怀旧金曲精选'}
                        </p>
                        <p className="text-vintage-inkLight text-[9px] mt-0.5 truncate w-full text-center">
                          {currentSong
                            ? `${currentSong.artist} · ${currentSong.year}`
                            : 'Various Artists'}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="w-8 h-0.5 bg-vintage-ink/20" />
                          <span className="text-vintage-ink/40 text-[8px]">
                            SIDE {currentSide}
                          </span>
                          <span className="w-8 h-0.5 bg-vintage-ink/20" />
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-16 flex justify-between items-center px-4">
                      <div
                        className={`relative w-14 h-14 rounded-full ${
                          isPlaying ? 'animate-spin-slow' : ''
                        }`}
                        style={{
                          background:
                            'radial-gradient(circle, #5D4037 0%, #3E2723 40%, #2C1810 60%, transparent 61%)',
                          boxShadow:
                            'inset 0 2px 4px rgba(0,0,0,0.4), 0 0 0 3px #4a3728, 0 0 0 5px #2C1810',
                          animationDuration: '3s',
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(0,0,0,0.15) 10deg 12deg)',
                          }}
                        />
                        <div className="absolute inset-5 rounded-full bg-vintage-brownDark border border-vintage-gold/20" />
                      </div>

                      <div className="flex-1 mx-4 h-6 relative rounded overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(180deg, #0d0704 0%, #1a0f08 100%)',
                          border: '1px solid #3E2723',
                        }}
                      >
                        {isPlaying && (
                          <>
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-vintage-gold/20 blur-md animate-pulse" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-vintage-brick/20 blur-md animate-pulse" />
                            <div className="absolute inset-0 flex items-end justify-around px-1 pb-1">
                              {[...Array(12)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-gradient-to-t from-vintage-gold to-vintage-gold/30 rounded-t animate-eq-bar"
                                  style={{
                                    height: `${30 + Math.random() * 70}%`,
                                    animationDelay: `${i * 80}ms`,
                                    animationDuration: `${0.4 + Math.random() * 0.4}s`,
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div
                        className={`relative w-14 h-14 rounded-full ${
                          isPlaying ? 'animate-spin-slow' : ''
                        }`}
                        style={{
                          background:
                            'radial-gradient(circle, #5D4037 0%, #3E2723 40%, #2C1810 60%, transparent 61%)',
                          boxShadow:
                            'inset 0 2px 4px rgba(0,0,0,0.4), 0 0 0 3px #4a3728, 0 0 0 5px #2C1810',
                          animationDuration: '3s',
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(0,0,0,0.15) 10deg 12deg)',
                          }}
                        />
                        <div className="absolute inset-5 rounded-full bg-vintage-brownDark border border-vintage-gold/20" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-6">
                      <div className="w-4 h-1 rounded bg-vintage-brownDark" />
                      <div className="w-4 h-1 rounded bg-vintage-brownDark" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[10px] text-vintage-gold/40 font-mono">
                  <span>REV ◁▷ FWD</span>
                  <span>DOLBY NR</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handlePrev}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-100 ${
                    pressedButton === 'prev'
                      ? 'scale-95 translate-y-0.5'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background:
                      'linear-gradient(145deg, #5D4037 0%, #3E2723 100%)',
                    boxShadow:
                      pressedButton === 'prev'
                        ? 'inset 0 2px 4px rgba(0,0,0,0.4)'
                        : '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                    border: '2px solid #4a3728',
                  }}
                >
                  <SkipBack size={18} className="text-vintage-gold" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-100 ${
                    pressedButton === 'play'
                      ? 'scale-95 translate-y-0.5'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: isPlaying
                      ? 'linear-gradient(145deg, #B7410E 0%, #8a3109 100%)'
                      : 'linear-gradient(145deg, #D4AF37 0%, #B8941F 100%)',
                    boxShadow:
                      pressedButton === 'play'
                        ? 'inset 0 2px 6px rgba(0,0,0,0.4)'
                        : `0 6px 16px ${
                            isPlaying
                              ? 'rgba(183,65,14,0.4)'
                              : 'rgba(212,175,55,0.4)'
                          }, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    border: isPlaying
                      ? '2px solid #D46233'
                      : '2px solid #E8C96A',
                  }}
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-vintage-paper" />
                  ) : (
                    <Play size={24} className="text-vintage-brown ml-1" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-100 ${
                    pressedButton === 'next'
                      ? 'scale-95 translate-y-0.5'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background:
                      'linear-gradient(145deg, #5D4037 0%, #3E2723 100%)',
                    boxShadow:
                      pressedButton === 'next'
                        ? 'inset 0 2px 4px rgba(0,0,0,0.4)'
                        : '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                    border: '2px solid #4a3728',
                  }}
                >
                  <SkipForward size={18} className="text-vintage-gold" />
                </button>
              </div>

              <div className="flex items-center justify-between px-2">
                <button
                  onClick={handleFlip}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-100 ${
                    pressedButton === 'flip'
                      ? 'scale-95 translate-y-0.5'
                      : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    background:
                      'linear-gradient(145deg, #2F4538 0%, #1a2820 100%)',
                    boxShadow:
                      pressedButton === 'flip'
                        ? 'inset 0 2px 4px rgba(0,0,0,0.4)'
                        : '0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                    border: '2px solid #4A6B5A',
                  }}
                >
                  <RotateCcw
                    size={16}
                    className={`text-vintage-mossLight ${
                      isFlipping ? 'animate-spin' : ''
                    }`}
                  />
                  <span className="text-vintage-mossLight">翻面</span>
                </button>

                <div className="flex items-center gap-3">
                  {volume === 0 ? (
                    <VolumeX size={16} className="text-vintage-inkLight/50" />
                  ) : (
                    <Volume2
                      size={16}
                      className="text-vintage-gold/70"
                      style={{ opacity: 0.3 + (volume / 100) * 0.7 }}
                    />
                  )}
                  <div className="relative">
                    <div
                      ref={knobRef}
                      onMouseDown={handleKnobMouseDown}
                      className="w-14 h-14 rounded-full cursor-grab active:cursor-grabbing relative"
                      style={{
                        background:
                          'radial-gradient(circle at 35% 30%, #8a7560 0%, #5D4037 40%, #3E2723 70%, #2C1810 100%)',
                        boxShadow:
                          '0 4px 10px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.3)',
                        border: '2px solid #4a3728',
                      }}
                    >
                      <div
                        className="absolute inset-0 flex items-start justify-center pt-1"
                        style={{ transform: `rotate(${knobAngle}deg)` }}
                      >
                        <div className="w-1 h-4 rounded-full bg-vintage-gold shadow-[0_0_4px_rgba(212,175,55,0.6)]" />
                      </div>
                      <div className="absolute inset-3 rounded-full bg-vintage-brownDark/50 border border-vintage-gold/10 flex items-center justify-center">
                        <span className="text-vintage-gold text-[10px] font-bold font-mono">
                          {volume}
                        </span>
                      </div>
                    </div>
                    <div className="absolute -inset-1 rounded-full pointer-events-none"
                      style={{
                        background:
                          'conic-gradient(from 135deg, transparent 0deg, rgba(212,175,55,0.3) ' +
                          ((volume / 100) * 270) +
                          'deg, transparent ' +
                          ((volume / 100) * 270) +
                          'deg)',
                        WebkitMask:
                          'radial-gradient(circle, transparent 52%, black 54%)',
                        mask: 'radial-gradient(circle, transparent 52%, black 54%)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 pt-2">
                <span className="text-vintage-gold/30 text-[10px] font-mono">
                  VOL
                </span>
                <div className="flex-1 h-1 mx-2 rounded-full bg-vintage-brownDark overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${volume}%`,
                      background:
                        'linear-gradient(90deg, #B8941F, #D4AF37, #E8C96A)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShop && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="vintage-card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-popup-bounce-in">
            <div className="flex items-center justify-between p-5 border-b border-vintage-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-vintage-brick/15 flex items-center justify-center">
                  <ShoppingBag size={22} className="text-vintage-brick" />
                </div>
                <div>
                  <h2 className="vintage-heading text-xl text-vintage-ink">
                    里程兑换商店
                  </h2>
                  <p className="text-vintage-inkLight text-xs">
                    当前里程:{' '}
                    <span className="text-vintage-brick font-bold">
                      {tapeMileage} km
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShop(false)}
                className="text-vintage-inkLight/50 hover:text-vintage-ink transition-colors p-1"
              >
                <X size={22} />
              </button>
            </div>

            <div className="border-b border-vintage-gold/20 flex">
              <button
                onClick={() => setActiveShopTab('shop')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeShopTab === 'shop'
                    ? 'text-vintage-gold border-b-2 border-vintage-gold bg-vintage-gold/5'
                    : 'text-vintage-inkLight/70 hover:text-vintage-ink'
                }`}
              >
                <ShoppingBag size={14} className="inline mr-1.5" />
                兑换商店
              </button>
              <button
                onClick={() => setActiveShopTab('owned')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeShopTab === 'owned'
                    ? 'text-vintage-gold border-b-2 border-vintage-gold bg-vintage-gold/5'
                    : 'text-vintage-inkLight/70 hover:text-vintage-ink'
                }`}
              >
                <Check size={14} className="inline mr-1.5" />
                我的收藏 ({ownedRewards.length})
              </button>
            </div>

            {redeemMessage && (
              <div
                className={`mx-5 mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                  redeemMessage.type === 'success'
                    ? 'bg-vintage-moss/10 border border-vintage-moss/30 text-vintage-moss'
                    : 'bg-vintage-brick/10 border border-vintage-brick/30 text-vintage-brick'
                }`}
              >
                {redeemMessage.type === 'success' ? (
                  <Check size={18} />
                ) : (
                  <Lock size={18} />
                )}
                {redeemMessage.text}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5">
              {activeShopTab === 'owned' && ownedRewards.length === 0 ? (
                <div className="text-center py-16">
                  <Sparkles
                    size={48}
                    className="mx-auto text-vintage-gold/30 mb-4"
                  />
                  <p className="text-vintage-inkLight font-serif mb-2">
                    还没有兑换任何奖励
                  </p>
                  <p className="text-vintage-inkLight/60 text-xs font-serif">
                    快去使用随身听累积里程，兑换心仪的怀旧纪念品吧！
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayRewards.map((reward) => {
                    const owned = hasReward(reward.id);
                    const canAfford = tapeMileage >= reward.cost;
                    const Icon = typeIcons[reward.type];
                    const style = rarityStyles[reward.rarity];

                    return (
                      <div
                        key={reward.id}
                        className={`rounded-xl border-2 overflow-hidden transition-all ${style.border} ${style.glow} bg-vintage-paperLight/50`}
                      >
                        <div className="aspect-[4/3] bg-vintage-brownLight/30 relative overflow-hidden">
                          {reward.imageUrl ? (
                            <img
                              src={reward.imageUrl}
                              alt={reward.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl">{reward.emoji}</span>
                            </div>
                          )}
                          {reward.rarity === 'legendary' && (
                            <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-vintage-brick text-vintage-paper text-[10px] font-bold flex items-center gap-1">
                              <Sparkles size={10} />
                              传说
                            </span>
                          )}
                          {owned && (
                            <div className="absolute inset-0 bg-vintage-moss/70 flex items-center justify-center">
                              <div className="text-center text-vintage-paper">
                                <Check size={36} className="mx-auto mb-1" />
                                <p className="text-sm font-bold">已获得</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={14} className="text-vintage-gold" />
                            <span className="text-[10px] text-vintage-inkLight/70">
                              {typeLabels[reward.type]}
                            </span>
                            <span
                              className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium ${style.badge}`}
                            >
                              {style.label}
                            </span>
                          </div>
                          <h3 className="font-bold text-vintage-ink text-sm mb-1">
                            {reward.name}
                          </h3>
                          <p className="text-vintage-inkLight/70 text-xs mb-3 line-clamp-2">
                            {reward.description}
                          </p>
                          {activeShopTab === 'shop' && (
                            <button
                              onClick={() => handleRedeem(reward)}
                              disabled={owned || !canAfford}
                              className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                                owned
                                  ? 'bg-vintage-moss/20 text-vintage-moss cursor-default'
                                  : canAfford
                                  ? 'bg-vintage-gold text-vintage-brown hover:bg-vintage-goldLight'
                                  : 'bg-vintage-inkLight/10 text-vintage-inkLight/50 cursor-not-allowed'
                              }`}
                            >
                              {owned ? (
                                <>
                                  <Check size={14} />
                                  已拥有
                                </>
                              ) : (
                                <>
                                  <Gauge size={14} />
                                  {reward.cost} 里程兑换
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tape-flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        .animate-tape-flip {
          animation: tape-flip 0.6s ease-in-out;
          transform-style: preserve-3d;
        }
        @keyframes eq-bar {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-eq-bar {
          animation: eq-bar 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
