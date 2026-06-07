export interface OnThisDaySong {
  id: string;
  title: string;
  artist: string;
  year: number;
  album: string;
  coverUrl: string;
  lyrics: string;
  releaseMonthDay: string;
}

export interface EntertainmentNews {
  id: string;
  year: number;
  monthDay: string;
  headline: string;
  content: string;
  source: string;
}

export const onThisDaySongs: OnThisDaySong[] = [
  {
    id: 'otd-1985-0607',
    title: '明天会更好',
    artist: '群星',
    year: 1985,
    album: '明天会更好',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    lyrics: '轻轻敲醒沉睡的心灵\n慢慢张开你的眼睛\n看看忙碌的世界\n是否依然孤独的转个不停\n春风不解风情\n吹动少年的心',
    releaseMonthDay: '06-07',
  },
  {
    id: 'otd-1993-0607',
    title: '海阔天空',
    artist: 'Beyond',
    year: 1993,
    album: '乐与怒',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
    lyrics: '今天我寒夜里看雪飘过\n怀着冷却了的心窝飘远方\n风雨里追赶雾里分不清影踪\n天空海阔你与我可会变',
    releaseMonthDay: '06-07',
  },
  {
    id: 'otd-1997-0607',
    title: '中国人',
    artist: '刘德华',
    year: 1997,
    album: '爱如此神奇',
    coverUrl: 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=400&h=400&fit=crop',
    lyrics: '五千年的风和雨啊藏了多少梦\n黄色的脸黑色的眼不变是笑容\n八千里山川河岳像是一首歌\n不论你来自何方将去向何处',
    releaseMonthDay: '06-07',
  },
  {
    id: 'otd-1987-0128',
    title: '冬天里的一把火',
    artist: '费翔',
    year: 1987,
    album: '跨越四海的歌声',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    lyrics: '你就像那冬天里的一把火\n熊熊火焰温暖了我的心窝\n每次当你悄悄走近我身边\n火光照亮了我',
    releaseMonthDay: '01-28',
  },
  {
    id: 'otd-1990-0906',
    title: '光辉岁月',
    artist: 'Beyond',
    year: 1990,
    album: '命运派对',
    coverUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop',
    lyrics: '钟声响起归家的讯号\n在他生命里仿佛带点唏嘘\n黑色肌肤给他的意义\n是一生奉献肤色斗争中',
    releaseMonthDay: '09-06',
  },
  {
    id: 'otd-1996-1224',
    title: '心太软',
    artist: '任贤齐',
    year: 1996,
    album: '心太软',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop',
    lyrics: '你总是心太软心太软\n独自一个人流泪到天亮\n你无怨无悔的爱着那个人\n我知道你根本没那么坚强',
    releaseMonthDay: '12-24',
  },
  {
    id: 'otd-1998-0215',
    title: '相约一九九八',
    artist: '那英 / 王菲',
    year: 1998,
    album: '征服',
    coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    lyrics: '打开心灵剥去春的羞色\n舞步飞旋踏破冬的沉默\n融融的暖意带着深情的问候',
    releaseMonthDay: '02-15',
  },
  {
    id: 'otd-1994-0408',
    title: '同桌的你',
    artist: '老狼',
    year: 1994,
    album: '校园民谣1',
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    lyrics: '明天你是否会想起\n昨天你写的日记\n明天你是否还惦记\n曾经最爱哭的你',
    releaseMonthDay: '04-08',
  },
  {
    id: 'otd-1995-0720',
    title: '朋友',
    artist: '周华健',
    year: 1995,
    album: '朋友',
    coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
    lyrics: '这些年一个人\n风也过雨也走\n有过泪有过错\n还记得坚持什么',
    releaseMonthDay: '07-20',
  },
  {
    id: 'otd-1989-0812',
    title: '真的爱你',
    artist: 'Beyond',
    year: 1989,
    album: 'Beyond IV',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    lyrics: '无法可修饰的一对手\n带出温暖永远在背后\n纵使啰嗦始终关注\n不懂珍惜太内疚',
    releaseMonthDay: '08-12',
  },
  {
    id: 'otd-1992-0505',
    title: '水手',
    artist: '郑智化',
    year: 1992,
    album: '私房歌',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    lyrics: '苦涩的沙吹痛脸庞的感觉\n像父亲的责骂母亲的哭泣永远难忘记',
    releaseMonthDay: '05-05',
  },
  {
    id: 'otd-1991-1018',
    title: '来生缘',
    artist: '刘德华',
    year: 1991,
    album: '来生缘',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    lyrics: '寻寻觅觅在无声无息中消逝\n总是找不到回忆找不到曾被遗忘的真实',
    releaseMonthDay: '10-18',
  },
];

