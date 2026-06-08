import type { DriftBottle, DriftBottleReply, BottleBadge } from '@/types';
import { mockUsers } from './users';

const generateId = () => Math.random().toString(36).substring(2, 11);

export const mockReplies: DriftBottleReply[] = [
  {
    id: 'r1',
    replierId: 'u2',
    replierNickname: mockUsers[1].nickname,
    replierAvatar: mockUsers[1].avatar,
    lyric: '朋友一生一起走，那些日子不再有',
    songTitle: '朋友',
    songArtist: '周华健',
    story: '初中毕业那天，我们全班在操场上唱这首歌，哭得稀里哗啦。如今大家各奔东西，但每次听到这首歌，仿佛又回到了那个夏天。',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const mockDriftBottles: DriftBottle[] = [
  {
    id: 'b1',
    senderId: 'u1',
    senderNickname: mockUsers[0].nickname,
    senderAvatar: mockUsers[0].avatar,
    lyric: '流水它带走光阴的故事，改变了我们',
    songTitle: '光阴的故事',
    songArtist: '罗大佑',
    story: '高中晚自习，教室里有人用随身听外放这首歌，全班都安静了。那时候以为未来很远，现在才明白，那就是最好的时光。',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'floating',
  },
  {
    id: 'b2',
    senderId: 'u3',
    senderNickname: mockUsers[2].nickname,
    senderAvatar: mockUsers[2].avatar,
    lyric: '后来，我总算学会了如何去爱',
    songTitle: '后来',
    songArtist: '刘若英',
    story: '大学宿舍楼下，有人用吉他弹着这首歌向喜欢的女生表白。我在楼上听着，想起了自己那段无疾而终的暗恋。',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'floating',
  },
  {
    id: 'b3',
    senderId: 'u4',
    senderNickname: mockUsers[3].nickname,
    senderAvatar: mockUsers[3].avatar,
    lyric: '我怀念的是无话不说，我怀念的是一起做梦',
    songTitle: '我怀念的',
    songArtist: '孙燕姿',
    story: '和闺蜜分享同一副耳机，在放学路上反复听这首歌。我们说要做一辈子的朋友，现在她在另一个城市，偶尔视频通话，还会聊起这首歌。',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'floating',
  },
  {
    id: 'b4',
    senderId: 'u5',
    senderNickname: mockUsers[4].nickname,
    senderAvatar: mockUsers[4].avatar,
    lyric: '栀子花开，如此可爱，挥挥手告别欢乐和无奈',
    songTitle: '栀子花开',
    songArtist: '何炅',
    story: '毕业季的校园里到处都是栀子花香，广播里循环播放着这首歌。现在每年栀子花开的时候，我都会想起那群穿着校服的少年。',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    receiverId: 'u0',
    reply: mockReplies[0],
    status: 'replied',
  },
  {
    id: 'b5',
    senderId: 'u6',
    senderNickname: mockUsers[5].nickname,
    senderAvatar: mockUsers[5].avatar,
    lyric: '我们都是好孩子，最最善良的孩子',
    songTitle: '我们都是好孩子',
    songArtist: '王筝',
    story: '妈妈送我去外地读大学，火车开的时候她在站台上哭了。我戴着耳机听着这首歌，第一次觉得自己要长大了。',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'floating',
  },
  {
    id: 'b6',
    senderId: 'u2',
    senderNickname: mockUsers[1].nickname,
    senderAvatar: mockUsers[1].avatar,
    lyric: '想回到过去，试着让故事继续',
    songTitle: '回到过去',
    songArtist: '周杰伦',
    story: '攒了三个月的零花钱买了人生第一张专辑，就是周杰伦的《八度空间》。那张CD现在还放在我的抽屉里，虽然已经听不了了。',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: 'floating',
  },
];

export const FRIEND_BADGE: Omit<BottleBadge, 'obtainedAt'> = {
  id: 'badge-hai-nei-cun-zhi-ji',
  name: '海内存知己',
  icon: '🤝',
  description: '成功完成一次歌词漂流瓶的双向交流，与远方的陌生人因歌结缘。',
};

export const getRandomFloatingBottle = (excludeUserId: string): DriftBottle | null => {
  const floating = mockDriftBottles.filter(
    (b) => b.status === 'floating' && b.senderId !== excludeUserId
  );
  if (floating.length === 0) return null;
  return floating[Math.floor(Math.random() * floating.length)];
};

export const createBottle = (
  userId: string,
  nickname: string,
  avatar: string,
  lyric: string,
  story: string,
  songTitle?: string,
  songArtist?: string
): DriftBottle => {
  return {
    id: generateId(),
    senderId: userId,
    senderNickname: nickname,
    senderAvatar: avatar,
    lyric,
    songTitle,
    songArtist,
    story,
    createdAt: new Date().toISOString(),
    status: 'floating',
  };
};

export const createReply = (
  bottleId: string,
  userId: string,
  nickname: string,
  avatar: string,
  lyric: string,
  story: string,
  songTitle?: string,
  songArtist?: string
): DriftBottleReply => {
  return {
    id: generateId(),
    replierId: userId,
    replierNickname: nickname,
    replierAvatar: avatar,
    lyric,
    songTitle,
    songArtist,
    story,
    createdAt: new Date().toISOString(),
  };
};
