import { useState, useMemo } from 'react';
import { Music } from 'lucide-react';
import YearSelector from '@/components/YearSelector';
import SongCard from '@/components/SongCard';
import { mockSongs } from '@/data/songs';

export default function Timeline() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filteredSongs = useMemo(() => {
    if (!selectedYear) return mockSongs;
    return mockSongs.filter((song) => song.year === selectedYear);
  }, [selectedYear]);

  const sortedSongs = useMemo(() => {
    return [...filteredSongs].sort((a, b) => a.year - b.year);
  }, [filteredSongs]);

  return (
    <div className="min-h-screen bg-vintage-brownDark">
      {/* Header */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-vintage-gold/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30 mb-6">
              <Music size={16} className="text-vintage-gold" />
              <span className="text-vintage-gold/90 text-sm">1980 - 1999</span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              年代索引
            </h1>
            <p className="text-vintage-paper/70 text-lg font-serif leading-relaxed">
              选择一个年份，让时光倒流，回到那些旋律飘荡的日子
            </p>
          </div>
        </div>
      </section>

      {/* Year Selector */}
      <section className="sticky top-16 md:top-20 z-40 bg-vintage-brownDark/95 backdrop-blur-md border-y border-vintage-gold/10">
        <div className="container">
          <YearSelector
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        </div>
      </section>

      {/* Song List */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-vintage-gold font-semibold">
                {selectedYear ? `${selectedYear}年 · 经典金曲` : '全部金曲'}
              </h2>
              <p className="text-vintage-paper/50 text-sm mt-1 font-serif">
                共 {sortedSongs.length} 首歌
              </p>
            </div>
          </div>

          {sortedSongs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {sortedSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index % 8) * 50}ms` }}
                >
                  <SongCard song={song} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-vintage-brown flex items-center justify-center">
                <Music size={36} className="text-vintage-gold/40" />
              </div>
              <p className="text-vintage-paper/50 text-lg font-serif">
                这一年的回忆正在整理中…
              </p>
              <button
                onClick={() => setSelectedYear(null)}
                className="mt-4 vintage-btn-outline text-sm"
              >
                查看全部歌曲
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
