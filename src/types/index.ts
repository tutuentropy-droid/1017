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

export interface GuessQuestion {
  id: string;
  weekNumber: number;
  songId: string;
  lyricLine: string;
  correctTitle: string;
  correctArtist: string;
  hintYear: number;
  hintTVShow?: string;
  points: number;
  isUserCreated: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface UserGuessRecord {
  questionId: string;
  isCorrect: boolean;
  usedHint: boolean;
  pointsEarned: number;
  guessedAt: string;
}

export type RewardType = 'tape-cover' | 'badge' | 'sticker';

export interface Reward {
  id: string;
  name: string;
  type: RewardType;
  description: string;
  cost: number;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'legendary';
  isLimited?: boolean;
}

export interface UserReward {
  rewardId: string;
  obtainedAt: string;
}

export type WeatherType =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'windy'
  | 'foggy'
  | 'thunderstorm'
  | 'overcast';

export interface WeatherInfo {
  type: WeatherType;
  label: string;
  icon: string;
  description: string;
}

export interface VintageWeatherRecord {
  id: string;
  year: number;
  month: number;
  day: number;
  city: string;
  weather: WeatherType;
  temperature: number;
  season: string;
  songId: string;
  seenAt: string;
}

export interface WeatherStats {
  total: number;
  byWeather: Record<WeatherType, number>;
  bySeason: Record<string, number>;
  byDecade: Record<string, number>;
}

export interface DriftBottle {
  id: string;
  senderId: string;
  senderNickname: string;
  senderAvatar: string;
  lyric: string;
  songTitle?: string;
  songArtist?: string;
  story: string;
  createdAt: string;
  receiverId?: string;
  reply?: DriftBottleReply;
  status: 'floating' | 'received' | 'replied';
}

export interface DriftBottleReply {
  id: string;
  replierId: string;
  replierNickname: string;
  replierAvatar: string;
  lyric: string;
  songTitle?: string;
  songArtist?: string;
  story: string;
  createdAt: string;
}

export interface BottleBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  obtainedAt: string;
}

export interface DriftBottleStats {
  sentCount: number;
  receivedCount: number;
  repliedCount: number;
  badges: BottleBadge[];
}

export type AuctionStatus = 'upcoming' | 'active' | 'ended';

export interface AuctionBid {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  amount: number;
  bidAt: string;
}

export interface AuctionPlaylist {
  id: string;
  title: string;
  theme: string;
  description: string;
  coverUrl: string;
  year: number;
  eraTag: string;
  songIds: string[];
  startingPrice: number;
  minBidIncrement: number;
  status: AuctionStatus;
  startTime: string;
  endTime: string;
  createdBy: 'system' | string;
  creatorNickname?: string;
  currentBid: number;
  currentBidderId?: string;
  currentBidderNickname?: string;
  currentBidderAvatar?: string;
  bidHistory: AuctionBid[];
  viewCount: number;
  winnerId?: string;
  winnerNickname?: string;
  winnerAvatar?: string;
  finalPrice?: number;
}

export interface UserAuctionRecord {
  playlistId: string;
  isWinner: boolean;
  bids: AuctionBid[];
  wonAt?: string;
}

export type GiftType = 'glow-stick' | 'flower' | 'encore' | 'crown' | 'light-stick';

export interface VirtualGift {
  id: string;
  type: GiftType;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  weight: number;
}

export interface ConcertMemory {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface DanmakuMessage {
  id: string;
  userId: string;
  userNickname: string;
  content: string;
  color?: string;
  timestamp: number;
}

export interface GiftEffect {
  id: string;
  userId: string;
  userNickname: string;
  giftType: GiftType;
  giftEmoji: string;
  giftName: string;
  timestamp: number;
}

export interface Concert {
  id: string;
  month: string;
  singerName: string;
  singerAvatar: string;
  concertTitle: string;
  concertYear: number;
  venue: string;
  description: string;
  videoUrl: string;
  setlist: string[];
  lyrics: string;
  coverUrl: string;
  totalViews: number;
}
