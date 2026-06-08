import type { WeatherType, WeatherInfo, VintageWeatherRecord } from '@/types';

export const WEATHER_TYPES: WeatherInfo[] = [
  { type: 'sunny', label: '晴', icon: '☀️', description: '阳光明媚' },
  { type: 'cloudy', label: '多云', icon: '⛅', description: '云朵飘荡' },
  { type: 'overcast', label: '阴', icon: '☁️', description: '天色阴沉' },
  { type: 'rainy', label: '雨', icon: '🌧️', description: '细雨绵绵' },
  { type: 'thunderstorm', label: '雷阵雨', icon: '⛈️', description: '电闪雷鸣' },
  { type: 'snowy', label: '雪', icon: '❄️', description: '雪花纷飞' },
  { type: 'windy', label: '大风', icon: '🌬️', description: '风起云涌' },
  { type: 'foggy', label: '雾', icon: '🌫️', description: '薄雾朦胧' },
];

export const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '重庆', '武汉', '西安',
  '南京', '杭州', '苏州', '天津', '长沙', '沈阳', '青岛', '大连',
  '厦门', '福州', '济南', '哈尔滨', '长春', '郑州', '合肥', '南昌',
];

export const SEASONS = ['春', '夏', '秋', '冬'];

export const getSeason = (month: number): string => {
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
};

export const getWeatherBySeason = (season: string): WeatherType[] => {
  switch (season) {
    case '春':
      return ['sunny', 'cloudy', 'overcast', 'rainy', 'windy', 'foggy'];
    case '夏':
      return ['sunny', 'cloudy', 'thunderstorm', 'rainy', 'overcast'];
    case '秋':
      return ['sunny', 'cloudy', 'overcast', 'rainy', 'windy', 'foggy'];
    case '冬':
      return ['sunny', 'cloudy', 'overcast', 'snowy', 'foggy', 'windy'];
    default:
      return ['sunny', 'cloudy'];
  }
};

export const getTempRange = (season: string): [number, number] => {
  switch (season) {
    case '春':
      return [8, 22];
    case '夏':
      return [25, 38];
    case '秋':
      return [10, 24];
    case '冬':
      return [-10, 8];
    default:
      return [10, 20];
  }
};

export interface WeatherSongMapping {
  weather?: WeatherType;
  season?: string;
  songIds: string[];
}

export const WEATHER_SONG_MAPPINGS: WeatherSongMapping[] = [
  { weather: 'sunny', songIds: ['s1985-01', 's1995-01', 's1998-01'] },
  { weather: 'rainy', songIds: ['s1996-03', 's1995-02', 's1993-02'] },
  { weather: 'snowy', songIds: ['s1988-02', 's1997-02', 's1987-01'] },
  { weather: 'cloudy', songIds: ['s1994-02', 's1988-01', 's1991-02'] },
  { weather: 'overcast', songIds: ['s1996-02', 's1999-03', 's1994-01'] },
  { weather: 'thunderstorm', songIds: ['s1993-01', 's1990-01', 's1989-01'] },
  { weather: 'windy', songIds: ['s1992-01', 's1997-01', 's1995-03'] },
  { weather: 'foggy', songIds: ['s1999-02', 's1998-02', 's1991-01'] },
  { season: '春', songIds: ['s1998-01', 's1995-02', 's1994-02'] },
  { season: '夏', songIds: ['s1998-03', 's1992-02', 's1985-01'] },
  { season: '秋', songIds: ['s1992-01', 's1997-03', 's1996-01'] },
  { season: '冬', songIds: ['s1987-01', 's1988-02', 's1999-01'] },
];

const generateId = () => Math.random().toString(36).substring(2, 11);

export const generateRandomWeather = (
  targetMonth?: number,
  targetDay?: number,
  targetYear?: number
): VintageWeatherRecord => {
  const now = new Date();
  const month = targetMonth ?? now.getMonth() + 1;
  const day = targetDay ?? now.getDate();
  const year = targetYear ?? 1980 + Math.floor(Math.random() * 21);

  const season = getSeason(month);
  const possibleWeathers = getWeatherBySeason(season);
  const weatherType = possibleWeathers[Math.floor(Math.random() * possibleWeathers.length)];
  const [minTemp, maxTemp] = getTempRange(season);
  const temperature = minTemp + Math.floor(Math.random() * (maxTemp - minTemp + 1));
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];

  const songMapping =
    WEATHER_SONG_MAPPINGS.find((m) => m.weather === weatherType) ||
    WEATHER_SONG_MAPPINGS.find((m) => m.season === season);
  const songId = songMapping
    ? songMapping.songIds[Math.floor(Math.random() * songMapping.songIds.length)]
    : 's1985-01';

  return {
    id: generateId(),
    year,
    month,
    day,
    city,
    weather: weatherType,
    temperature,
    season,
    songId,
    seenAt: new Date().toISOString(),
  };
};

export const generateTimeTravelWeathers = (
  month: number,
  day: number
): VintageWeatherRecord[] => {
  const usedYears = new Set<number>();
  const results: VintageWeatherRecord[] = [];

  while (results.length < 3) {
    const year = 1980 + Math.floor(Math.random() * 21);
    if (!usedYears.has(year)) {
      usedYears.add(year);
      results.push(generateRandomWeather(month, day, year));
    }
  }

  return results.sort((a, b) => a.year - b.year);
};

export const getWeatherInfo = (type: WeatherType): WeatherInfo => {
  return WEATHER_TYPES.find((w) => w.type === type) || WEATHER_TYPES[0];
};
