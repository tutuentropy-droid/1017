export interface Song {
  id: string;
  title: string;
  artist: string;
  year: number;
  album: string;
  coverUrl: string;
  lyrics: string;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
}

export interface Collection {
  id: string;
  userId: string;
  songId: string;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  songId: string;
  content: string;
  isPublic: boolean;
  likes: number;
  createdAt: string;
}

export type SortType = 'latest' | 'hottest' | 'year';

export type PolaroidItemType = 'song' | 'tag' | 'wish' | 'sticker';

export interface MemoryTag {
  id: string;
  text: string;
  category: 'season' | 'mood' | 'scene' | 'time';
  color: string;
}

export interface FriendWish {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  content: string;
}

export interface MemorySticker {
  id: string;
  emoji: string;
  label: string;
}

export interface PolaroidItem {
  id: string;
  type: PolaroidItemType;
  data: Song | MemoryTag | FriendWish | MemorySticker;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface PolaroidConfig {
  titleText: string;
  subText: string;
  items: PolaroidItem[];
  year?: number;
  season?: string;
  mood?: string;
}
