import { useState, useEffect } from 'react';
import { X, Music, Sparkles, Send, MessageCircleHeart } from 'lucide-react';
import type { DriftBottle } from '@/types';

interface BottleModalProps {
  isOpen: boolean;
  mode: 'create' | 'reply';
  replyToBottle?: DriftBottle;
  onClose: () => void;
  onSubmit: (data: {
    lyric: string;
    story: string;
    songTitle?: string;
    songArtist?: string;
  }) => void;
}

export default function BottleModal({
  isOpen,
  mode,
  replyToBottle,
  onClose,
  onSubmit,
}: BottleModalProps) {
  const [lyric, setLyric] = useState('');
  const [story, setStory] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLyric('');
      setStory('');
      setSongTitle('');
      setSongArtist('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = lyric.trim() && story.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      lyric: lyric.trim(),
      story: story.trim(),
      songTitle: songTitle.trim() || undefined,
      songArtist: songArtist.trim() || undefined,
    });
    onClose();
  };

  const isReply = mode === 'reply';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-vintage-brownDark/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg vintage-card animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative p-5 md:p-6 border-b border-vintage-gold/20 bg-gradient-to-r from-vintage-gold/10 to-transparent"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-vintage-brown/60 hover:text-vintage-brown hover:bg-vintage-brown/10 transition-colors z-10"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 pr-10">
            <div className="w-12 h-12 rounded-full bg-vintage-gold/15 flex items-center justify-center text-vintage-gold">
              {isReply ? <MessageCircleHeart size={24} /> : <Send size={24} />}
            </div>
            <div>
              <h3 className="font-display text-vintage-brown text-xl font-semibold">
                {isReply ? '回复漂流瓶' : '投入漂流瓶'}
              </h3>
              <p className="text-vintage-inkLight/70 text-sm font-serif">
                {isReply
                  ? '用你的歌词记忆回应远方的知音'
                  : '将你的歌词摘抄和故事，交给时光的河流'}
              </p>
            </div>
          </div>
        </div>

        {isReply && replyToBottle && (
          <div className="px-5 md:px-6 pt-5">
            <div className="p-4 rounded-lg bg-vintage-brown/5 border border-vintage-gold/20">
              <p className="text-vintage-inkLight/60 text-xs font-medium mb-2">
                TA 的歌词摘抄：
              </p>
              <p className="font-serif text-vintage-gold italic mb-2">
                "{replyToBottle.lyric}"
              </p>
              {replyToBottle.songTitle && (
                <p className="text-vintage-inkLight/50 text-xs">
                  —— {replyToBottle.songTitle}
                  {replyToBottle.songArtist && ` · ${replyToBottle.songArtist}`}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
          <div>
            <label className="text-vintage-brown text-sm font-semibold block mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-vintage-gold" />
              歌词摘抄 <span className="text-vintage-brick">*</span>
            </label>
            <textarea
              value={lyric}
              onChange={(e) => setLyric(e.target.value)}
              maxLength={100}
              rows={2}
              placeholder="写下那句触动你心弦的歌词…"
              className="w-full p-3 rounded-lg bg-vintage-paper border border-vintage-gold/30 text-vintage-ink text-base font-serif italic focus:outline-none focus:border-vintage-gold resize-none placeholder:text-vintage-inkLight/40"
            />
            <p className="text-vintage-inkLight/50 text-xs text-right mt-1">
              {lyric.length}/100
            </p>
          </div>

          <div>
            <label className="text-vintage-brown text-sm font-semibold block mb-2 flex items-center gap-2">
              <Music size={16} className="text-vintage-gold" />
              歌曲信息（选填）
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                maxLength={30}
                placeholder="歌曲名称"
                className="w-full p-2.5 rounded-lg bg-vintage-paper border border-vintage-gold/30 text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold placeholder:text-vintage-inkLight/40"
              />
              <input
                type="text"
                value={songArtist}
                onChange={(e) => setSongArtist(e.target.value)}
                maxLength={20}
                placeholder="歌手"
                className="w-full p-2.5 rounded-lg bg-vintage-paper border border-vintage-gold/30 text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold placeholder:text-vintage-inkLight/40"
              />
            </div>
          </div>

          <div>
            <label className="text-vintage-brown text-sm font-semibold block mb-2">
              背后的故事 <span className="text-vintage-brick">*</span>
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              maxLength={300}
              rows={5}
              placeholder={
                isReply
                  ? '聊聊这句歌词让你想起了什么…'
                  : '这段歌词背后，有怎样的故事和回忆？'
              }
              className="w-full p-3 rounded-lg bg-vintage-paper border border-vintage-gold/30 text-vintage-ink text-sm font-serif leading-relaxed focus:outline-none focus:border-vintage-gold resize-none placeholder:text-vintage-inkLight/40"
            />
            <p className="text-vintage-inkLight/50 text-xs text-right mt-1">
              {story.length}/300
            </p>
          </div>
        </div>

        <div className="p-5 md:p-6 border-t border-vintage-gold/20 bg-vintage-paper/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-vintage-inkLight hover:text-vintage-brown hover:bg-vintage-brown/10 transition-colors font-medium text-center"
            >
              再想想
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 sm:flex-none vintage-btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReply ? (
                <>
                  <MessageCircleHeart size={18} />
                  <span>送出回复</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>投入大海</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
