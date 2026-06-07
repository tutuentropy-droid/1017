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
