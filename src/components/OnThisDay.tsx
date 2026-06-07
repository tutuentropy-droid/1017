import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Radio, Disc3, Newspaper, Music2, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { getRandomOnThisDay, getCurrentMonthDay } from '@/data/onThisDay';
import type { OnThisDaySong, EntertainmentNews } from '@/data/onThisDay';

type GlitchMode = 'none' | 'tape' | 'cd' | 'radio' | 'tv' | 'bsod';

interface GlitchState {
  mode: GlitchMode;
  intensity: number;
  yearGlitch: boolean;
  lyricsGlitch: boolean;
  showSnow: boolean;
  showScanlines: boolean;
}

const GARBLED_CHARS = '▓▒░█▄▀■□◆◇○●◐◑◒◓';

const getGarbledChar = () => GARBLED_CHARS[Math.floor(Math.random() * GARBLED_CHARS.length)];

const garbleText = (text: string, intensity: number): string => {
  return text
    .split('')
    .map((char) => {
      if (char === '\n' || char === ' ') return char;
      return Math.random() < intensity ? getGarbledChar() : char;
    })
    .join('');
};

const garbleYear = (year: number): string => {
  const yearStr = String(year);
  return yearStr
    .split('')
    .map((_, i) => (Math.random() < 0.4 ? getGarbledChar() : yearStr[i]))
    .join('');
};

