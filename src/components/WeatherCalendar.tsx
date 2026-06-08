import { useMemo, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, CloudFog, CloudLightning, CloudSun, Calendar, BarChart3, PieChart as PieChartIcon, Clock } from 'lucide-react';
import type { WeatherType, WeatherStats, VintageWeatherRecord } from '@/types';
import { useWeatherStore } from '@/store/weatherStore';
import { useUserStore } from '@/store/userStore';
import { WEATHER_TYPES } from '@/data/vintageWeather';
import { mockSongs } from '@/data/songs';

type ChartView = 'weather' | 'season' | 'decade' | 'timeline';

const WeatherIcon = ({ type, size = 24 }: { type: WeatherType; size?: number }) => {
  switch (type) {
    case 'sunny':
      return <Sun size={size} />;
    case 'cloudy':
      return <CloudSun size={size} />;
    case 'overcast':
      return <Cloud size={size} />;
    case 'rainy':
      return <CloudRain size={size} />;
    case 'thunderstorm':
      return <CloudLightning size={size} />;
    case 'snowy':
      return <Snowflake size={size} />;
    case 'windy':
      return <Wind size={size} />;
    case 'foggy':
      return <CloudFog size={size} />;
    default:
      return <Sun size={size} />;
  }
};

const WEATHER_COLORS: Record<WeatherType, string> = {
  sunny: '#E8C96A',
  cloudy: '#A8C5DA',
  overcast: '#7A8B99',
  rainy: '#4A90B8',
  thunderstorm: '#5C4A7A',
  snowy: '#B8D4E8',
  windy: '#8FB0A0',
  foggy: '#C4B8A0',
};

const SEASON_COLORS: Record<string, string> = {
  春: '#7FB069',
  夏: '#E8833A',
  秋: '#C4621A',
  冬: '#5B8FA8',
};

const DECADE_COLORS: Record<string, string> = {
  '1980s': '#B7410E',
  '1990s': '#D4AF37',
  '2000s': '#2F4538',
};

