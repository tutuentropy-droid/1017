import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Song } from '@/types';
import { useCollectionStore } from '@/store/collectionStore';
import { useUserStore } from '@/store/userStore';

interface SongCardProps {
  song: Song;
  showCollect?: boolean;
}

export default function SongCard({ song, showCollect = true }: SongCardProps) {
  const { currentUser } = useUserStore();
  const { isCollected, addCollection, removeCollection } = useCollectionStore();
  const collected = isCollected(currentUser.id, song.id);

  const toggleCollect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (collected) {
      removeCollection(currentUser.id, song.id);
    } else {
      addCollection(currentUser.id, song.id);
    }
  };

  return (
    <Link
      to={`/song/${song.id}`}
      className="vintage-card group overflow-hidden block hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vintage-brown/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-vintage-gold/90 text-vintage-brown text-xs font-bold rounded-full backdrop-blur-sm">
            {song.year}
          </span>
        </div>
        {showCollect && (
          <button
            onClick={toggleCollect}
            className="absolute top-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: collected
                ? 'rgba(183, 65, 14, 0.9)'
                : 'rgba(62, 39, 35, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Heart
              size={18}
              className={collected ? 'fill-vintage-paper text-vintage-paper' : 'text-vintage-paper/80'}
            />
          </button>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-lg md:text-xl text-vintage-paper font-semibold truncate">
            {song.title}
          </h3>
        </div>
      </div>
      <div className="p-4 border-t border-vintage-gold/20 bg-vintage-paperLight/50">
        <p className="text-vintage-inkLight text-sm truncate">
          <span className="text-vintage-brick font-medium">歌手：</span>
          {song.artist}
        </p>
        <p className="text-vintage-inkLight/70 text-xs mt-1 truncate">
          <span className="text-vintage-moss font-medium">专辑：</span>
          {song.album}
        </p>
      </div>
    </Link>
  );
}
