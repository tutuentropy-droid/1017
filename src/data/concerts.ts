import type { Concert, VirtualGift, ConcertMemory, DanmakuMessage } from '@/types';

export const virtualGifts: VirtualGift[] = [
  {
    id: 'g1',
    type: 'glow-stick',
    name: '荧光棒',
    emoji: '🟢',
    cost: 5,
    description: '为歌手挥舞的绿色荧光棒',
    weight: 1,
  },
  {
    id: 'g2',
    type: 'light-stick',
    name: '应援灯牌',
    emoji: '💡',
    cost: 10,
    description: '闪烁的应援灯牌',
    weight: 2,
  },
  {
    id: 'g3',
    type: 'flower',
    name: '鲜花',
    emoji: '🌹',
    cost: 20,
    description: '一束献给歌手的玫瑰花',
    weight: 3,
  },
  {
    id: 'g4',
    type: 'encore',
    name: '安可灯牌',
    emoji: '🎤',
    cost: 50,
    description: '点亮全场的安可灯牌',
    weight: 5,
  },
  {
    id: 'g5',
    type: 'crown',
    name: '王者皇冠',
    emoji: '👑',
    cost: 100,
    description: '至尊荣耀的王者皇冠',
    weight: 10,
  },
];

export const monthlyConcerts: Concert[] = [
  {
    id: 'c1',
    month: '2026-06',
    singerName: 'Beyond',
    singerAvatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    concertTitle: 'Beyond 1991 生命接触演唱会',
    concertYear: 1991,
    venue: '香港红磡体育馆',
    description: 'Beyond乐队最经典的演唱会之一，黄家驹带领乐队唱响《海阔天空》《光辉岁月》《真的爱你》等传世金曲，永恒的摇滚记忆。',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    setlist: ['海阔天空', '光辉岁月', '真的爱你', '不再犹豫', 'AMANI', '喜欢你', '大地', '长城'],
    lyrics: '今天我寒夜里看雪飘过\n怀着冷却了的心窝飘远方\n风雨里追赶雾里分不清影踪\n天空海阔你与我可会变\n多少次迎着冷眼与嘲笑\n从没有放弃过心中的理想\n一刹那恍惚若有所失的感觉\n不知不觉已变淡心里爱\n原谅我这一生不羁放纵爱自由\n也会怕有一天会跌倒\n背弃了理想谁人都可以\n哪会怕有一天只你共我\n钟声响起归家的讯号\n在他生命里仿佛带点唏嘘\n黑色肌肤给他的意义\n是一生奉献肤色斗争中\n年月把拥有变做失去\n疲倦的双眼带着期望\n今天只有残留的躯壳\n迎接光辉岁月\n风雨中抱紧自由\n一生经过彷徨的挣扎\n自信可改变未来\n问谁又能做到',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=500&fit=crop',
    totalViews: 125680,
  },
  {
    id: 'c2',
    month: '2026-05',
    singerName: '张学友',
    singerAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
    concertTitle: '张学友 1995 友学友演唱会',
    concertYear: 1995,
    venue: '香港红磡体育馆',
    description: '歌神张学友巅峰时期的经典演唱会，《吻别》《祝福》《一千个伤心的理由》首首金曲，万人合唱的感动时刻。',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    setlist: ['吻别', '祝福', '一千个伤心的理由', '情网', '只想一生跟你走', '分手总要在雨天', '忘情冷雨夜', '还是觉得你最好'],
    lyrics: '前尘往事成云烟消散在彼此眼前\n就连说过了再见也看不见你有些哀怨\n给我的一切你不过是在敷衍\n你笑得越无邪我就会爱你爱得更狂野\n总在刹那间有一些了解\n说过的话不可能会实现\n就在一转眼发现你的脸\n已经陌生不会再像从前\n我的世界开始下雪\n冷得让我无法多爱一天\n冷得连隐藏的遗憾\n都那么的明显\n我和你吻别在无人的街\n让风痴笑我不能拒绝\n我和你吻别在狂乱的夜\n我的心等着迎接伤悲',
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=500&fit=crop',
    totalViews: 98450,
  },
  {
    id: 'c3',
    month: '2026-04',
    singerName: '王菲',
    singerAvatar: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&h=200&fit=crop',
    concertTitle: '王菲 1998 唱游大世界演唱会',
    concertYear: 1998,
    venue: '北京工人体育场',
    description: '天籁之音王菲的经典演唱会，《红豆》《相约一九九八》《我愿意》空灵嗓音穿越时空，传奇现场。',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    setlist: ['红豆', '我愿意', '相约一九九八', '棋子', '天空', '旋木', '人间', '闷'],
    lyrics: '还没好好的感受\n雪花绽放的气候\n我们一起颤抖\n会更明白什么是温柔\n还没跟你牵着手\n走过荒芜的沙丘\n可能从此以后学会珍惜\n天长和地久\n有时候有时候\n我会相信一切有尽头\n相聚离开都有时候\n没有什么会永垂不朽\n可是我有时候\n宁愿选择留恋不放手\n等到风景都看透\n也许你会陪我看细水长流\n思念是一种很玄的东西\n如影随形\n无声又无息出没在心底\n转眼吞没我在寂默里\n我无力抗拒特别是夜里\n想你到无法呼吸\n恨不能立即朝你狂奔去\n大声的告诉你\n愿意为你我愿意为你\n我愿意为你忘记我姓名\n就算多一秒停留在你怀里\n失去世界也不可惜',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=500&fit=crop',
    totalViews: 87320,
  },
  {
    id: 'c4',
    month: '2026-03',
    singerName: '刘德华',
    singerAvatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    concertTitle: '刘德华 1994 真我的风采演唱会',
    concertYear: 1994,
    venue: '香港红磡体育馆',
    description: '天王刘德华的经典演唱会，《忘情水》《中国人》《来生缘》金曲连唱，见证永远的天王魅力。',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    setlist: ['忘情水', '中国人', '来生缘', '谢谢你的爱', '一起走过的日子', '爱你一万年', '男人哭吧不是罪', '真我的风采'],
    lyrics: '曾经年少爱追梦一心只想往前飞\n行遍千山和万水一路走来不能回\n蓦然回首情已远身不由已在天边\n才明白爱恨情仇最痛最苦是后悔\n如果你不曾心碎你不会懂得我伤悲\n当我眼中有泪别问我是为谁\n就让我忘了这一切\n啊给我一杯忘情水\n换我一夜不流泪\n所有真心真意任它雨打风吹\n付出的爱收不回\n给我一杯忘情水\n换我一生不伤悲\n就算我会喝醉就算我会心碎\n不会看见我流泪\n五千年的风和雨啊藏了多少梦\n黄色的脸黑色的眼不变是笑容\n八千里山川河岳像是一首歌\n不论你来自何方将去向何处\n一样的泪一样的痛\n曾经的苦难我们留在心中\n一样的血一样的种\n未来还有梦我们一起开拓\n手牵着手不分你我昂首向前走\n让世界知道我们都是中国人',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',
    totalViews: 102180,
  },
];

