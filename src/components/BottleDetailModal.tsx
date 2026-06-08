import { useEffect } from 'react';
import { X, Music, MessageCircleHeart, Award } from 'lucide-react';
import type { DriftBottle } from '@/types';
import { FRIEND_BADGE } from '@/data/driftBottles';

interface BottleDetailModalProps {
  isOpen: boolean;
  bottle: DriftBottle | null;
  onClose: () => void;
  showBadgeNotification?: boolean;
}

export default function BottleDetailModal({
  isOpen,
  bottle,
  onClose,
  showBadgeNotification = false,
}: BottleDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !bottle) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-vintage-brownDark/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl vintage-card animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-vintage-brown/60 hover:text-vintage-brown hover:bg-vintage-brown/10 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {showBadgeNotification && (
          <div className="relative z-10 p-4 bg-gradient-to-r from-vintage-gold/20 via-vintage-gold/10 to-vintage-gold/20 border-b border-vintage-gold/30">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-vintage-gold flex items-center justify-center text-3xl shadow-vintage animate-bounce">
                {FRIEND_BADGE.icon}
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Award size={18} className="text-vintage-gold" />
                  <p className="font-display text-vintage-gold text-lg font-bold">
                    获得新徽章！
                  </p>
                </div>
                <p className="text-vintage-brown text-sm font-medium mt-0.5">
                  「{FRIEND_BADGE.name}」
                </p>
                <p className="text-vintage-inkLight/70 text-xs font-serif mt-1">
                  {FRIEND_BADGE.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          <div className="text-center">
            <h3 className="font-display text-vintage-brown text-2xl font-semibold mb-2">
              🍾 漂流瓶的故事
            </h3>
            <p className="text-vintage-inkLight/60 text-sm font-serif">
              海内存知己，天涯若比邻
            </p>
          </div>

          <div className="vintage-divider" />

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-vintage-gold/5 border border-vintage-gold/20">
              <img
                src={bottle.senderAvatar}
                alt={bottle.senderNickname}
                className="w-12 h-12 rounded-full border-2 border-vintage-gold/40 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-vintage-brown font-semibold">{bottle.senderNickname}</p>
                  <p className="text-vintage-inkLight/50 text-xs">{formatDate(bottle.createdAt)}</p>
                </div>
                {bottle.songTitle && (
                  <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded bg-vintage-gold/10 inline-flex">
                    <Music size={14} className="text-vintage-gold" />
                    <span className="text-vintage-brown text-sm">
                      {bottle.songTitle}
                      {bottle.songArtist && ` · ${bottle.songArtist}`}
                    </span>
                  </div>
                )}
                <p className="font-serif text-vintage-gold italic text-lg mb-3">
                  "{bottle.lyric}"
                </p>
                <p className="font-serif text-vintage-ink leading-relaxed text-sm">
                  {bottle.story}
                </p>
              </div>
            </div>

            {bottle.reply && (
              <>
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-brick/10 border border-vintage-brick/20">
                    <MessageCircleHeart size={16} className="text-vintage-brick" />
                    <span className="text-vintage-brick text-xs font-medium">来自远方的回复</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-vintage-brick/5 border border-vintage-brick/20">
                  <img
                    src={bottle.reply.replierAvatar}
                    alt={bottle.reply.replierNickname}
                    className="w-12 h-12 rounded-full border-2 border-vintage-brick/40 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-vintage-brown font-semibold">{bottle.reply.replierNickname}</p>
                      <p className="text-vintage-inkLight/50 text-xs">
                        {formatDate(bottle.reply.createdAt)}
                      </p>
                    </div>
                    {bottle.reply.songTitle && (
                      <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded bg-vintage-gold/10 inline-flex">
                        <Music size={14} className="text-vintage-gold" />
                        <span className="text-vintage-brown text-sm">
                          {bottle.reply.songTitle}
                          {bottle.reply.songArtist && ` · ${bottle.reply.songArtist}`}
                        </span>
                      </div>
                    )}
                    <p className="font-serif text-vintage-gold italic text-lg mb-3">
                      "{bottle.reply.lyric}"
                    </p>
                    <p className="font-serif text-vintage-ink leading-relaxed text-sm">
                      {bottle.reply.story}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {!bottle.reply && (
            <div className="p-4 rounded-xl bg-vintage-brown/5 border border-vintage-gold/10 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-vintage-gold/10 flex items-center justify-center">
                <MessageCircleHeart size={20} className="text-vintage-gold" />
              </div>
              <p className="text-vintage-inkLight/60 text-sm font-serif">
                正在等待远方的知音回应…
              </p>
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 border-t border-vintage-gold/20 bg-vintage-paper/50">
          <div className="flex justify-center">
            <button onClick={onClose} className="vintage-btn-outline px-8">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
