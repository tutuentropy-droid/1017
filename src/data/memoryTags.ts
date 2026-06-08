import type { MemoryTag } from '@/types';

export const memoryTags: MemoryTag[] = [
  { id: 'tag-s1', text: '春', category: 'season', color: '#D46233' },
  { id: 'tag-s2', text: '夏', category: 'season', color: '#B8941F' },
  { id: 'tag-s3', text: '秋', category: 'season', color: '#B7410E' },
  { id: 'tag-s4', text: '冬', category: 'season', color: '#4A6B5A' },
  { id: 'tag-m1', text: '青涩', category: 'mood', color: '#B7410E' },
  { id: 'tag-m2', text: '甜蜜', category: 'mood', color: '#D46233' },
  { id: 'tag-m3', text: '感动', category: 'mood', color: '#B8941F' },
  { id: 'tag-m4', text: '怀念', category: 'mood', color: '#4A6B5A' },
  { id: 'tag-m5', text: '热血', category: 'mood', color: '#B7410E' },
  { id: 'tag-m6', text: '温暖', category: 'mood', color: '#D4AF37' },
  { id: 'tag-c1', text: '校园', category: 'scene', color: '#4A6B5A' },
  { id: 'tag-c2', text: '初恋', category: 'scene', color: '#D46233' },
  { id: 'tag-c3', text: '友情', category: 'scene', color: '#B8941F' },
  { id: 'tag-c4', text: '离家', category: 'scene', color: '#2F4538' },
  { id: 'tag-c5', text: '毕业', category: 'scene', color: '#B7410E' },
  { id: 'tag-c6', text: '团圆', category: 'scene', color: '#D4AF37' },
  { id: 'tag-t1', text: '清晨', category: 'time', color: '#B8941F' },
  { id: 'tag-t2', text: '午后', category: 'time', color: '#D4AF37' },
  { id: 'tag-t3', text: '黄昏', category: 'time', color: '#B7410E' },
  { id: 'tag-t4', text: '深夜', category: 'time', color: '#2F4538' },
];

export const getTagsByCategory = (category: MemoryTag['category']): MemoryTag[] => {
  return memoryTags.filter((tag) => tag.category === category);
};
