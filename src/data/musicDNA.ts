import type { StyleTag, DNAPersonalityType, Song, MusicStyle } from '@/types';

export const styleTags: StyleTag[] = [
  {
    id: 'rock',
    label: '摇滚',
    color: '#B7410E',
    description: '热血沸腾，不甘平庸',
  },
  {
    id: 'pop',
    label: '流行',
    color: '#D4AF37',
    description: '紧跟潮流，拥抱经典',
  },
  {
    id: 'folk',
    label: '民谣',
    color: '#4A6B5A',
    description: '安静内敛，诗意绵长',
  },
  {
    id: 'cantopop',
    label: '粤语',
    color: '#2F4538',
    description: '港乐情怀，光影岁月',
  },
  {
    id: 'mandopop',
    label: '华语流行',
    color: '#D46233',
    description: '两岸三地，华语之声',
  },
  {
    id: 'ballad',
    label: '抒情',
    color: '#B8941F',
    description: '情感细腻，温柔绵长',
  },
  {
    id: 'campus',
    label: '校园',
    color: '#6B8E4E',
    description: '青春懵懂，纯真年代',
  },
];

export const personalityTypes: DNAPersonalityType[] = [
  {
    id: 'rock-rebel',
    name: '摇滚叛逆者',
    title: '八十年代的热血青年',
    description: '你的骨子里流淌着八十年代的热血。崔健的一无所有、Beyond的海阔天空，是你青春最真实的写照。你不甘于平庸，对世界有着自己的思考，那些嘶吼的旋律是你对生活最赤诚的回应。',
    traits: ['热血', '独立', '理想主义', '真实', '不妥协'],
    color: '#B7410E',
    emoji: '🔥',
    decadePreference: '80s',
  },
  {
    id: 'campus-poet',
    name: '校园诗人',
    title: '白衣飘飘的年代',
    description: '老狼的同桌的你、罗大佑的恋曲1990，总能轻易拨动你的心弦。你怀念那个白衣飘飘的年代，喜欢用音乐书写青春的诗意。你内心柔软，对那段纯真岁月有着最深的眷恋。',
    traits: ['诗意', '纯真', '怀旧', '细腻', '浪漫'],
    color: '#6B8E4E',
    emoji: '📖',
    decadePreference: 'balanced',
  },
  {
    id: 'cantonese-classic',
    name: '港乐收藏家',
    title: '黄金时代的见证者',
    description: '张学友的吻别、王菲的红豆、Beyond的光辉岁月……你的歌单是一部港乐黄金时代的编年史。你热爱粤语歌里的江湖气和儿女情长，那些熟悉的旋律是你对那个辉煌年代最深的致敬。',
    traits: ['品味', '念旧', '浪漫', '重情义', '经典控'],
    color: '#2F4538',
    emoji: '🎙️',
    decadePreference: '90s',
  },
  {
    id: 'ballad-dreamer',
    name: '情歌追梦人',
    title: '温柔岁月的守护者',
    description: '邓丽君的甜蜜蜜、那英的征服、任贤齐的心太软，每一首情歌都能让你陷入回忆。你是一个情感细腻的人，相信音乐里藏着最动人的故事。那些温柔的旋律，陪伴你走过了一个又一个深夜。',
    traits: ['温柔', '感性', '深情', '细腻', '浪漫主义'],
    color: '#D46233',
    emoji: '💝',
    decadePreference: '90s',
  },
  {
    id: 'folk-wanderer',
    name: '民谣流浪者',
    title: '在路上的灵魂歌者',
    description: '你喜欢那些带着淡淡忧伤的民谣旋律，齐秦的夜夜夜夜、大约在冬季，总能让你陷入沉思。你有一颗向往自由的心，音乐是你旅途中最好的伙伴，那些简单的和弦里，藏着你对远方的向往。',
    traits: ['自由', '安静', '深沉', '独立', '向往远方'],
    color: '#4A6B5A',
    emoji: '🌾',
    decadePreference: '80s',
  },
  {
    id: 'nostalgia-archivist',
    name: '怀旧档案员',
    title: '时光的忠实守护者',
    description: '从八十年代的崔健到九十年代的王菲，你的收藏横跨两个黄金年代。你是一个不折不扣的音乐档案员，每一首歌都是你精心收藏的时光标本。你相信，最好的音乐，永远在记忆里。',
    traits: ['念旧', '包容', '有条理', '深情', '收藏控'],
    color: '#D4AF37',
    emoji: '📼',
    decadePreference: 'balanced',
  },
  {
    id: 'pop-connoisseur',
    name: '流行品鉴师',
    title: '大街小巷的主旋律',
    description: '你的歌单就是那些年华语乐坛的流行风向标。心太软、忘情水、相约一九九八……每一首都是当年循环播放的金曲。你有着敏锐的流行嗅觉，总能第一时间抓住那个时代最动人的旋律。',
    traits: ['时尚', '敏锐', '热情', '开朗', '合群'],
    color: '#B8941F',
    emoji: '⭐',
    decadePreference: '90s',
  },
];

