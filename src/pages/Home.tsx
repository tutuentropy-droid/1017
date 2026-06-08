import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Disc3,
  CalendarDays,
  Heart,
  BookOpen,
  Shuffle,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Gamepad2,
} from 'lucide-react';
import SongCard from '@/components/SongCard';
import StoryCard from '@/components/StoryCard';
import OnThisDay from '@/components/OnThisDay';
import { getRandomSong, mockSongs } from '@/data/songs';
import { useStoryStore } from '@/store/storyStore';
import type { Song } from '@/types';

export default function Home() {
  const navigate = useNavigate();
  const { getPublicStoriesSorted } = useStoryStore();
  const [randomSong, setRandomSong] = useState<Song | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const featuredStories = getPublicStoriesSorted('hottest').slice(0, 3);
  const featuredSongs = mockSongs.slice(0, 6);

  const handleRandom = () => {
    setIsShuffling(true);
    let count = 0;
    const interval = setInterval(() => {
      setRandomSong(getRandomSong());
      count++;
      if (count >= 6) {
        clearInterval(interval);
        const song = getRandomSong();
        setRandomSong(song);
        setIsShuffling(false);
        setTimeout(() => {
          navigate(`/song/${song.id}`);
        }, 600);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden noise-overlay bg-vintage-gradient">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-vintage-brick/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30 mb-6">
                <Sparkles size={16} className="text-vintage-gold" />
                <span className="text-vintage-gold/90 text-sm">献给八零九零年代</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-vintage-gold font-bold leading-tight mb-6">
                岁月如歌
                <span className="block text-vintage-paper text-3xl md:text-4xl lg:text-5xl mt-3 font-normal italic">
                  音乐里的青春记忆
                </span>
              </h1>

              <p className="text-vintage-paper/80 text-lg md:text-xl leading-relaxed mb-8 font-serif max-w-lg">
                每一首歌，都是一把打开记忆的钥匙。<br />
                重温那些年我们一起听过的歌，写下属于你的故事。
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/timeline" className="vintage-btn-gold text-base">
                  <CalendarDays size={20} />
                  <span>开启时光之旅</span>
                </Link>
                <button
                  onClick={handleRandom}
                  disabled={isShuffling}
                  className="vintage-btn-outline text-base disabled:opacity-60"
                >
                  <Shuffle
                    size={20}
                    className={isShuffling ? 'animate-spin' : ''}
                  />
                  <span>随机一首回忆</span>
                </button>
              </div>

              {randomSong && (
                <div
                  className={`mt-8 p-5 rounded-xl bg-vintage-paper/10 border border-vintage-gold/30 backdrop-blur-sm inline-flex items-center gap-4 transition-all duration-300 ${
                    isShuffling ? 'opacity-70' : 'opacity-100'
                  }`}
                >
                  <img
                    src={randomSong.coverUrl}
                    alt={randomSong.title}
                    className="w-14 h-14 rounded-lg object-cover shadow-vintage"
                  />
                  <div>
                    <p className="text-vintage-gold font-display text-lg font-semibold">
                      {randomSong.title}
                    </p>
                    <p className="text-vintage-paper/60 text-sm">
                      {randomSong.artist} · {randomSong.year}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex justify-center items-center animate-fade-in">
              <div className="relative">
                <div className="vinyl-record w-72 h-72 md:w-96 md:h-96 animate-spin-slow shadow-vintage-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-vintage-gold flex items-center justify-center shadow-inner">
                      <Disc3 size={40} className="text-vintage-brown" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-vintage-brick/20 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-vintage-gold/20 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 md:py-20 bg-vintage-brownDark relative">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CalendarDays,
                title: '年代索引',
                desc: '1980-1999，按年份重温经典',
                link: '/timeline',
                color: 'from-vintage-gold/20 to-transparent',
              },
              {
                icon: Gamepad2,
                title: '猜歌挑战',
                desc: '看歌词猜歌名，赢积分兑好礼',
                link: '/guess-song',
                color: 'from-vintage-brick/20 to-transparent',
              },
              {
                icon: Heart,
                title: '我的收藏',
                desc: '收藏珍爱的歌曲与故事',
                link: '/collection',
                color: 'from-vintage-moss/20 to-transparent',
              },
              {
                icon: BookOpen,
                title: '记忆墙',
                desc: '分享你的青春回忆',
                link: '/memory-wall',
                color: 'from-vintage-gold/20 to-transparent',
              },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="group relative p-6 md:p-8 rounded-2xl border border-vintage-gold/20 bg-gradient-to-br hover:border-vintage-gold/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(62, 39, 35, 0.6), rgba(44, 24, 16, 0.8))`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-vintage-gold/10 border border-vintage-gold/30 flex items-center justify-center mb-4 group-hover:bg-vintage-gold/20 transition-colors">
                    <item.icon size={28} className="text-vintage-gold" />
                  </div>
                  <h3 className="font-display text-vintage-gold text-2xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-vintage-paper/60 font-serif mb-4">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-vintage-gold/80 group-hover:text-vintage-gold text-sm font-medium transition-colors">
                    <span>进入</span>
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* On This Day Section */}
      <section className="py-16 md:py-20 bg-vintage-brown relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-50" />
        </div>
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="vintage-heading text-3xl md:text-4xl mb-3">
              那年今日
            </h2>
            <p className="text-vintage-paper/60 font-serif">
              翻开时光的旧报纸，重温同日那首触动心弦的歌
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <OnThisDay />
          </div>
        </div>
      </section>

      {/* Featured Songs */}
      <section className="py-16 md:py-20 bg-vintage-brownDark">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="vintage-heading text-3xl md:text-4xl mb-2">
                岁月留声
              </h2>
              <p className="text-vintage-paper/60 font-serif">
                那些年大街小巷循环播放的旋律
              </p>
            </div>
            <Link
              to="/timeline"
              className="hidden sm:inline-flex items-center gap-1 text-vintage-gold hover:text-vintage-goldLight text-sm font-medium transition-colors"
            >
              <span>查看全部</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSongs.map((song, index) => (
              <div
                key={song.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <SongCard song={song} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 md:py-20 bg-vintage-brownDark relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-50" />
        </div>

        <div className="container relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="vintage-heading text-3xl md:text-4xl mb-2">
                精选回忆
              </h2>
              <p className="text-vintage-paper/60 font-serif">
                来自陌生人的故事，却像极了我们的青春
              </p>
            </div>
            <Link
              to="/memory-wall"
              className="hidden sm:inline-flex items-center gap-1 text-vintage-gold hover:text-vintage-goldLight text-sm font-medium transition-colors"
            >
              <span>记忆墙</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStories.map((story, index) => (
              <div
                key={story.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <StoryCard story={story} compact />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
