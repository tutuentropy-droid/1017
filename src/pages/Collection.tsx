import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Music, PenLine, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import SongCard from '@/components/SongCard';
import StoryModal from '@/components/StoryModal';
import { useCollectionStore } from '@/store/collectionStore';
import { useUserStore } from '@/store/userStore';
import { useStoryStore } from '@/store/storyStore';
import { mockSongs } from '@/data/songs';
import type { Song } from '@/types';

export default function Collection() {
  const { currentUser } = useUserStore();
  const { getUserCollections, removeCollection } = useCollectionStore();
  const { getStoryByUserAndSong, deleteStory } = useStoryStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalSong, setModalSong] = useState<Song | null>(null);

  const collections = getUserCollections(currentUser.id);
  const collectedSongs = collections
    .map((c) => mockSongs.find((s) => s.id === c.songId))
    .filter(Boolean) as Song[];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRemove = (e: React.MouseEvent, songId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('确定要取消收藏这首歌吗？')) {
      removeCollection(currentUser.id, songId);
    }
  };

  const handleDeleteStory = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个故事吗？')) {
      deleteStory(storyId);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-brownDark">
      {/* Header */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-vintage-brick/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-brick/15 border border-vintage-brick/30 mb-6">
              <Heart size={16} className="text-vintage-brickLight" />
              <span className="text-vintage-brickLight/90 text-sm">
                {collectedSongs.length} 首收藏
              </span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              我的收藏
            </h1>
            <p className="text-vintage-paper/70 text-lg font-serif leading-relaxed">
              每一首收藏的歌，都藏着一段不愿忘却的时光
            </p>
          </div>
        </div>
      </section>

      {/* Collection List */}
      <section className="py-12 md:py-16">
        <div className="container">
          {collectedSongs.length > 0 ? (
            <div className="space-y-4">
              {collectedSongs.map((song) => {
                const story = getStoryByUserAndSong(currentUser.id, song.id);
                const isExpanded = expandedId === song.id;

                return (
                  <div
                    key={song.id}
                    className="vintage-card overflow-hidden transition-all duration-300"
                  >
                    <div
                      className="p-4 md:p-5 flex items-center gap-4 cursor-pointer hover:bg-vintage-gold/5 transition-colors"
                      onClick={() => toggleExpand(song.id)}
                    >
                      <Link
                        to={`/song/${song.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0"
                      >
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-vintage hover:shadow-vintage-lg transition-shadow"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/song/${song.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-display text-xl md:text-2xl text-vintage-brown font-semibold hover:text-vintage-brick transition-colors"
                        >
                          {song.title}
                        </Link>
                        <p className="text-vintage-inkLight/70 text-sm mt-0.5">
                          {song.artist} · {song.year} · {song.album}
                        </p>
                        {story && (
                          <p className="text-vintage-moss text-xs mt-1 flex items-center gap-1">
                            <PenLine size={12} />
                            <span>
                              已写故事 · {story.isPublic ? '已公开' : '仅自己可见'}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleRemove(e, song.id)}
                          className="p-2 rounded-full text-vintage-inkLight/50 hover:text-vintage-brick hover:bg-vintage-brick/10 transition-colors"
                          title="取消收藏"
                        >
                          <Trash2 size={18} />
                        </button>
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-vintage-gold" />
                        ) : (
                          <ChevronDown
                            size={20}
                            className="text-vintage-inkLight/50"
                          />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 md:px-5 pb-5 border-t border-vintage-gold/20 animate-fade-in">
                        <div className="pt-5">
                          {story ? (
                            <div className="bg-vintage-gold/5 rounded-xl p-5 border border-vintage-gold/20">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-vintage-moss font-medium flex items-center gap-1">
                                  {story.isPublic ? '公开故事' : '私密故事'}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setModalSong(song)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-vintage-gold/15 text-vintage-brown hover:bg-vintage-gold/25 transition-colors font-medium"
                                  >
                                    编辑
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteStory(e, story.id)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-vintage-brick/10 text-vintage-brick hover:bg-vintage-brick/20 transition-colors font-medium"
                                  >
                                    删除
                                  </button>
                                </div>
                              </div>
                              <p
                                className="font-serif text-vintage-ink leading-relaxed"
                                style={{ whiteSpace: 'pre-wrap' }}
                              >
                                {story.content}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-vintage-inkLight/5 rounded-xl p-5 border border-dashed border-vintage-gold/30">
                              <p className="text-vintage-inkLight/60 font-serif">
                                还没有为这首歌写下故事
                              </p>
                              <button
                                onClick={() => setModalSong(song)}
                                className="vintage-btn-gold text-sm py-2 px-4"
                              >
                                <PenLine size={16} />
                                <span>写故事</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-vintage-brown flex items-center justify-center">
                <Heart size={44} className="text-vintage-gold/30" />
              </div>
              <p className="text-vintage-paper/60 text-xl font-serif mb-2">
                还没有收藏任何歌曲
              </p>
              <p className="text-vintage-paper/40 text-sm font-serif mb-8">
                在歌曲详情页点击收藏，把珍爱的旋律珍藏起来
              </p>
              <Link to="/timeline" className="vintage-btn-gold">
                <Music size={18} />
                <span>去发现好歌</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {modalSong && (
        <StoryModal
          isOpen={!!modalSong}
          onClose={() => setModalSong(null)}
          song={modalSong}
          existingStory={
            (() => {
              const s = getStoryByUserAndSong(currentUser.id, modalSong.id);
              return s
                ? { id: s.id, content: s.content, isPublic: s.isPublic }
                : null;
            })()
          }
        />
      )}
    </div>
  );
}
