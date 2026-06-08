import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VintageWeatherRecord, WeatherStats, WeatherType } from '@/types';
import { WEATHER_TYPES, SEASONS } from '@/data/vintageWeather';

interface WeatherState {
  records: VintageWeatherRecord[];
  lastPopupDateByUser: Record<string, string>;
  addRecord: (userId: string, record: VintageWeatherRecord) => void;
  getUserRecords: (userId: string) => VintageWeatherRecord[];
  hasShownToday: (userId: string) => boolean;
  markShownToday: (userId: string) => void;
  getStats: (userId: string) => WeatherStats;
  clearRecords: (userId: string) => void;
}

const getTodayString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const initEmptyByWeather = (): Record<WeatherType, number> => {
  const result = {} as Record<WeatherType, number>;
  WEATHER_TYPES.forEach((w) => {
    result[w.type] = 0;
  });
  return result;
};

const initEmptyBySeason = (): Record<string, number> => {
  const result: Record<string, number> = {};
  SEASONS.forEach((s) => {
    result[s] = 0;
  });
  return result;
};

const initEmptyByDecade = (): Record<string, number> => {
  return { '1980s': 0, '1990s': 0, '2000s': 0 };
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      records: [],
      lastPopupDateByUser: {},

      addRecord: (_userId, record) => {
        set((state) => ({
          records: [...state.records, { ...record, seenAt: new Date().toISOString() }],
        }));
      },

      getUserRecords: (_userId) => {
        return get().records;
      },

      hasShownToday: (userId) => {
        const lastDate = get().lastPopupDateByUser[userId];
        return lastDate === getTodayString();
      },

      markShownToday: (userId) => {
        set((state) => ({
          lastPopupDateByUser: {
            ...state.lastPopupDateByUser,
            [userId]: getTodayString(),
          },
        }));
      },

      getStats: (_userId) => {
        const userRecords = get().records;
        const byWeather = initEmptyByWeather();
        const bySeason = initEmptyBySeason();
        const byDecade = initEmptyByDecade();

        userRecords.forEach((r) => {
          byWeather[r.weather] = (byWeather[r.weather] || 0) + 1;
          bySeason[r.season] = (bySeason[r.season] || 0) + 1;
          if (r.year >= 1980 && r.year < 1990) {
            byDecade['1980s'] += 1;
          } else if (r.year >= 1990 && r.year < 2000) {
            byDecade['1990s'] += 1;
          } else if (r.year >= 2000) {
            byDecade['2000s'] += 1;
          }
        });

        return {
          total: userRecords.length,
          byWeather,
          bySeason,
          byDecade,
        };
      },

      clearRecords: (_userId) => {
        set({ records: [] });
      },
    }),
    {
      name: 'vintage-weather-storage',
    }
  )
);