export const entertainmentNews: EntertainmentNews[] = [
  {
    id: 'news-1985-0607',
    year: 1985,
    monthDay: '06-07',
    headline: '群星合唱《明天会更好》呼吁世界和平',
    content: '今日，由罗大佑、张艾嘉等六十位华语歌手共同演唱的公益歌曲《明天会更好》正式发布。这首歌为纪念国际和平年而创作，旋律温暖动人，歌词充满希望。唱片发行首日便售出十万张，大街小巷都在播放这首充满力量的歌。',
    source: '《音乐周报》',
  },
  {
    id: 'news-1993-0607',
    year: 1993,
    monthDay: '06-07',
    headline: 'Beyond新专辑《乐与怒》震撼上市 《海阔天空》成主打',
    content: '香港摇滚乐队Beyond今日推出全新粤语专辑《乐与怒》，主打歌《海阔天空》由黄家驹亲自作词作曲，唱出乐队十年奋斗的心路历程。有乐评人表示，这将是Beyond职业生涯的巅峰之作。专辑首批十万张三天内售罄。',
    source: '《香港文汇报》',
  },
  {
    id: 'news-1997-0607',
    year: 1997,
    monthDay: '06-07',
    headline: '刘德华《中国人》唱响大街小巷 迎接香港回归',
    content: '距离香港回归祖国仅剩24天，刘德华的新歌《中国人》已成为最热门的歌曲。这首歌唱出了中华儿女的民族自豪感，在各大电台点播率连续两周位居榜首。据悉，刘德华将在回归庆典上献唱此曲。',
    source: '《羊城晚报》娱乐版',
  },
  {
    id: 'news-1987-0128',
    year: 1987,
    monthDay: '01-28',
    headline: '费翔春晚一曲成名 《冬天里的一把火》烧遍全国',
    content: '今年中央电视台春节联欢晚会上，美籍华人歌手费翔以一首《冬天里的一把火》迅速红遍大江南北。他的混血俊朗外表和热情奔放的舞姿迷倒了无数观众。据统计，节后全国磁带销量激增300%，费翔专辑供不应求。',
    source: '《大众电影》',
  },
  {
    id: 'news-1990-0906',
    year: 1990,
    monthDay: '09-06',
    headline: 'Beyond《光辉岁月》致敬曼德拉 摇滚唱出人文关怀',
    content: 'Beyond乐队新专辑《命运派对》今日发行，其中写给南非黑人领袖曼德拉的歌曲《光辉岁月》引发广泛讨论。黄家驹表示，希望通过音乐让更多人关注人权与自由。这首歌被多家电台评为年度最佳歌曲。',
    source: '《音乐天地》',
  },
  {
    id: 'news-1996-1224',
    year: 1996,
    monthDay: '12-24',
    headline: '任贤齐《心太软》横扫华语乐坛 唱片店排起长龙',
    content: '台湾歌手任贤齐的专辑《心太软》自发行以来势如破竹，同名主打歌在各大音乐榜单连续八周冠军。今日圣诞平安夜，北京多家音像店门前排起长龙，据经销商透露，目前缺货已达五十万张，工厂正加紧生产。',
    source: '《北京青年报》',
  },
  {
    id: 'news-1998-0215',
    year: 1998,
    monthDay: '02-15',
    headline: '那英王菲春晚合唱《相约一九九八》 两大天后首度同台',
    content: '今年央视春晚最受瞩目的节目莫过于那英与王菲两大天后的首度同台，两人合唱的《相约一九九八》一经播出便成为热门金曲。歌迷纷纷致电唱片公司询问何时推出单曲，预计销量将突破百万。',
    source: '《新民晚报》',
  },
  {
    id: 'news-1994-0408',
    year: 1994,
    monthDay: '04-08',
    headline: '《校园民谣1》专辑出版 高晓松老狼掀起校园民谣风',
    content: '由大地唱片推出的《校园民谣1》合辑今日正式面市，收录了高晓松、老狼等人的原创作品。其中《同桌的你》以其真挚朴实的歌词打动了无数学生，大学校园里处处飘荡着这首歌的旋律。',
    source: '《中国青年报》',
  },
  {
    id: 'news-1995-0720',
    year: 1995,
    monthDay: '07-20',
    headline: '周华健《朋友》成毕业季必唱金曲 送别会上唱哭全场',
    content: '又到一年毕业季，周华健的新歌《朋友》成为各大高校送别晚会上的必唱曲目。歌词中"朋友一生一起走，那些日子不再有"唱出了离别之情。据周华健透露，这首歌是写给陪伴他多年的乐队成员的。',
    source: '《当代歌坛》',
  },
  {
    id: 'news-1989-0812',
    year: 1989,
    monthDay: '08-12',
    headline: 'Beyond《真的爱你》母亲节爆火 献给母亲的摇滚情歌',
    content: 'Beyond乐队献给母亲的歌曲《真的爱你》近期在电台热播。这首摇滚歌曲一反Beyond以往批判风格，以温暖真挚的歌词歌颂母爱。黄家驹表示，这首歌是感谢母亲多年来对他音乐梦想的默默支持。',
    source: '《香港商报》',
  },
  {
    id: 'news-1992-0505',
    year: 1992,
    monthDay: '05-05',
    headline: '郑智化《水手》激励万千青年 励志歌曲创销售奇迹',
    content: '台湾歌手郑智化的歌曲《水手》自发行以来持续火爆，"风雨中这点痛算什么"成为许多年轻人的座右铭。身患小儿麻痹症的郑智化以亲身经历创作此歌，鼓励人们在困境中保持坚强。专辑销量已突破两百万张。',
    source: '《读者文摘》',
  },
  {
    id: 'news-1991-1018',
    year: 1991,
    monthDay: '10-18',
    headline: '刘德华《来生缘》横扫华语 天王深情演绎凄美爱情',
    content: '刘德华最新专辑《来生缘》同名主打歌今日发布MV，这首凄美的情歌讲述了一段跨越生死的爱恋。刘德华坦言这首歌是近年来他唱得最投入的一首。目前专辑预定量已突破百万张，稳坐年度销量冠军宝座。',
    source: '《星岛日报》',
  },
];

