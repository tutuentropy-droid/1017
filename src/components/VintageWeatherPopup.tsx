import { useEffect, useState } from 'react';
import { X, Music, Clock, MapPin, Thermometer, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { VintageWeatherRecord } from '@/types';
import {
  generateRandomWeather,
  generateTimeTravelWeathers,
  getWeatherInfo,
} from '@/data/vintageWeather';
import { mockSongs } from '@/data/songs';
import { useWeatherStore } from '@/store/weatherStore';
import { useUserStore } from '@/store/userStore';

interface VintageWeatherPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VintageWeatherPopup({ isOpen, onClose }: VintageWeatherPopupProps) {
  const { currentUser } = useUserStore();
  const { addRecord } = useWeatherStore();
  const [currentWeather, setCurrentWeather] = useState<VintageWeatherRecord | null>(null);
  const [timeTravelMode, setTimeTravelMode] = useState(false);
  const [timeTravelRecords, setTimeTravelRecords] = useState<VintageWeatherRecord[]>([]);
  const [timeTravelIndex, setTimeTravelIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen && !currentWeather) {
      const weather = generateRandomWeather();
      setCurrentWeather(weather);
      addRecord(currentUser.id, weather);
    }
  }, [isOpen, currentWeather, currentUser.id, addRecord]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setTimeTravelMode(false);
    setTimeTravelRecords([]);
    setTimeTravelIndex(0);
    setCurrentWeather(null);
    onClose();
  };

  const handleTimeTravel = () => {
    if (!currentWeather) return;
    const records = generateTimeTravelWeathers(currentWeather.month, currentWeather.day);
    setTimeTravelRecords(records);
    setTimeTravelIndex(0);
    setTimeTravelMode(true);
    records.forEach((r) => addRecord(currentUser.id, r));
  };

  const navigateTimeTravel = (direction: -1 | 1) => {
    if (timeTravelRecords.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setTimeTravelIndex((prev) => {
        const next = prev + direction;
        if (next < 0) return timeTravelRecords.length - 1;
        if (next >= timeTravelRecords.length) return 0;
        return next;
      });
      setIsTransitioning(false);
    }, 200);
  };

  const regenerate = () => {
    const weather = generateRandomWeather();
    setCurrentWeather(weather);
    addRecord(currentUser.id, weather);
    setTimeTravelMode(false);
    setTimeTravelRecords([]);
    setTimeTravelIndex(0);
  };

  const displayWeather = timeTravelMode
    ? timeTravelRecords[timeTravelIndex] || currentWeather
    : currentWeather;

  if (!isOpen || !displayWeather) return null;

  const weatherInfo = getWeatherInfo(displayWeather.weather);
  const song = mockSongs.find((s) => s.id === displayWeather.songId) || mockSongs[0];
  const now = new Date();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[now.getDay()];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-vintage-brownDark/80 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-lg animate-popup-bounce-in ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div
            className="vintage-card overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #FAF0D7 0%, #F5E6C8 40%, #E8D4A8 100%)',
              border: '3px double #D4AF37',
              borderRadius: '4px',
            }}
          >
            <div className="bg-vintage-brick text-vintage-paper py-2 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-vintage-goldLight" />
                <span className="font-bold text-sm tracking-wider font-serif">
                  中央气象台 · 年代天气预报
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-vintage-paper/80 hover:text-vintage-paper transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-vintage-inkLight/70 text-xs">
                  <Clock size={14} />
                  <span className="font-serif">
                    今天 {now.getFullYear()}年{now.getMonth() + 1}月{now.getDate()}日 星期{weekDay}
                  </span>
                </div>
                <div className="text-vintage-brick text-xs font-bold font-serif tracking-wider">
                  第 {displayWeather.year} 号
                </div>
              </div>

              <div className="text-center mb-6">
                <div
                  className="vintage-heading text-4xl md:text-5xl mb-2 font-serif"
                  style={{ color: '#3E2723' }}
                >
                  {displayWeather.year}年
                </div>
                <div className="flex items-center justify-center gap-3 text-vintage-ink">
                  <span className="text-3xl md:text-4xl font-serif">
                    {displayWeather.month}月{displayWeather.day}日
                  </span>
                </div>
              </div>

              <div className="relative bg-vintage-paperLight rounded-lg p-5 mb-5 border-2 border-vintage-gold/40 shadow-inner">
                <div className="absolute top-0 left-4 -translate-y-1/2 bg-vintage-gold text-vintage-brownDark text-xs px-3 py-0.5 rounded font-bold">
                  <MapPin size={12} className="inline mr-1" />
                  {displayWeather.city}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-center">
                    <div className="text-6xl md:text-7xl mb-2 drop-shadow-md">
                      {weatherInfo.icon}
                    </div>
                    <div className="text-vintage-brown font-bold text-xl font-serif">
                      {weatherInfo.label}
                    </div>
                    <div className="text-vintage-inkLight/60 text-xs font-serif mt-0.5">
                      {weatherInfo.description}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-start justify-end gap-1">
                      <Thermometer size={24} className="text-vintage-brick mt-1" />
                      <div>
                        <span
                          className="text-5xl md:text-6xl font-bold font-serif"
                          style={{ color: '#B7410E' }}
                        >
                          {displayWeather.temperature}
                        </span>
                        <span className="text-2xl text-vintage-brick font-serif">°C</span>
                      </div>
                    </div>
                    <div className="text-vintage-inkLight/60 text-xs font-serif mt-1 text-right">
                      {displayWeather.season}季
                    </div>
                  </div>
                </div>
              </div>

              {timeTravelMode && timeTravelRecords.length > 1 && (
                <div className="flex items-center justify-center gap-2 mb-5">
                  <button
                    onClick={() => navigateTimeTravel(-1)}
                    className="p-2 rounded-full bg-vintage-gold/20 text-vintage-brown hover:bg-vintage-gold/40 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex gap-2">
                    {timeTravelRecords.map((r, idx) => (
                      <div
                        key={r.id}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          idx === timeTravelIndex
                            ? 'bg-vintage-gold'
                            : 'bg-vintage-gold/30'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => navigateTimeTravel(1)}
                    className="p-2 rounded-full bg-vintage-gold/20 text-vintage-brown hover:bg-vintage-gold/40 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

              <div className="bg-vintage-moss/10 rounded-lg p-4 border border-vintage-moss/30 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Music size={16} className="text-vintage-moss" />
                  <span className="text-vintage-moss text-sm font-bold font-serif">
                    今日金曲推荐
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-14 h-14 rounded object-cover shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-vintage-brown font-bold text-lg font-serif truncate">
                      《{song.title}》
                    </div>
                    <div className="text-vintage-inkLight/70 text-sm truncate">
                      {song.artist} · {song.year}年
                    </div>
                  </div>
                </div>
                <p className="text-vintage-ink/80 text-xs font-serif mt-3 italic leading-relaxed pl-2 border-l-2 border-vintage-moss/40">
                  "{song.lyrics.split('\n').slice(0, 2).join('，')}"
                </p>
              </div>

              <div className="flex gap-3">
                {!timeTravelMode ? (
                  <button
                    onClick={handleTimeTravel}
                    className="flex-1 py-3 px-4 rounded font-bold text-sm font-serif transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-vintage-moss to-vintage-mossLight text-vintage-paper shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Clock size={16} />
                    <span>时光旅行</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTimeTravelMode(false);
                      setTimeTravelRecords([]);
                      setTimeTravelIndex(0);
                    }}
                    className="flex-1 py-3 px-4 rounded font-bold text-sm font-serif transition-all flex items-center justify-center gap-2 bg-vintage-brown text-vintage-paper shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Sparkles size={16} />
                    <span>返回今日</span>
                  </button>
                )}
                <button
                  onClick={regenerate}
                  className="flex-1 py-3 px-4 rounded font-bold text-sm font-serif transition-all flex items-center justify-center gap-2 border-2 border-vintage-gold text-vintage-brown hover:bg-vintage-gold/20"
                >
                  <Sparkles size={16} />
                  <span>换一个</span>
                </button>
                <button
                  onClick={handleClose}
                  className="py-3 px-5 rounded font-bold text-sm font-serif transition-all bg-vintage-brick/10 border-2 border-vintage-brick/40 text-vintage-brick hover:bg-vintage-brick/20"
                >
                  关闭
                </button>
              </div>
            </div>

            <div className="bg-vintage-brownLight/10 px-6 py-3 border-t border-vintage-gold/20 flex items-center justify-between text-xs text-vintage-inkLight/60 font-serif">
              <span>● 数据来源：年代气象档案</span>
              <span>编号：{displayWeather.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          <div className="absolute -top-2 -left-2 w-8 h-8 bg-vintage-paper rotate-[-10deg] shadow-md opacity-80" />
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-vintage-paper rotate-[8deg] shadow-md opacity-80" />
          <div className="absolute -bottom-2 -left-1 w-6 h-6 bg-vintage-paper rotate-[12deg] shadow-md opacity-60" />
        </div>
      </div>
    </div>
  );
}
