import { useState } from 'react';
import { Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Story, Song } from '@/types';
import { useStoryStore } from '@/store/storyStore';
import { useUserStore } from '@/store/userStore';
import { mockUsers } from '@/data/users';
import { mockSongs } from '@/data/songs';

interface StoryCardProps {
  story: Story;
  showSongInfo?: boolean;
  compact?: boolean;
}

export default function StoryCard({
  story,
  showSongInfo = true,
  compact = false,
}: StoryCardProps) {
  const user = mockUsers.find((u) => u.id === story.userId);
  const song = mockSongs.find((s) => s.id === story.songId) as Song | undefined;
  useUserStore();
  const { likeStory, unlikeStory } = useStoryStore();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      unlikeStory(story.id);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      likeStory(story.id);
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="vintage-card overflow-hidden">
      {showSongInfo && song && (
        <Link
          to={`/song/${song.id}`}
          className="flex items-center gap-3 p-4 border-b border-vintage-gold/20 bg-vintage-gold/5 hover:bg-vintage-gold/10 transition-colors"
        >
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover shadow-vintage"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-vintage-brown font-semibold truncate">
              {song.title}
            </h4>
            <p className="text-vintage-inkLight/70 text-sm truncate">
              {song.artist} · {song.year}
            </p>
          </div>
        </Link>
      )}

      <div className={`${compact ? 'p-4' : 'p-5 md:p-6'}`}>
        <div className="relative">
          <span className="quote-mark absolute -top-4 -left-2 select-none">"</span>
          <p
            className={`font-serif text-vintage-ink leading-relaxed pl-6 ${
              compact ? 'text-sm line-clamp-3' : 'text-base'
            }`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {story.content}
          </p>
          <span className="quote-mark absolute -bottom-8 right-0 rotate-180 select-none">"</span>
        </div>
      </div>

      <div className="px-5 pb-5 md:px-6 md:pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-9 h-9 rounded-full border-2 border-vintage-gold/40 object-cover bg-vintage-paper"
            />
          ) : (
            <div className="w-9 h-9 rounded-full border-2 border-vintage-gold/40 bg-vintage-brown/30 flex items-center justify-center">
              <User size={16} className="text-vintage-brown/60" />
            </div>
          )}
          <div>
            <p className="text-vintage-brown text-sm font-medium">
              {user?.nickname || '匿名用户'}
            </p>
            <p className="text-vintage-inkLight/50 text-xs">
              {formatDate(story.createdAt)}
            </p>
          </div>
        </div>

        <button
          onClick={toggleLike}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background: liked ? 'rgba(183, 65, 14, 0.15)' : 'rgba(62, 39, 35, 0.05)',
          }}
        >
          <Heart
            size={16}
            className={liked ? 'fill-vintage-brick text-vintage-brick' : 'text-vintage-brick/70'}
          />
          <span
            className={`text-sm font-medium ${
              liked ? 'text-vintage-brick' : 'text-vintage-inkLight/70'
            }`}
          >
            {likeCount}
          </span>
        </button>
      </div>
    </div>
  );
}
