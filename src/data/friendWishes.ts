import type { FriendWish } from '@/types';
import { mockUsers } from '@/data/users';

export const friendWishes: FriendWish[] = [
  {
    id: 'wish-1',
    userId: 'u1',
    nickname: mockUsers[0].nickname,
    avatar: mockUsers[0].avatar,
    content: '愿你永远记得那些一起听歌的日子，友谊长存！',
  },
  {
    id: 'wish-2',
    userId: 'u2',
    nickname: mockUsers[1].nickname,
    avatar: mockUsers[1].avatar,
    content: '那段青春因为有你而更加闪亮，愿时光不老，我们不散。',
  },
  {
    id: 'wish-3',
    userId: 'u3',
    nickname: mockUsers[2].nickname,
    avatar: mockUsers[2].avatar,
    content: '每次听到老歌都会想起你，愿远方的你一切安好。',
  },
  {
    id: 'wish-4',
    userId: 'u4',
    nickname: mockUsers[3].nickname,
    avatar: mockUsers[3].avatar,
    content: '谢谢你出现在我的青春里，那些日子是我最珍贵的回忆。',
  },
  {
    id: 'wish-5',
    userId: 'u5',
    nickname: mockUsers[4].nickname,
    avatar: mockUsers[4].avatar,
    content: '不管走多远，那些一起唱过的歌永远在心里。',
  },
  {
    id: 'wish-6',
    userId: 'u6',
    nickname: mockUsers[5].nickname,
    avatar: mockUsers[5].avatar,
    content: '愿你被岁月温柔以待，愿你永远有歌可唱、有人可念。',
  },
];
