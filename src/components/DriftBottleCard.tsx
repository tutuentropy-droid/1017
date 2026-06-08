import { Music, MessageCircle, User, Clock, Send } from 'lucide-react';
import type { DriftBottle } from '@/types';

interface DriftBottleCardProps {
  bottle: DriftBottle;
  type: 'sent' | 'received';
  onReply?: (bottle: DriftBottle) => void;
  onOpen?: (bottle: DriftBottle) => void;
  compact?: boolean;
}

export default function DriftBottleCard({
  bottle,
  type,
  onReply,
  onOpen,
  compact = false,
}: DriftBottleCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  const getStatusLabel = () => {
    if (type === 'sent') {
      if (bottle.status === 'floating') return '漂流中';
      if (bottle.status === 'received') return '已被收到';
      if (bottle.status === 'replied') return '已收到回复';
    }
    if (type === 'received') {
      if (bottle.status === 'received') return '待回复';
      if (bottle.status === 'replied') return '已回复';
    }
    return '';
  };

  const getStatusColor = () => {
    if (bottle.status === 'floating') return 'bg-vintage-gold/15 text-vintage-gold border-vintage-gold/30';
    if (bottle.status === 'received') return 'bg-vintage-moss/15 text-vintage-moss border-vintage-moss/30';
    if (bottle.status === 'replied') return 'bg-vintage-brick/15 text-vintage-brick border-vintage-brick/30';
    return '';
  };

  const displayUser =
    type === 'sent'
      ? { nickname: bottle.reply?.replierNickname, avatar: bottle.reply?.replierAvatar }
      : { nickname: bottle.senderNickname, avatar: bottle.senderAvatar };

  const displayLyric = type === 'sent' && bottle.reply ? bottle.reply.lyric : bottle.lyric;
  const displayStory = type === 'sent' && bottle.reply ? bottle.reply.story : bottle.story;
  const displaySong =
    type === 'sent' && bottle.reply
      ? { title: bottle.reply.songTitle, artist: bottle.reply.songArtist }
      : { title: bottle.songTitle, artist: bottle.songArtist };

  return (
    <div className="vintage-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-vintage-lg">
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {displayUser?.avatar ? (
              <img
                src={displayUser.avatar}
                alt={displayUser.nickname}
                className="w-10 h-10 rounded-full border-2 border-vintage-gold/40 object-cover bg-vintage-paper"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-vintage-gold/40 bg-vintage-brown/30 flex items-center justify-center">
                <User size={18} className="text-vintage-brown/60" />
              </div>
            )}
            <div>
              <p className="text-vintage-brown text-sm font-medium">
                {type === 'sent' && bottle.reply ? bottle.reply.replierNickname : displayUser?.nickname || '匿名知己'}
              </p>
              <div className="flex items-center gap-1 text-vintage-inkLight/50 text-xs">
                <Clock size={12} />
                <span>
                  {formatDate(
                    type === 'sent' && bottle.reply ? bottle.reply.createdAt : bottle.createdAt
                  )}
                </span>
              </div>
            </div>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor()}`}
          >
            {getStatusLabel()}
          </span>
        </div>

        {displaySong?.title && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-vintage-gold/5 border border-vintage-gold/10">
            <Music size={16} className="text-vintage-gold" />
            <span className="text-vintage-brown text-sm font-medium">{displaySong.title}</span>
            {displaySong.artist && (
              <span className="text-vintage-inkLight/60 text-xs">· {displaySong.artist}</span>
            )}
          </div>
        )}

        <div className="relative mb-3">
          <span className="quote-mark absolute -top-4 -left-2 select-none">"</span>
          <p
            className={`font-serif text-vintage-gold font-semibold italic pl-6 ${
              compact ? 'text-base' : 'text-lg'
            } leading-relaxed`}
          >
            {displayLyric}
          </p>
        </div>

        <div className="pl-6">
          <p
            className={`font-serif text-vintage-ink leading-relaxed ${
              compact ? 'text-sm line-clamp-3' : 'text-sm'
            }`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {displayStory}
          </p>
        </div>

        {type === 'received' && bottle.status === 'received' && onReply && (
          <div className="mt-5 pt-4 border-t border-vintage-gold/20">
            <button
              onClick={() => onReply(bottle)}
              className="w-full vintage-btn-gold py-2.5 text-sm"
            >
              <MessageCircle size={16} />
              <span>回复我的歌词记忆</span>
            </button>
          </div>
        )}

        {type === 'sent' && bottle.status === 'floating' && (
          <div className="mt-5 pt-4 border-t border-vintage-gold/20">
            <div className="flex items-center justify-center gap-2 text-vintage-inkLight/60 text-sm">
              <Send size={14} className="animate-pulse" />
              <span>正在茫茫人海中寻找有缘人…</span>
            </div>
          </div>
        )}

        {type === 'sent' && bottle.status === 'replied' && onOpen && (
          <div className="mt-5 pt-4 border-t border-vintage-gold/20">
            <button
              onClick={() => onOpen(bottle)}
              className="w-full vintage-btn-outline py-2.5 text-sm"
            >
              <MessageCircle size={16} />
              <span>查看完整对话</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