export const getSongsByMonthDay = (monthDay: string): OnThisDaySong[] => {
  return onThisDaySongs.filter((song) => song.releaseMonthDay === monthDay);
};

export const getNewsByMonthDay = (monthDay: string): EntertainmentNews[] => {
  return entertainmentNews.filter((news) => news.monthDay === monthDay);
};

export const getCurrentMonthDay = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${month}-${day}`;
};

export const getRandomOnThisDay = (): { song: OnThisDaySong; news: EntertainmentNews } | null => {
  const monthDay = getCurrentMonthDay();
  let songs = getSongsByMonthDay(monthDay);
  let news = getNewsByMonthDay(monthDay);

  if (songs.length === 0) {
    const allMonthDays = [...new Set(onThisDaySongs.map((s) => s.releaseMonthDay))];
    const randomMonthDay = allMonthDays[Math.floor(Math.random() * allMonthDays.length)];
    songs = getSongsByMonthDay(randomMonthDay);
    news = getNewsByMonthDay(randomMonthDay);
  }

  if (songs.length === 0 || news.length === 0) return null;

  const songIndex = Math.floor(Math.random() * songs.length);
  const matchedNews = news.find((n) => n.year === songs[songIndex].year) || news[0];

  return { song: songs[songIndex], news: matchedNews };
};
