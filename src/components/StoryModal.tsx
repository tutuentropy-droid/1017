import { useState, useEffect } from 'react';
import { X, Send, Lock, Unlock } from 'lucide-react';
import type { Song } from '@/types';
import { useStoryStore } from '@/store/storyStore';
import { useUserStore } from '@/store/userStore';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  existingStory?: {
    id: string;
    content: string;
    isPublic: boolean;
  } | null;
}

export default function StoryModal({
  isOpen,
  onClose,
  song,
  existingStory = null,
}: StoryModalProps) {
  const [content, setContent] = useState(existingStory?.content || '');
  const [isPublic, setIsPublic] = useState(existingStory?.isPublic ?? true);
  const { addStory, updateStory } = useStoryStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      setContent(existingStory?.content || '');
      setIsPublic(existingStory?.isPublic ?? true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, existingStory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (existingStory?.id) {
      updateStory(existingStory.id, content.trim(), isPublic);
    } else {
      addStory(currentUser.id, song.id, content.trim(), isPublic);
    }
    onClose();
    setContent('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-vintage-brownDark/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl vintage-card animate-fade-in-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-5 md:p-6 border-b border-vintage-gold/20 bg-vintage-gold/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-vintage-brown/60 hover:text-vintage-brown hover:bg-vintage-brown/10 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4 pr-10">
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-14 h-14 rounded-lg object-cover shadow-vintage"
            />
            <div className="min-w-0">
              <h3 className="font-display text-vintage-brown text-xl font-semibold truncate">
                《{song.title}》
              </h3>
              <p className="text-vintage-inkLight/70 text-sm">
                {song.artist} · {song.year}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6">
          <label className="block mb-2 font-display text-vintage-brown text-lg font-medium">
            写下你的记忆故事
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="这首歌，是否唤起了你的某段回忆？那年的你，在哪里，和谁，发生了什么故事……"
            rows={6}
            className="w-full px-4 py-3 rounded-lg border-2 border-vintage-gold/30 bg-vintage-paperLight/50 text-vintage-ink placeholder:text-vintage-inkLight/40 focus:outline-none focus:border-vintage-gold resize-none font-serif leading-relaxed transition-colors"
            style={{ whiteSpace: 'pre-wrap' }}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5">
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isPublic
                  ? 'bg-vintage-moss/15 text-vintage-moss border border-vintage-moss/30'
                  : 'bg-vintage-inkLight/10 text-vintage-inkLight border border-vintage-inkLight/20'
              }`}
            >
              {isPublic ? (
                <>
                  <Unlock size={16} />
                  <span>公开发布到记忆墙</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>仅自己可见</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-vintage-inkLight hover:text-vintage-brown hover:bg-vintage-brown/10 transition-colors font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="vintage-btn-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <Send size={16} />
                <span>{existingStory?.id ? '保存修改' : '写下回忆'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