export const songStyleMap: Record<string, MusicStyle[]> = {
  's1985-01': ['pop', 'mandopop'],
  's1986-01': ['rock', 'mandopop'],
  's1987-01': ['pop', 'mandopop'],
  's1988-01': ['folk', 'campus', 'mandopop'],
  's1989-01': ['rock', 'cantopop'],
  's1990-01': ['rock', 'cantopop'],
  's1991-01': ['ballad', 'cantopop'],
  's1992-01': ['folk', 'pop', 'mandopop'],
  's1993-01': ['rock', 'cantopop'],
  's1993-02': ['ballad', 'cantopop'],
  's1994-01': ['ballad', 'mandopop'],
  's1994-02': ['campus', 'folk', 'mandopop'],
  's1995-01': ['pop', 'mandopop'],
  's1995-02': ['ballad', 'mandopop'],
  's1996-01': ['pop', 'mandopop'],
  's1996-02': ['folk', 'ballad', 'mandopop'],
  's1997-01': ['pop', 'mandopop'],
  's1997-02': ['ballad', 'cantopop', 'pop'],
  's1998-01': ['pop', 'mandopop'],
  's1998-02': ['ballad', 'pop', 'mandopop'],
  's1998-03': ['pop', 'mandopop'],
  's1999-01': ['ballad', 'mandopop'],
  's1999-02': ['pop', 'cantopop'],
  's1999-03': ['ballad', 'mandopop'],
  's1988-02': ['folk', 'ballad', 'mandopop'],
  's1991-02': ['ballad', 'mandopop'],
  's1992-02': ['pop', 'cantopop'],
  's1995-03': ['ballad', 'cantopop'],
  's1996-03': ['ballad', 'mandopop'],
  's1997-03': ['pop', 'mandopop'],
};

export const personalityTypeShareText = (personality: DNAPersonalityType): string => {
  return `我的音乐DNA是「${personality.name}」${personality.emoji}——${personality.title}。快来测测你的音乐人格吧！`;
};

export const getRecommendedSongs = (
  collectedSongIds: string[],
  dominantStyles: MusicStyle[],
  avgYear: number,
  allSongs: Song[],
  count: number = 4
): Song[] => {
  const uncollected = allSongs.filter((s) => !collectedSongIds.includes(s.id));
  const scored = uncollected.map((song) => {
    let score = 0;
    const songStyles = songStyleMap[song.id] || ['pop'];
    const styleMatch = songStyles.filter((s) => dominantStyles.includes(s)).length;
    score += styleMatch * 3;
    const yearDiff = Math.abs(song.year - avgYear);
    score += Math.max(0, 10 - yearDiff);
    if (songStyles.length > 1) score += 1;
    return { song, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.song);
};
