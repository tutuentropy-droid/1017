import { useState } from 'react';
import { BookOpen, Flame, Clock, Calendar } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import { useStoryStore } from '@/store/storyStore';
import type { SortType } from '@/types';

export default function MemoryWall() {
  const { getPublicStoriesSorted } = useStoryStore();
  const [sort, setSort] = useState<SortType>('latest');

  const stories = getPublicStoriesSorted(sort);

  const sortOptions: { key: SortType; label: string; icon: typeof Clock }[] = [
    { key: 'latest', label: '最新', icon: Clock },
    { key: 'hottest', label: '最热', icon: Flame },
    { key: 'year', label: '按年代', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-vintage-brownDark">
      {/* Header */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-vintage-moss/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-vintage-gold/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-moss/15 border border-vintage-moss/30 mb-6">
              <BookOpen size={16} className="text-vintage-mossLight" />
              <span className="text-vintage-mossLight/90 text-sm">
                共 {stories.length} 个故事
              </span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              记忆墙
            </h1>
            <p className="text-vintage-paper/70 text-lg font-serif leading-relaxed">
              在这里，每个人的青春都被温柔地收藏着<br />
              读别人的故事，流自己的眼泪
            </p>
          </div>
        </div>
      </section>

      {/* Sort Tabs */}
      <section className="sticky top-16 md:top-20 z-30 bg-vintage-brownDark/95 backdrop-blur-md border-b border-vintage-gold/10">
        <div className="container py-4">
          <div className="inline-flex p-1 rounded-full bg-vintage-brown border border-vintage-gold/20">
            {sortOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSort(opt.key)}
                  className={`inline-flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    sort === opt.key
                      ? 'bg-gradient-to-br from-vintage-gold to-vintage-goldDark text-vintage-brown shadow-vintage'
                      : 'text-vintage-paper/60 hover:text-vintage-gold'
                  }`}
                >
                  <Icon size={16} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index % 9) * 60}ms` }}
                >
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen size={56} className="mx-auto mb-4 text-vintage-gold/30" />
              <p className="text-vintage-paper/60 text-lg font-serif">
                记忆墙还是一片空白
              </p>
              <p className="text-vintage-paper/40 text-sm mt-1">
                去歌曲详情页写下你的第一个故事吧
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
