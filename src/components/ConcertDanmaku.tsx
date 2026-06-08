import { useState, useEffect, useRef } from 'react';
import type { DanmakuMessage, GiftEffect } from '@/types';

interface FlyingDanmaku {
  id: string;
  text: string;
  nickname: string;
  color: string;
  top: number;
  lane: number;
  createdAt: number;
}

interface FlyingGift {
  id: string;
  emoji: string;
  giftName: string;
  nickname: string;
  x: number;
  y: number;
  createdAt: number;
}

interface ConcertDanmakuProps {
  danmakus: DanmakuMessage[];
  giftEffects: GiftEffect[];
  enabled: boolean;
}

const LANE_COUNT = 8;
const LANE_HEIGHT = 48;
const DANMAKU_DURATION = 12000;
const GIFT_DURATION = 3000;

export default function ConcertDanmaku({
  danmakus,
  giftEffects,
  enabled,
}: ConcertDanmakuProps) {
  const [flyingDanmakus, setFlyingDanmakus] = useState<FlyingDanmaku[]>([]);
  const [flyingGifts, setFlyingGifts] = useState<FlyingGift[]>([]);
  const processedDanmakuIds = useRef<Set<string>>(new Set());
  const processedGiftIds = useRef<Set<string>>(new Set());
  const occupiedLanes = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    if (!enabled) {
      setFlyingDanmakus([]);
      setFlyingGifts([]);
      return;
    }

    danmakus.forEach((d) => {
      if (processedDanmakuIds.current.has(d.id)) return;
      processedDanmakuIds.current.add(d.id);

      let lane = 0;
      const now = Date.now();
      for (let i = 0; i < LANE_COUNT; i++) {
        const lastUsed = occupiedLanes.current.get(i) || 0;
        if (now - lastUsed > 1500) {
          lane = i;
          break;
        }
      }
      occupiedLanes.current.set(lane, now);

      const newDanmaku: FlyingDanmaku = {
        id: d.id,
        text: d.content,
        nickname: d.userNickname,
        color: d.color || '#F5E6C8',
        top: 40 + lane * LANE_HEIGHT,
        lane,
        createdAt: now,
      };

      setFlyingDanmakus((prev) => [...prev, newDanmaku]);

      setTimeout(() => {
        setFlyingDanmakus((prev) => prev.filter((fd) => fd.id !== d.id));
      }, DANMAKU_DURATION);
    });
  }, [danmakus, enabled]);

  useEffect(() => {
    if (!enabled) return;

    giftEffects.forEach((g) => {
      if (processedGiftIds.current.has(g.id)) return;
      processedGiftIds.current.add(g.id);

      const newGift: FlyingGift = {
        id: g.id,
        emoji: g.giftEmoji,
        giftName: g.giftName,
        nickname: g.userNickname,
        x: 20 + Math.random() * 60,
        y: 30 + Math.random() * 50,
        createdAt: Date.now(),
      };

      setFlyingGifts((prev) => [...prev, newGift]);

      setTimeout(() => {
        setFlyingGifts((prev) => prev.filter((fg) => fg.id !== g.id));
      }, GIFT_DURATION);
    });
  }, [giftEffects, enabled]);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {flyingDanmakus.map((fd) => (
        <div
          key={fd.id}
          className="absolute whitespace-nowrap animate-concert-danmaku"
          style={{
            top: `${fd.top}px`,
            right: 0,
            animationDuration: `${DANMAKU_DURATION}ms`,
          }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full backdrop-blur-md text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, rgba(44, 24, 16, 0.75), rgba(62, 39, 35, 0.65))',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: fd.color,
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            <span
              className="mr-2 text-xs opacity-75"
              style={{ color: '#D4AF37' }}
            >
              {fd.nickname}：
            </span>
            {fd.text}
          </span>
        </div>
      ))}

      {flyingGifts.map((fg) => (
        <div
          key={fg.id}
          className="absolute animate-gift-float"
          style={{
            left: `${fg.x}%`,
            top: `${fg.y}%`,
            animationDuration: `${GIFT_DURATION}ms`,
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-6xl drop-shadow-lg animate-gift-pulse">{fg.emoji}</span>
            <div
              className="mt-1 px-3 py-1 rounded-full text-xs whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.9), rgba(184, 148, 31, 0.9))',
                color: '#2C1810',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(255,255,255,0.3)',
              }}
            >
              {fg.nickname} 送出 {fg.giftName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
