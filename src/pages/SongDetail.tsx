import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  PenLine,
  Music,
  BookOpen,
  Calendar,
  Disc3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import StoryModal from '@/components/StoryModal';
import { mockSongs } from '@/data/songs';
import { useStoryStore } from '@/store/storyStore';
import { useCollectionStore } from '@/store/collectionStore';
import { useUserStore } from '@/store/userStore';

export default function SongDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const song = mockSongs.find((s) => s.id === id);
  const { currentUser } = useUserStore();
  const { isCollected, addCollection, removeCollection } = useCollectionStore();
  const { getStoriesBySong, getStoryByUserAndSong } = useStoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!song) {
    return (
      <div className="min-h-screen bg-vintage-brownDark flex items-center justify-center">
        <div className="text-center">
          <Music size={64} className="mx-auto mb-4 text-vintage-gold/30" />
          <p className="text-vintage-paper/60 text-xl font-serif mb-4">
            未找到这首歌
          </p>
          <Link to="/timeline" className="vintage-btn-outline">
            <ArrowLeft size={18} />
            <span>返回年代索引</span>
          </Link>
        </div>
      </div>
    );
  }

  const collected = isCollected(currentUser.id, song.id);
  const stories = getStoriesBySong(song.id);
  const myStory = getStoryByUserAndSong(currentUser.id, song.id);

  const currentIndex = mockSongs.findIndex((s) => s.id === song.id);
  const prevSong = currentIndex > 0 ? mockSongs[currentIndex - 1] : null;
  const nextSong =
    currentIndex < mockSongs.length - 1 ? mockSongs[currentIndex + 1] : null;

  const toggleCollect = () => {
    if (collected) {
      removeCollection(currentUser.id, song.id);
    } else {
      addCollection(currentUser.id, song.id);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-brownDark">
      {/* Top Bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-vintage-brownDark/95 backdrop-blur-md border-b border-vintage-gold/10">
        <div className="container py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-vintage-paper/70 hover:text-vintage-gold transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>返回</span>
          </button>

          <div className="flex items-center gap-2">
            {prevSong && (
              <Link
                to={`/song/${prevSong.id}`}
                className="p-2 rounded-full text-vintage-paper/60 hover:text-vintage-gold hover:bg-vintage-gold/10 transition-colors"
                title={`上一首：${prevSong.title}`}
              >
                <ChevronLeft size={20} />
              </Link>
            )}
            {nextSong && (
              <Link
                to={`/song/${nextSong.id}`}
                className="p-2 rounded-full text-vintage-paper/60 hover:text-vintage-gold hover:bg-vintage-gold/10 transition-colors"
                title={`下一首：${nextSong.title}`}
              >
                <ChevronRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Song Info */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${song.coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-vintage-brownDark/90 via-vintage-brownDark/95 to-vintage-brownDark" />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Cover */}
            <div className="lg:col-span-2">
              <div className="relative max-w-sm mx-auto lg:mx-0">
                <div className="absolute -inset-4 bg-vintage-gold/5 rounded-3xl" />
                <div className="relative group">
                  <div className="absolute inset-0 vinyl-record animate-spin-slow opacity-60 blur-sm" />
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="relative w-full aspect-square rounded-2xl object-cover shadow-vintage-lg border-4 border-vintage-gold/30"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-vintage-brownDark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={toggleCollect}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                      collected
                        ? 'bg-vintage-brick/20 text-vintage-brickLight border border-vintage-brick/40'
                        : 'bg-vintage-gold/10 text-vintage-gold border border-vintage-gold/30 hover:bg-vintage-gold/20'
                    }`}
                  >
                    <Heart
                      size={20}
                      className={collected ? 'fill-current' : ''}
                    />
                    <span>{collected ? '已收藏' : '收藏'}</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="vintage-btn-gold"
                  >
                    <PenLine size={18} />
                    <span>{myStory ? '编辑故事' : '写下回忆'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-vintage-gold/15 text-vintage-gold text-sm font-medium rounded-full border border-vintage-gold/30">
                  {song.year}
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-vintage-gold font-bold mb-3">
                {song.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-8 text-vintage-paper/70 font-serif">
                <span className="flex items-center gap-1.5">
                  <Disc3 size={16} className="text-vintage-gold/60" />
                  <span>歌手：{song.artist}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-vintage-gold/60" />
                  <span>专辑：{song.album}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-vintage-gold/60" />
                  <span>发行：{song.year}年</span>
                </span>
              </div>

              {/* Lyrics */}
              <div className="vintage-card p-6 md:p-8">
                <h3 className="font-display text-xl text-vintage-brown font-semibold mb-4 flex items-center gap-2">
                  <Music size={20} className="text-vintage-brick" />
                  <span>歌词</span>
                </h3>
                <div className="vintage-divider mb-5" />
                <div
                  className="font-serif text-vintage-ink text-base md:text-lg leading-loose text-center whitespace-pre-wrap italic"
                  style={{
                    backgroundImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(62, 39, 35, 0.02) 100%)',
                  }}
                >
                  {song.lyrics}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-12 md:py-16 bg-vintage-brown">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="vintage-heading text-2xl md:text-3xl mb-2">
                关于这首歌的记忆
              </h2>
              <p className="text-vintage-paper/60 font-serif">
                共 {stories.length} 个故事
              </p>
            </div>
          </div>

          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} showSongInfo={false} />
              ))}
            </div>
          ) : (
            <div className="vintage-card p-12 text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-vintage-gold/30" />
              <p className="text-vintage-inkLight/70 font-serif text-lg mb-4">
                还没有人写下关于这首歌的故事
              </p>
              <p className="text-vintage-inkLight/50 text-sm mb-6">
                成为第一个分享回忆的人吧
              </p>
              <button onClick={() => setIsModalOpen(true)} className="vintage-btn-gold">
                <PenLine size={18} />
                <span>写下第一个故事</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <StoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        song={song}
        existingStory={
          myStory
            ? { id: myStory.id, content: myStory.content, isPublic: myStory.isPublic }
            : null
        }
      />
    </div>
  );
}
