import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Story, SortType } from '@/types';
import { mockStories, getPublicStories } from '@/data/stories';

interface StoryState {
  stories: Story[];
  addStory: (
    userId: string,
    songId: string,
    content: string,
    isPublic: boolean
  ) => void;
  updateStory: (storyId: string, content: string, isPublic: boolean) => void;
  deleteStory: (storyId: string) => void;
  likeStory: (storyId: string) => void;
  unlikeStory: (storyId: string) => void;
  getStoriesBySong: (songId: string) => Story[];
  getStoriesByUser: (userId: string) => Story[];
  getPublicStoriesSorted: (sort: SortType) => Story[];
  getStoryByUserAndSong: (userId: string, songId: string) => Story | undefined;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      stories: mockStories,
      addStory: (userId, songId, content, isPublic) => {
        const existing = get().stories.find(
          (s) => s.userId === userId && s.songId === songId
        );
        if (existing) {
          get().updateStory(existing.id, content, isPublic);
          return;
        }
        set((state) => ({
          stories: [
            {
              id: `story-${Date.now()}`,
              userId,
              songId,
              content,
              isPublic,
              likes: 0,
              createdAt: new Date().toISOString(),
            },
            ...state.stories,
          ],
        }));
      },
      updateStory: (storyId, content, isPublic) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId ? { ...s, content, isPublic } : s
          ),
        })),
      deleteStory: (storyId) =>
        set((state) => ({
          stories: state.stories.filter((s) => s.id !== storyId),
        })),
      likeStory: (storyId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId ? { ...s, likes: s.likes + 1 } : s
          ),
        })),
      unlikeStory: (storyId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId && s.likes > 0 ? { ...s, likes: s.likes - 1 } : s
          ),
        })),
      getStoriesBySong: (songId) =>
        get().stories.filter((s) => s.songId === songId && s.isPublic),
      getStoriesByUser: (userId) =>
        get().stories.filter((s) => s.userId === userId),
      getPublicStoriesSorted: (sort) => {
        const publics = get().stories.filter((s) => s.isPublic);
        const sorted = [...publics];
        if (sort === 'latest') {
          sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sort === 'hottest') {
          sorted.sort((a, b) => b.likes - a.likes);
        } else if (sort === 'year') {
          sorted.sort((a, b) => a.songId.localeCompare(b.songId));
        }
        return sorted;
      },
      getStoryByUserAndSong: (userId, songId) =>
        get().stories.find((s) => s.userId === userId && s.songId === songId),
    }),
    {
      name: 'memory-story-storage',
      partialize: (state) => ({ stories: state.stories }),
    }
  )
);

export const initialPublicStories = getPublicStories();