export default function WeatherCalendar() {
  const { currentUser } = useUserStore();
  const { getStats, getUserRecords } = useWeatherStore();
  const [chartView, setChartView] = useState<ChartView>('weather');

  const stats: WeatherStats = useMemo(() => getStats(currentUser.id), [getStats, currentUser.id]);
  const records: VintageWeatherRecord[] = useMemo(
    () => getUserRecords(currentUser.id).slice().reverse(),
    [getUserRecords, currentUser.id]
  );

  const maxWeatherCount = Math.max(...Object.values(stats.byWeather), 1);
  const maxSeasonCount = Math.max(...Object.values(stats.bySeason), 1);
  const maxDecadeCount = Math.max(...Object.values(stats.byDecade), 1);

  const weatherEntries = WEATHER_TYPES.map((w) => ({
    ...w,
    count: stats.byWeather[w.type] || 0,
  }));

  const seasonEntries = ['春', '夏', '秋', '冬'].map((s) => ({
    season: s,
    count: stats.bySeason[s] || 0,
  }));

  const decadeEntries = ['1980s', '1990s', '2000s'].map((d) => ({
    decade: d,
    label: d === '1980s' ? '80年代' : d === '1990s' ? '90年代' : '00年代',
    count: stats.byDecade[d] || 0,
  }));

  const getCompletionRate = () => {
    const collected = weatherEntries.filter((w) => w.count > 0).length;
    return Math.round((collected / weatherEntries.length) * 100);
  };

  if (stats.total === 0) {
    return (
      <div className="vintage-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-vintage-gold/10 flex items-center justify-center">
          <Calendar size={36} className="text-vintage-gold/40" />
        </div>
        <h3 className="vintage-heading text-xl mb-2">还没有天气记录</h3>
        <p className="text-vintage-inkLight/60 font-serif text-sm">
          每天登录都会随机看到一张年代天气卡片，快来收集不同天气吧！
        </p>
      </div>
    );
  }

  return (
    <div className="vintage-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="vintage-heading text-xl flex items-center gap-2">
            <Calendar size={22} />
            我的年代天气日历
          </h3>
          <p className="text-vintage-inkLight/60 text-sm font-serif mt-1">
            已收集 {stats.total} 次天气记录 · 收集进度 {getCompletionRate()}%
          </p>
        </div>
        <div className="flex bg-vintage-gold/10 rounded-lg p-1">
          <button
            onClick={() => setChartView('weather')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              chartView === 'weather'
                ? 'bg-vintage-gold text-vintage-brown'
                : 'text-vintage-inkLight hover:text-vintage-ink'
            }`}
          >
            <Cloud size={13} />
            天气
          </button>
          <button
            onClick={() => setChartView('season')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              chartView === 'season'
                ? 'bg-vintage-gold text-vintage-brown'
                : 'text-vintage-inkLight hover:text-vintage-ink'
            }`}
          >
            <BarChart3 size={13} />
            季节
          </button>
          <button
            onClick={() => setChartView('decade')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              chartView === 'decade'
                ? 'bg-vintage-gold text-vintage-brown'
                : 'text-vintage-inkLight hover:text-vintage-ink'
            }`}
          >
            <Clock size={13} />
            年代
          </button>
          <button
            onClick={() => setChartView('timeline')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              chartView === 'timeline'
                ? 'bg-vintage-gold text-vintage-brown'
                : 'text-vintage-inkLight hover:text-vintage-ink'
            }`}
          >
            <PieChartIcon size={13} />
            记录
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-8 gap-2">
        {weatherEntries.map((w) => (
          <div
            key={w.type}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all ${
              w.count > 0
                ? 'shadow-md hover:scale-105'
                : 'bg-vintage-brownLight/10 opacity-40'
            }`}
            style={
              w.count > 0
                ? { backgroundColor: WEATHER_COLORS[w.type] + '40' }
                : undefined
            }
            title={`${w.label}: ${w.count}次`}
          >
            <div
              className={w.count > 0 ? '' : 'grayscale opacity-50'}
              style={{ color: WEATHER_COLORS[w.type] }}
            >
              <WeatherIcon type={w.type} size={20} />
            </div>
            <span
              className={`text-[10px] font-bold mt-0.5 ${
                w.count > 0 ? 'text-vintage-brown' : 'text-vintage-inkLight/40'
              }`}
            >
              {w.count > 0 ? w.count : '?'}
            </span>
          </div>
        ))}
      </div>

      {chartView === 'weather' && (
        <div className="space-y-3">
          <h4 className="text-vintage-brown font-bold text-sm font-serif mb-2">天气类型分布</h4>
          {weatherEntries.map((w) => (
            <div key={w.type} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: WEATHER_COLORS[w.type] + '30' }}
              >
                <div style={{ color: WEATHER_COLORS[w.type] }}>
                  <WeatherIcon type={w.type} size={18} />
                </div>
              </div>
              <span className="w-12 text-vintage-ink font-serif text-sm">{w.label}</span>
              <div className="flex-1 h-6 bg-vintage-brownLight/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${(w.count / maxWeatherCount) * 100}%`,
                    backgroundColor: WEATHER_COLORS[w.type],
                    minWidth: w.count > 0 ? '2rem' : 0,
                  }}
                >
                  {w.count > 0 && (
                    <span className="text-[10px] font-bold text-vintage-brownDark">
                      {w.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {chartView === 'season' && (
        <div className="space-y-3">
          <h4 className="text-vintage-brown font-bold text-sm font-serif mb-2">季节分布</h4>
          {seasonEntries.map((s) => (
            <div key={s.season} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                style={{
                  backgroundColor: SEASON_COLORS[s.season] + '30',
                  color: SEASON_COLORS[s.season],
                }}
              >
                {s.season}
              </div>
              <span className="w-12 text-vintage-ink font-serif text-sm">{s.season}季</span>
              <div className="flex-1 h-6 bg-vintage-brownLight/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${(s.count / maxSeasonCount) * 100}%`,
                    backgroundColor: SEASON_COLORS[s.season],
                    minWidth: s.count > 0 ? '2rem' : 0,
                  }}
                >
                  {s.count > 0 && (
                    <span className="text-[10px] font-bold text-vintage-paper">
                      {s.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {chartView === 'decade' && (
        <div className="flex items-end justify-around gap-4 h-48 pt-4">
          {decadeEntries.map((d) => (
            <div key={d.decade} className="flex flex-col items-center flex-1">
              <span className="text-vintage-brown font-bold text-lg font-serif mb-2">
                {d.count > 0 ? d.count : ''}
              </span>
              <div
                className="w-full max-w-20 rounded-t-lg transition-all duration-500 min-h-2"
                style={{
                  height: `${(d.count / maxDecadeCount) * 100}%`,
                  backgroundColor: DECADE_COLORS[d.decade],
                  opacity: d.count > 0 ? 1 : 0.3,
                }}
              />
              <div className="mt-3 text-center">
                <div
                  className="text-sm font-bold font-serif"
                  style={{ color: DECADE_COLORS[d.decade] }}
                >
                  {d.label}
                </div>
                <div className="text-[10px] text-vintage-inkLight/50 font-serif">
                  {d.count} 次
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {chartView === 'timeline' && (
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          <h4 className="text-vintage-brown font-bold text-sm font-serif mb-3 sticky top-0 bg-vintage-paper pb-2">
            最近记录
          </h4>
          {records.slice(0, 20).map((r) => {
            const song = mockSongs.find((s) => s.id === r.songId);
            const weatherInfo = WEATHER_TYPES.find((w) => w.type === r.weather);
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-vintage-paperLight/60 border border-vintage-gold/10 hover:bg-vintage-gold/5 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: WEATHER_COLORS[r.weather] + '30' }}
                >
                  <div style={{ color: WEATHER_COLORS[r.weather] }}>
                    <WeatherIcon type={r.weather} size={20} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-vintage-brown font-serif">
                      {r.year}年{r.month}月{r.day}日
                    </span>
                    <span className="text-vintage-inkLight/60 text-xs">
                      {r.city} · {weatherInfo?.label} · {r.temperature}°C
                    </span>
                  </div>
                  {song && (
                    <div className="text-xs text-vintage-inkLight/70 truncate font-serif mt-0.5">
                      🎵 《{song.title}》- {song.artist}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
