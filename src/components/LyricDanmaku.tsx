import { useState, useEffect, useCallback, useRef } from 'react';

interface DanmakuItem {
  id: string;
  text: string;
  top: number;
  speed: 'slow' | 'normal' | 'fast';
  color: 'gold' | 'rose' | 'moss' | 'paper';
}

interface LyricDanmakuProps {
  lyrics: string;
  songId: string;
  songTitle: string;
  artist: string;
  year: number;
  onDanmakuClick: (data: {
    lyric: string;
    songId: string;
    songTitle: string;
    artist: string;
    year: number;
  }) => void;
  enabled?: boolean;
  containerHeight?: number;
}

const COLORS: DanmakuItem['color'][] = ['gold', 'rose', 'moss', 'paper'];
const SPEEDS: DanmakuItem['speed'][] = ['slow', 'normal', 'fast'];

const generateId = () => Math.random().toString(36).substring(2, 11);

export default function LyricDanmaku({
  lyrics,
  songId,
  songTitle,
  artist,
  year,
  onDanmakuClick,
  enabled = true,
  containerHeight = 500,
}: LyricDanmakuProps) {
  const [danmakus, setDanmakus] = useState<DanmakuItem[]>([]);
  const lyricLines = useRef<string[]>([]);
  const spawnIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    lyricLines.current = lyrics
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }, [lyrics]);

  const spawnDanmaku = useCallback(() => {
    if (lyricLines.current.length === 0) return;

    const availableTops = Array.from({ length: Math.floor(containerHeight / 60) }, (_, i) => (i + 1) * 60);
    const usedTops = new Set(danmakus.map((d) => d.top));
    const freeTops = availableTops.filter((t) => !usedTops.has(t));

    let top: number;
    if (freeTops.length > 0) {
      top = freeTops[Math.floor(Math.random() * freeTops.length)];
    } else {
      top = availableTops[Math.floor(Math.random() * availableTops.length)];
    }

    const randomLyric = lyricLines.current[Math.floor(Math.random() * lyricLines.current.length)];
    const newDanmaku: DanmakuItem = {
      id: generateId(),
      text: randomLyric,
      top,
      speed: SPEEDS[Math.floor(Math.random() * SPEEDS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    setDanmakus((prev) => [...prev, newDanmaku]);

    const durationMap = { slow: 18000, normal: 14000, fast: 10000 };
    const duration = durationMap[newDanmaku.speed];

    window.setTimeout(() => {
      setDanmakus((prev) => prev.filter((d) => d.id !== newDanmaku.id));
    }, duration);
  }, [danmakus, containerHeight]);

  useEffect(() => {
    if (!enabled) {
      setDanmakus([]);
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
      return;
    }

    spawnDanmaku();

    spawnIntervalRef.current = window.setInterval(() => {
      spawnDanmaku();
    }, 2500 + Math.random() * 2000);

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
    };
  }, [enabled, lyrics, spawnDanmaku]);

  const handleClick = (danmaku: DanmakuItem) => {
    onDanmakuClick({
      lyric: danmaku.text,
      songId,
      songTitle,
      artist,
      year,
    });
  };

  if (!enabled) return null;

  const getSpeedClass = (speed: DanmakuItem['speed']) => {
    switch (speed) {
      case 'slow':
        return 'animate-danmaku-slow';
      case 'fast':
        return 'animate-danmaku-fast';
      default:
        return 'animate-danmaku-normal';
    }
  };

  const getColorClass = (color: DanmakuItem['color']) => {
    return `danmaku-color-${color}`;
  };

  return (
    <div className="danmaku-container">
      {danmakus.map((danmaku) => (
        <div
          key={danmaku.id}
          className={`danmaku-item ${getSpeedClass(danmaku.speed)} ${getColorClass(danmaku.color)}`}
          style={{ top: `${danmaku.top}px`, right: 0 }}
          onClick={() => handleClick(danmaku)}
          title="点击查看回忆"
        >
          {danmaku.text}
        </div>
      ))}
    </div>
  );
}