export const mockDanmakus: DanmakuMessage[] = [
  { id: 'd1', userId: 'u1', userNickname: '追梦人', content: '这首歌陪伴我度过了最难的日子😭', timestamp: Date.now() - 5000 },
  { id: 'd2', userId: 'u2', userNickname: '老歌迷', content: '这现场太震撼了！！！', timestamp: Date.now() - 4000 },
  { id: 'd3', userId: 'u3', userNickname: '青春不散场', content: '第一次听是在初中，现在都当妈了', timestamp: Date.now() - 3000 },
  { id: 'd4', userId: 'u4', userNickname: '岁月神偷', content: '家驹永远在我心中❤️', timestamp: Date.now() - 2000 },
  { id: 'd5', userId: 'u5', userNickname: '旧时光', content: '全场大合唱的感觉太好了', timestamp: Date.now() - 1000 },
  { id: 'd6', userId: 'u6', userNickname: '流年似水', content: '听哭了……', timestamp: Date.now() - 800 },
  { id: 'd7', userId: 'u7', userNickname: '星空下的约定', content: '这首歌是我和初恋的定情曲', timestamp: Date.now() - 600 },
  { id: 'd8', userId: 'u8', userNickname: '往事随风', content: '经典就是经典，百听不厌', timestamp: Date.now() - 400 },
  { id: 'd9', userId: 'u9', userNickname: '那年夏天', content: '90年代的华语乐坛真的是神仙打架', timestamp: Date.now() - 200 },
  { id: 'd10', userId: 'u10', userNickname: '时光机', content: '如果能回到那个年代该多好', timestamp: Date.now() },
];

export const mockMemories: ConcertMemory[] = [
  {
    id: 'm1',
    userId: 'u1',
    userNickname: '追梦人',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    content: '1993年，我用攒了三个月的零花钱买了人生第一张演唱会门票，就是Beyond的。记得那天站在体育馆外面，手里攥着被汗水浸湿的票，心脏跳得快要蹦出来。家驹在台上说"只要有音乐，就不会有世界末日"，这句话我记到现在。',
    createdAt: '2026-06-01T10:30:00Z',
    likes: 328,
  },
  {
    id: 'm2',
    userId: 'u2',
    userNickname: '老磁带收藏者',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: '爸爸当年给我录了张学友演唱会的磁带，两面都录满了，我翻来覆去听了几百遍，磁带都磨花了。现在再看这场演唱会的录像，突然明白了什么叫"初听不知曲中意，再听已是曲中人"。',
    createdAt: '2026-06-02T15:20:00Z',
    likes: 215,
  },
  {
    id: 'm3',
    userId: 'u3',
    userNickname: '青春纪念册',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: '高考前的那一个月，每天晚自习回家都会放王菲的《红豆》。现在一听到这首歌的旋律，就仿佛能闻到当时书桌前栀子花香的味道，想起那个为了梦想拼命的自己。谢谢你，陪我走过那段岁月。',
    createdAt: '2026-06-03T08:45:00Z',
    likes: 456,
  },
];

export const getCurrentMonthConcert = (): Concert => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const found = monthlyConcerts.find((c) => c.month === currentMonth);
  return found || monthlyConcerts[0];
};

export const generateRandomDanmaku = (): DanmakuMessage => {
  const texts = [
    '经典就是经典！！',
    '这旋律太美了',
    '单曲循环一万遍',
    '回到了学生时代',
    '哭了T_T',
    '全场大合唱！',
    '永远的经典',
    '这首歌承载了太多回忆',
    '百听不厌',
    '华语乐坛的黄金年代',
    '那时候的歌才叫歌',
    '青春回来了！',
    '陪伴了我整个青春',
    '太感动了',
    '这才是真正的音乐',
  ];
  const nicknames = ['追梦人', '老歌迷', '青春不散场', '旧时光', '岁月神偷', '流年似水', '那年夏天', '星空下的约定', '往事随风', '时光机', '夜半歌声', '怀旧的人', '永远年轻', '梦回90年代'];
  return {
    id: Math.random().toString(36).substring(2, 11),
    userId: Math.random().toString(36).substring(2, 9),
    userNickname: nicknames[Math.floor(Math.random() * nicknames.length)],
    content: texts[Math.floor(Math.random() * texts.length)],
    timestamp: Date.now(),
  };
};
