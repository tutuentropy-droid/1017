import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    nickname: '旧时光里的少年',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F5E6C8',
  },
  {
    id: 'u2',
    nickname: '卡带里的青春',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=E8D4A8',
  },
  {
    id: 'u3',
    nickname: '夜听Radio',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Milo&backgroundColor=F5E6C8',
  },
  {
    id: 'u4',
    nickname: '泛黄的明信片',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Luna&backgroundColor=E8D4A8',
  },
  {
    id: 'u5',
    nickname: '磁带AB面',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zane&backgroundColor=F5E6C8',
  },
  {
    id: 'u6',
    nickname: '十七岁的单车',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Bella&backgroundColor=E8D4A8',
  },
  {
    id: 'u0',
    nickname: '时光旅人',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Traveler&backgroundColor=F5E6C8',
  },
];

export const defaultUser: User = mockUsers[6];