const lyricsWithMissingChars = (lyrics: string, glitch: boolean): (string | JSX.Element)[] => {
  const lines = lyrics.split('\n');
  return lines.map((line, lineIdx) => {
    const chars = line.split('').map((char, charIdx) => {
      if (char === ' ') return ' ';
      if (glitch && Math.random() < 0.15) {
        return <span key={`${lineIdx}-${charIdx}`} className="missing-char" />;
      }
      return char;
    });
    return (
      <span key={lineIdx}>
        {chars}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
};

export default function OnThisDay() {
  const [data, setData] = useState<{ song: OnThisDaySong; news: EntertainmentNews } | null>(null);
  const [glitch, setGlitch] = useState<GlitchState>({
    mode: 'none',
    intensity: 0,
    yearGlitch: false,
    lyricsGlitch: false,
    showSnow: false,
    showScanlines: true,
  });
  const [isShaking, setIsShaking] = useState(false);
  const [displayYear, setDisplayYear] = useState('');
  const [repairCount, setRepairCount] = useState(0);

  const today = new Date();
  const monthDay = getCurrentMonthDay();
  const [month, day] = monthDay.split('-');

  useEffect(() => {
    const result = getRandomOnThisDay();
    setData(result);
    if (result) {
      setDisplayYear(String(result.song.year));
    }
  }, []);

  useEffect(() => {
    if (!data) return;

    const triggerGlitch = () => {
      const modes: GlitchMode[] = ['tape', 'cd', 'radio', 'tv'];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      const randomIntensity = 0.2 + Math.random() * 0.4;

      setGlitch({
        mode: randomMode,
        intensity: randomIntensity,
        yearGlitch: Math.random() > 0.3,
        lyricsGlitch: Math.random() > 0.3,
        showSnow: randomMode === 'tv',
        showScanlines: true,
      });

      if (Math.random() < 0.05) {
        setTimeout(() => {
          setGlitch((g) => ({ ...g, mode: 'bsod' }));
          setTimeout(() => {
            setGlitch({
              mode: 'none',
              intensity: 0,
              yearGlitch: false,
              lyricsGlitch: false,
              showSnow: false,
              showScanlines: true,
            });
          }, 3000);
        }, 2000);
        return;
      }

      const duration = 1500 + Math.random() * 3000;
      setTimeout(() => {
        setGlitch({
          mode: 'none',
          intensity: 0,
          yearGlitch: false,
          lyricsGlitch: false,
          showSnow: false,
          showScanlines: true,
        });
      }, duration);
    };

    const interval = setInterval(triggerGlitch, 6000 + Math.random() * 8000);
    const firstTrigger = setTimeout(triggerGlitch, 3000 + Math.random() * 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstTrigger);
    };
  }, [data]);

  useEffect(() => {
    if (!data || !glitch.yearGlitch) {
      setDisplayYear(String(data?.song.year || ''));
      return;
    }

    const yearInterval = setInterval(() => {
      setDisplayYear(garbleYear(data.song.year));
    }, 100);

    return () => clearInterval(yearInterval);
  }, [data, glitch.yearGlitch]);

  const handleSlapTV = useCallback(() => {
    setIsShaking(true);
    setRepairCount((c) => c + 1);
    setTimeout(() => setIsShaking(false), 500);

    if (glitch.mode === 'bsod') {
      setTimeout(() => {
        setGlitch({
          mode: 'none',
          intensity: 0,
          yearGlitch: false,
          lyricsGlitch: false,
          showSnow: false,
          showScanlines: true,
        });
      }, 300);
      return;
    }

    setGlitch((g) => ({
      ...g,
      intensity: Math.max(0, g.intensity - 0.15),
      yearGlitch: false,
      lyricsGlitch: false,
      showSnow: false,
      mode: 'none',
    }));
  }, [glitch.mode]);

  const handleRewindTape = useCallback(() => {
    setIsShaking(true);
    setRepairCount((c) => c + 1);
    setTimeout(() => setIsShaking(false), 500);

    setGlitch({
      mode: 'none',
      intensity: 0,
      yearGlitch: false,
      lyricsGlitch: false,
      showSnow: false,
      showScanlines: true,
    });
  }, []);

  const handleBlowCD = useCallback(() => {
    setIsShaking(true);
    setRepairCount((c) => c + 1);
    setTimeout(() => setIsShaking(false), 500);

    setGlitch((g) => ({
      ...g,
      intensity: Math.max(0, g.intensity - 0.2),
      lyricsGlitch: false,
      mode: g.mode === 'cd' ? 'none' : g.mode,
    }));
  }, []);

  const handleAdjustAntenna = useCallback(() => {
    setIsShaking(true);
    setRepairCount((c) => c + 1);
    setTimeout(() => setIsShaking(false), 500);

    setGlitch((g) => ({
      ...g,
      showSnow: false,
      intensity: Math.max(0, g.intensity - 0.25),
      mode: g.mode === 'radio' || g.mode === 'tv' ? 'none' : g.mode,
    }));
  }, []);

  if (!data) {
    return (
      <div className="vintage-card p-8 text-center">
        <div className="animate-pulse">
          <Sparkles size={48} className="mx-auto text-vintage-gold/30 mb-4" />
          <p className="text-vintage-inkLight/50 font-serif">正在翻阅旧报纸…</p>
        </div>
      </div>
    );
  }

  const { song, news } = data;

  const getModeLabel = () => {
    switch (glitch.mode) {
      case 'tape':
        return '磁带卡带中…';
      case 'cd':
        return 'CD跳碟中…';
      case 'radio':
        return '电台信号干扰…';
      case 'tv':
        return '电视信号不好…';
      case 'bsod':
        return '';
      default:
        return null;
    }
  };

  const modeLabel = getModeLabel();

  if (glitch.mode === 'bsod') {
    return (
      <div className="win98-bsod min-h-[400px] flex flex-col justify-center animate-bsod-blink">
        <span className="win98-bsod-header">Windows</span>
        <div className="space-y-2">
          <p>
            A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
            00010E36.
          </p>
          <p>The current application will be terminated.</p>
          <p>&nbsp;</p>
          <p>* Press any key to terminate the current application.</p>
          <p>
            * Press CTRL+ALT+DEL again to restart your computer. You will lose
            any unsaved information in all applications.
          </p>
          <p>&nbsp;</p>
          <p className="text-center">Press any key to continue _</p>
          <p>&nbsp;</p>
          <p className="text-xs opacity-70">
            （别慌，只是怀旧故障模式而已。点击下面按钮恢复）
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSlapTV}
            className="px-6 py-2 bg-white text-blue-900 font-bold rounded border-2 border-gray-400 hover:bg-gray-200 transition-colors"
            style={{ boxShadow: 'inset -2px -2px 0 #808080, inset 2px 2px 0 #ffffff' }}
          >
            拍打主机箱
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`nostalgia-container vintage-tv-frame ${isShaking ? 'animate-window-shake' : ''}`}
    >
      <div
        className={`relative rounded-xl overflow-hidden bg-vintage-paper ${
          glitch.mode === 'tape' ? 'tape-warp' : ''
        } ${glitch.mode === 'cd' ? 'cd-glitch' : ''} ${
          glitch.mode === 'radio' ? 'radio-distort' : ''
        } ${glitch.showSnow ? 'tv-snow' : ''} ${
          glitch.showScanlines ? 'crt-scanlines' : ''
        }`}
        style={{ minHeight: '500px' }}
      >
        <div className="vintage-tv-knobs">
          <div className="vintage-tv-knob" />
          <div className="vintage-tv-knob" />
        </div>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays size={20} className="text-vintage-brick" />
              <span className="font-display text-lg md:text-xl text-vintage-brown">
                {today.getFullYear()}年{month}月{day}日
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-vintage-mossLight" />
              <span className="text-xs text-vintage-moss font-medium mono-font">
                FM {88 + Math.floor(Math.random() * 20)}.{Math.floor(Math.random() * 9)} MHz
              </span>
            </div>
          </div>

          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vintage-gold/15 border border-vintage-gold/30 mb-3">
              <Sparkles size={14} className="text-vintage-goldDark" />
              <span className="text-vintage-goldDark text-sm font-medium">
                那年今日
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-vintage-brown font-semibold tracking-wide">
              重温这一天的经典旋律
            </h2>
          </div>

          {modeLabel && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
              <div className="px-4 py-2 rounded-full bg-red-500/90 text-white text-sm font-medium animate-glitch-flicker flex items-center gap-2">
                <Radio size={16} className="animate-spin" />
                {modeLabel}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className={`w-full aspect-square rounded-xl object-cover shadow-vintage-lg ${
                    glitch.intensity > 0.3 ? 'chromatic-aberration' : ''
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl flex items-center justify-center ${
                    glitch.intensity > 0 ? '' : 'hidden'
                  }`}
                >
                  <div className="cassette-tape w-full h-full opacity-20">
                    <div className="cassette-label" />
                    <div className="cassette-reel cassette-reel-left animate-spin-slow" />
                    <div className="cassette-reel cassette-reel-right animate-spin-slow" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm ${
                      glitch.yearGlitch
                        ? 'bg-red-500/80 text-white animate-glitch-flicker'
                        : 'bg-vintage-gold/90 text-vintage-brown'
                    }`}
                  >
                    {displayYear}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h3
                  className={`font-display text-2xl md:text-3xl text-vintage-brown font-bold ${
                    glitch.intensity > 0.2 ? 'animate-text-glitch' : ''
                  }`}
                >
                  {glitch.intensity > 0.25
                    ? garbleText(song.title, glitch.intensity * 0.5)
                    : song.title}
                </h3>
                <p className="text-vintage-inkLight">
                  <span className="text-vintage-brick font-medium">歌手：</span>
                  {glitch.intensity > 0.3
                    ? garbleText(song.artist, glitch.intensity * 0.3)
                    : song.artist}
                </p>
                <p className="text-vintage-inkLight/70 text-sm">
                  <span className="text-vintage-moss font-medium">专辑：</span>
                  {song.album}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-2 mb-2">
                  <Music2 size={16} className="text-vintage-goldDark" />
                  <span className="text-sm text-vintage-goldDark font-medium">
                    歌词
                  </span>
                </div>
                <div className="bg-vintage-paperLight/60 rounded-lg p-4 border border-vintage-gold/20">
                  <p className="font-serif text-vintage-ink leading-relaxed text-sm">
                    {lyricsWithMissingChars(song.lyrics, glitch.lyricsGlitch)}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-vintage-ink/20">
                  <Newspaper size={20} className="text-vintage-brick" />
                  <h4 className="font-display text-xl md:text-2xl text-vintage-brown font-bold">
                    {news.source}
                  </h4>
                  <span className="ml-auto text-sm text-vintage-inkLight/60 font-serif">
                    {news.year}年{month}月{day}日
                  </span>
                </div>

                <h3 className="font-display text-xl md:text-2xl text-vintage-brown font-semibold mb-4 leading-tight">
                  {glitch.intensity > 0.35
                    ? garbleText(news.headline, glitch.intensity * 0.4)
                    : news.headline}
                </h3>

                <div className="newspaper-text flex-1">
                  <p className="font-serif text-vintage-ink leading-relaxed text-sm">
                    {glitch.intensity > 0.3
                      ? garbleText(news.content, glitch.intensity * 0.3)
                      : news.content}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-vintage-gold/30">
                  <p className="text-center text-sm text-vintage-inkLight/50 font-serif">
                    ── 以上为当年娱乐小报内容 ──
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-vintage-gold/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Disc3
                  size={28}
                  className={`text-vintage-gold ${
                    glitch.mode !== 'none' ? 'animate-spin' : 'animate-spin-slow'
                  }`}
                />
                <div>
                  <p className="font-display text-vintage-brown font-semibold">
                    {repairCount > 0
                      ? `已修复 ${repairCount} 次故障`
                      : '信号正常播放中'}
                  </p>
                  <p className="text-xs text-vintage-inkLight/60">
                    {glitch.mode !== 'none'
                      ? '设备出了点小问题，试试下面的按钮吧~'
                      : '如果出现故障，可以用以下方式尝试修复'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleSlapTV}
                  className="vintage-btn-gold !py-2 !px-4 text-sm"
                  title="电视信号不好时，拍两下就好"
                >
                  <RotateCcw size={16} />
                  <span>拍打电视机</span>
                </button>
                <button
                  onClick={handleRewindTape}
                  className="vintage-btn-outline !py-2 !px-4 text-sm"
                  title="磁带卡带时，卷一下磁带"
                >
                  <Radio size={16} />
                  <span>卷磁带</span>
                </button>
                <button
                  onClick={handleBlowCD}
                  className="vintage-btn-outline !py-2 !px-4 text-sm"
                  title="CD跳碟？吹一吹就好"
                >
                  <Disc3 size={16} />
                  <span>吹一吹CD</span>
                </button>
                <button
                  onClick={handleAdjustAntenna}
                  className="vintage-btn-outline !py-2 !px-4 text-sm"
                  title="电台杂音大？调整一下天线"
                >
                  <Sparkles size={16} />
                  <span>调整天线</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
