import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Download,
  Share2,
  Trash2,
  RotateCw,
  Sparkles,
  Music,
  Tag,
  Heart,
  Image,
  X,
  Shuffle,
  Edit3,
  Check,
  Quote,
} from 'lucide-react';
import type {
  PolaroidItem,
  PolaroidItemType,
  Song,
  MemoryTag,
  FriendWish,
  MemorySticker,
} from '@/types';
import { useCollectionStore } from '@/store/collectionStore';
import { useUserStore } from '@/store/userStore';
import { mockSongs } from '@/data/songs';
import { memoryTags } from '@/data/memoryTags';
import { friendWishes } from '@/data/friendWishes';
import { memoryStickers } from '@/data/memoryStickers';
import { getRandomComment, nostalgiaComments } from '@/data/nostalgiaComments';

const SEASONS = ['春', '夏', '秋', '冬'];
const MOODS = ['与你共听', '独自聆听', '岁月如歌', '青春无悔', '那年那月', '时光不老'];

const GENERIC_COMMENTS = [
  '那些年，我们一起追过的歌',
  '时光荏苒，旋律依旧',
  '每一首歌都是一段故事',
  '愿你被岁月温柔以待',
  '流水它带走光阴的故事，改变了我们',
  '有些旋律，一听就是一辈子',
  '青春是手牵手坐上了永不回头的火车',
];

const generateId = () => Math.random().toString(36).substring(2, 11);

interface DraggableSource {
  type: PolaroidItemType;
  data: Song | MemoryTag | FriendWish | MemorySticker;
}

export default function PolaroidCreator() {
  const { currentUser } = useUserStore();
  const { getUserCollections } = useCollectionStore();
  const [items, setItems] = useState<PolaroidItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [year, setYear] = useState<number>(1998);
  const [season, setSeason] = useState<string>('夏');
  const [mood, setMood] = useState<string>('与你共听');
  const [customText, setCustomText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'songs' | 'tags' | 'wishes' | 'stickers'>('songs');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lyricText, setLyricText] = useState<string>('那些年，我们一起追过的歌');
  const [isEditingLyric, setIsEditingLyric] = useState(false);
  const [lyricDraft, setLyricDraft] = useState<string>('');
  const polaroidRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const collections = getUserCollections(currentUser.id);
  const collectedSongs = collections
    .map((c) => mockSongs.find((s) => s.id === c.songId))
    .filter(Boolean) as Song[];

  const displaySongs = collectedSongs.length > 0 ? collectedSongs : mockSongs.slice(0, 8);

  const getBottomText = () => {
    if (customText.trim()) return customText.trim();
    return `${year}·${season}·${mood}`;
  };

  const getAvailableComments = (): string[] => {
    const songItems = items.filter((it) => it.type === 'song');
    if (songItems.length > 0) {
      const allComments: string[] = [];
      songItems.forEach((item) => {
        const song = item.data as Song;
        const found = nostalgiaComments.find((c) => c.songId === song.id);
        if (found) allComments.push(...found.comments);
      });
      if (allComments.length > 0) return allComments;
    }
    return GENERIC_COMMENTS;
  };

  const shuffleLyric = () => {
    const comments = getAvailableComments();
    const random = comments[Math.floor(Math.random() * comments.length)];
    setLyricText(random);
  };

  const startEditLyric = () => {
    setLyricDraft(lyricText);
    setIsEditingLyric(true);
  };

  const saveLyric = () => {
    if (lyricDraft.trim()) {
      setLyricText(lyricDraft.trim());
    }
    setIsEditingLyric(false);
  };

  const handleDragStart = (e: React.DragEvent, source: DraggableSource) => {
    e.dataTransfer.setData('application/json', JSON.stringify(source));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data || !frameRef.current) return;

    try {
      const source: DraggableSource = JSON.parse(data);
      const rect = frameRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newItem: PolaroidItem = {
        id: generateId(),
        type: source.type,
        data: source.data,
        x: Math.max(15, Math.min(85, x)),
        y: Math.max(15, Math.min(80, y)),
        rotation: (Math.random() - 0.5) * 12,
        scale: 1,
      };

      setItems((prev) => [...prev, newItem]);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleItemMouseDown = (e: React.MouseEvent, item: PolaroidItem) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedItemId(item.id);

    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const offsetX = ((e.clientX - rect.left) / rect.width) * 100 - item.x;
    const offsetY = ((e.clientY - rect.top) / rect.height) * 100 - item.y;

    draggingRef.current = { id: item.id, offsetX, offsetY };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!draggingRef.current || !frameRef.current) return;
      const moveRect = frameRef.current.getBoundingClientRect();
      const newX = ((moveEvent.clientX - moveRect.left) / moveRect.width) * 100 - draggingRef.current.offsetX;
      const newY = ((moveEvent.clientY - moveRect.top) / moveRect.height) * 100 - draggingRef.current.offsetY;

      setItems((prev) =>
        prev.map((it) =>
          it.id === draggingRef.current?.id
            ? {
                ...it,
                x: Math.max(8, Math.min(92, newX)),
                y: Math.max(8, Math.min(80, newY)),
              }
            : it
        )
      );
    };

    const handleMouseUp = () => {
      draggingRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const removeItem = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
    if (hoveredItemId === id) setHoveredItemId(null);
  };

  const rotateItem = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, rotation: it.rotation + delta } : it))
    );
  };

  const scaleItem = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, scale: Math.max(0.5, Math.min(2, it.scale + delta)) } : it
      )
    );
  };

  const clearAll = () => {
    setItems([]);
    setSelectedItemId(null);
    setLyricText('那些年，我们一起追过的歌');
  };

  const autoGenerate = () => {
    const randomSong = displaySongs[Math.floor(Math.random() * displaySongs.length)];
    const randomTag = memoryTags[Math.floor(Math.random() * memoryTags.length)];
    const randomSticker = memoryStickers[Math.floor(Math.random() * memoryStickers.length)];
    const randomWish = friendWishes[Math.floor(Math.random() * friendWishes.length)];
    const randomYear = 1985 + Math.floor(Math.random() * 15);
    const randomSeason = SEASONS[Math.floor(Math.random() * SEASONS.length)];
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];

    setYear(randomYear);
    setSeason(randomSeason);
    setMood(randomMood);
    setCustomText('');

    const songComments = nostalgiaComments.find((c) => c.songId === randomSong.id);
    if (songComments && songComments.comments.length > 0) {
      setLyricText(songComments.comments[Math.floor(Math.random() * songComments.comments.length)]);
    } else {
      setLyricText(GENERIC_COMMENTS[Math.floor(Math.random() * GENERIC_COMMENTS.length)]);
    }

    const newItems: PolaroidItem[] = [
      {
        id: generateId(),
        type: 'song',
        data: randomSong,
        x: 28,
        y: 32,
        rotation: -7,
        scale: 1,
      },
      {
        id: generateId(),
        type: 'tag',
        data: randomTag,
        x: 72,
        y: 22,
        rotation: 9,
        scale: 1,
      },
      {
        id: generateId(),
        type: 'sticker',
        data: randomSticker,
        x: 22,
        y: 68,
        rotation: -5,
        scale: 1.1,
      },
      {
        id: generateId(),
        type: 'wish',
        data: randomWish,
        x: 74,
        y: 65,
        rotation: 6,
        scale: 0.9,
      },
    ];

    setItems(newItems);
  };

  const generateImage = useCallback(async (): Promise<string> => {
    if (!polaroidRef.current) throw new Error('Polaroid not found');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    const scale = 3;
    const width = 400;
    const height = 500;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#FAF0D7');
    gradient.addColorStop(1, '#F5E6C8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(62, 39, 35, ${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    ctx.fillStyle = '#2C1810';
    ctx.fillRect(20, 20, width - 40, 340);

    const photoGradient = ctx.createLinearGradient(20, 20, width - 20, 360);
    photoGradient.addColorStop(0, '#3E2723');
    photoGradient.addColorStop(0.5, '#5D4037');
    photoGradient.addColorStop(1, '#2C1810');
    ctx.fillStyle = photoGradient;
    ctx.fillRect(24, 24, width - 48, 332);

    for (const item of items) {
      if (item.type === 'song') {
        const song = item.data as Song;
        try {
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = document.createElement('img');
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = () => reject();
            image.src = song.coverUrl;
          });

          const centerX = ((item.x / 100) * (width - 48)) + 24;
          const centerY = ((item.y / 100) * 332) + 24;
          const size = 90 * item.scale;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate((item.rotation * Math.PI) / 180);

          ctx.fillStyle = '#FAF0D7';
          ctx.fillRect(-size / 2 - 6, -size / 2 - 6, size + 12, size + 18);

          ctx.drawImage(img, -size / 2, -size / 2, size, size);

          ctx.fillStyle = '#2C1810';
          ctx.font = 'bold 9px "Noto Serif SC", serif';
          ctx.textAlign = 'center';
          ctx.fillText(song.title.length > 8 ? song.title.substring(0, 8) + '…' : song.title, 0, size / 2 + 10);

          ctx.restore();
        } catch (e) {
          console.warn('Failed to load song cover');
        }
      }
    }

    for (const item of items) {
      const centerX = ((item.x / 100) * (width - 48)) + 24;
      const centerY = ((item.y / 100) * 332) + 24;

      if (item.type === 'tag') {
        const tag = item.data as MemoryTag;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.scale(item.scale, item.scale);

        ctx.fillStyle = tag.color;
        ctx.globalAlpha = 0.9;
        const tagWidth = tag.text.length * 16 + 24;
        ctx.beginPath();
        ctx.roundRect(-tagWidth / 2, -18, tagWidth, 36, 18);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#FAF0D7';
        ctx.font = 'bold 16px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tag.text, 0, 0);

        ctx.restore();
      } else if (item.type === 'sticker') {
        const sticker = item.data as MemorySticker;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.scale(item.scale, item.scale);

        ctx.font = '40px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, 0, 0);

        ctx.restore();
      } else if (item.type === 'wish') {
        const wish = item.data as FriendWish;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.scale(item.scale, item.scale);

        const cardW = 130;
        const cardH = 80;

        ctx.fillStyle = '#FAF0D7';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1;
        ctx.strokeRect(-cardW / 2, -cardH / 2, cardW, cardH);

        ctx.fillStyle = '#2C1810';
        ctx.font = '10px "Noto Serif SC", serif';
        ctx.textAlign = 'left';
        const displayContent = wish.content.length > 20 ? wish.content.substring(0, 20) + '…' : wish.content;
        const lines = displayContent.match(/.{1,10}/g) || [displayContent];
        lines.forEach((line, idx) => {
          ctx.fillText(line, -cardW / 2 + 8, -cardH / 2 + 20 + idx * 14);
        });

        ctx.fillStyle = '#B7410E';
        ctx.font = 'bold 9px "Noto Serif SC", serif';
        const nick = wish.nickname.length > 6 ? wish.nickname.substring(0, 6) + '…' : wish.nickname;
        ctx.fillText('—— ' + nick, -cardW / 2 + 8, cardH / 2 - 8);

        ctx.restore();
      }
    }

    const bottomText = getBottomText();
    ctx.fillStyle = '#2C1810';
    ctx.font = 'bold 22px "Playfair Display", "Noto Serif SC", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bottomText, width / 2, 405);

    ctx.fillStyle = '#4A3728';
    ctx.font = '12px "Noto Serif SC", Georgia, serif';
    const maxWidth = width - 80;
    let displayComment = lyricText;
    while (ctx.measureText(displayComment).width > maxWidth && displayComment.length > 0) {
      displayComment = displayComment.slice(0, -1);
    }
    if (displayComment.length < lyricText.length) {
      displayComment = displayComment.slice(0, -1) + '…';
    }
    ctx.fillText(displayComment, width / 2, 438);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    return canvas.toDataURL('image/png', 1.0);
  }, [items, year, season, mood, customText, lyricText]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateImage();
      const link = document.createElement('a');
      link.download = `音乐记忆拍立得_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('生成图片失败:', err);
      alert('图片生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateImage();
      if (navigator.share) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], '音乐记忆拍立得.png', { type: 'image/png' });
        await navigator.share({
          title: '我的音乐记忆拍立得',
          text: `这是我的音乐记忆：${getBottomText()}`,
          files: [file],
        });
      } else {
        setShowShareModal(true);
      }
    } catch (err) {
      console.error('分享失败:', err);
      setShowShareModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const dataUrl = await generateImage();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      alert('图片已复制到剪贴板，可粘贴到社交平台');
      setShowShareModal(false);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请使用下载功能');
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (frameRef.current && !frameRef.current.contains(e.target as Node)) {
        setSelectedItemId(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const renderItem = (item: PolaroidItem) => {
    const isSelected = selectedItemId === item.id;
    const isHovered = hoveredItemId === item.id;
    const showControls = isSelected || isHovered;
    const baseStyle: React.CSSProperties = {
      left: `${item.x}%`,
      top: `${item.y}%`,
      transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
      zIndex: isSelected ? 40 : isHovered ? 35 : 10,
    };

    const deleteButton = showControls && (
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => removeItem(item.id, e)}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-vintage-brick text-vintage-paper flex items-center justify-center shadow-lg hover:bg-vintage-brickLight transition-colors z-50"
        title="删除"
      >
        <X size={14} strokeWidth={3} />
      </button>
    );

    switch (item.type) {
      case 'song': {
        const song = item.data as Song;
        return (
          <div
            key={item.id}
            className={`absolute cursor-grab active:cursor-grabbing select-none transition-all ${
              isSelected
                ? 'ring-2 ring-vintage-gold ring-offset-2 ring-offset-vintage-brownDark rounded-sm'
                : ''
            }`}
            style={baseStyle}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {deleteButton}
            <div className="bg-vintage-paper p-1.5 pb-5 shadow-vintage rounded-sm" style={{ width: 100 }}>
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-sm"
                draggable={false}
              />
              <p className="text-vintage-ink text-xs font-semibold text-center mt-1 truncate font-serif">
                {song.title}
              </p>
            </div>
          </div>
        );
      }
      case 'tag': {
        const tag = item.data as MemoryTag;
        return (
          <div
            key={item.id}
            className={`absolute cursor-grab active:cursor-grabbing select-none ${
              isSelected
                ? 'ring-2 ring-vintage-gold ring-offset-2 ring-offset-vintage-brownDark rounded-full'
                : ''
            }`}
            style={baseStyle}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {deleteButton}
            <span
              className="px-4 py-2 rounded-full text-vintage-paper font-bold font-serif text-base shadow-md"
              style={{ backgroundColor: tag.color }}
            >
              {tag.text}
            </span>
          </div>
        );
      }
      case 'sticker': {
        const sticker = item.data as MemorySticker;
        return (
          <div
            key={item.id}
            className={`absolute cursor-grab active:cursor-grabbing select-none ${
              isSelected
                ? 'ring-2 ring-vintage-gold ring-offset-2 ring-offset-vintage-brownDark rounded-lg'
                : ''
            }`}
            style={baseStyle}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {deleteButton}
            <span className="text-4xl drop-shadow-md" style={{ lineHeight: 1 }}>
              {sticker.emoji}
            </span>
          </div>
        );
      }
      case 'wish': {
        const wish = item.data as FriendWish;
        return (
          <div
            key={item.id}
            className={`absolute cursor-grab active:cursor-grabbing select-none ${
              isSelected
                ? 'ring-2 ring-vintage-gold ring-offset-2 ring-offset-vintage-brownDark'
                : ''
            }`}
            style={{ ...baseStyle, width: 150 }}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {deleteButton}
            <div className="bg-vintage-paper p-3 shadow-vintage border border-vintage-gold/40 rounded">
              <p className="text-vintage-ink text-xs font-serif leading-relaxed line-clamp-3">
                {wish.content}
              </p>
              <p className="text-vintage-brick text-[10px] mt-2 text-right font-medium">
                —— {wish.nickname.length > 8 ? wish.nickname.substring(0, 8) + '…' : wish.nickname}
              </p>
            </div>
          </div>
        );
      }
    }
  };

  const renderSourceItem = (type: PolaroidItemType, data: Song | MemoryTag | FriendWish | MemorySticker) => {
    switch (type) {
      case 'song': {
        const song = data as Song;
        return (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, { type, data })}
            className="flex items-center gap-2 p-2 rounded-lg bg-vintage-brownLight/40 hover:bg-vintage-brownLight/60 cursor-grab active:cursor-grabbing transition-colors border border-vintage-gold/20"
          >
            <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-vintage-paper text-sm font-medium truncate">{song.title}</p>
              <p className="text-vintage-paper/60 text-xs truncate">
                {song.artist} · {song.year}
              </p>
            </div>
          </div>
        );
      }
      case 'tag': {
        const tag = data as MemoryTag;
        return (
          <div draggable onDragStart={(e) => handleDragStart(e, { type, data })} className="cursor-grab active:cursor-grabbing">
            <span
              className="inline-block px-3 py-1.5 rounded-full text-vintage-paper font-medium text-sm shadow"
              style={{ backgroundColor: tag.color }}
            >
              {tag.text}
            </span>
          </div>
        );
      }
      case 'sticker': {
        const sticker = data as MemorySticker;
        return (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, { type, data })}
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-vintage-brownLight/40 hover:bg-vintage-brownLight/60 cursor-grab active:cursor-grabbing transition-colors"
            title={sticker.label}
          >
            <span className="text-3xl">{sticker.emoji}</span>
            <span className="text-vintage-paper/60 text-[10px]">{sticker.label}</span>
          </div>
        );
      }
      case 'wish': {
        const wish = data as FriendWish;
        return (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, { type, data })}
            className="p-3 rounded-lg bg-vintage-paper/90 cursor-grab active:cursor-grabbing border border-vintage-gold/30"
          >
            <p className="text-vintage-ink text-xs font-serif leading-relaxed line-clamp-2">{wish.content}</p>
            <p className="text-vintage-brick text-[10px] mt-1 text-right font-medium">
              —— {wish.nickname.length > 6 ? wish.nickname.substring(0, 6) + '…' : wish.nickname}
            </p>
          </div>
        );
      }
    }
  };

  const selectedItem = items.find((it) => it.id === selectedItemId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-80 flex-shrink-0 space-y-4">
        <div className="vintage-card overflow-hidden">
          <div className="flex border-b border-vintage-gold/20">
            {(['songs', 'tags', 'wishes', 'stickers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                  activeTab === tab
                    ? 'bg-vintage-gold/15 text-vintage-gold border-b-2 border-vintage-gold'
                    : 'text-vintage-inkLight/70 hover:text-vintage-ink hover:bg-vintage-gold/5'
                }`}
              >
                {tab === 'songs' && <Music size={14} />}
                {tab === 'tags' && <Tag size={14} />}
                {tab === 'wishes' && <Heart size={14} />}
                {tab === 'stickers' && <Image size={14} />}
                <span>
                  {tab === 'songs' ? '歌曲' : tab === 'tags' ? '标签' : tab === 'wishes' ? '祝福' : '贴纸'}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 max-h-[380px] overflow-y-auto">
            {activeTab === 'songs' && (
              <div className="space-y-2">
                {displaySongs.map((song) => (
                  <div key={song.id}>{renderSourceItem('song', song)}</div>
                ))}
              </div>
            )}
            {activeTab === 'tags' && (
              <div className="flex flex-wrap gap-2">
                {memoryTags.map((tag) => (
                  <div key={tag.id}>{renderSourceItem('tag', tag)}</div>
                ))}
              </div>
            )}
            {activeTab === 'wishes' && (
              <div className="space-y-2">
                {friendWishes.map((wish) => (
                  <div key={wish.id}>{renderSourceItem('wish', wish)}</div>
                ))}
              </div>
            )}
            {activeTab === 'stickers' && (
              <div className="grid grid-cols-4 gap-2">
                {memoryStickers.map((sticker) => (
                  <div key={sticker.id}>{renderSourceItem('sticker', sticker)}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedItem && (
          <div className="vintage-card p-4">
            <h4 className="text-vintage-ink font-bold text-sm mb-3 font-serif">调整元素</h4>
            <div className="space-y-3">
              <div>
                <label className="text-vintage-inkLight text-xs block mb-1">旋转</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => rotateItem(selectedItem.id, -15)}
                    className="flex-1 py-2 px-2 bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-ink text-xs rounded hover:bg-vintage-gold/20 transition-colors font-medium"
                  >
                    ↺ 左旋
                  </button>
                  <button
                    onClick={() => rotateItem(selectedItem.id, 15)}
                    className="flex-1 py-2 px-2 bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-ink text-xs rounded hover:bg-vintage-gold/20 transition-colors font-medium"
                  >
                    ↻ 右旋
                  </button>
                </div>
              </div>
              <div>
                <label className="text-vintage-inkLight text-xs block mb-1">缩放</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => scaleItem(selectedItem.id, -0.1)}
                    className="flex-1 py-2 px-2 bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-ink text-xs rounded hover:bg-vintage-gold/20 transition-colors font-medium"
                  >
                    － 缩小
                  </button>
                  <button
                    onClick={() => scaleItem(selectedItem.id, 0.1)}
                    className="flex-1 py-2 px-2 bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-ink text-xs rounded hover:bg-vintage-gold/20 transition-colors font-medium"
                  >
                    ＋ 放大
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(selectedItem.id)}
                className="w-full py-2.5 bg-vintage-brick/15 border border-vintage-brick/30 text-vintage-brick text-xs rounded hover:bg-vintage-brick/25 transition-colors flex items-center justify-center gap-1.5 font-medium"
              >
                <Trash2 size={15} />
                删除此元素
              </button>
            </div>
          </div>
        )}

        <div className="vintage-card p-4">
          <h4 className="text-vintage-ink font-bold text-sm mb-3 font-serif">底部标题</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-vintage-inkLight text-xs block mb-1">年份</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full py-2 px-2.5 bg-vintage-paper border border-vintage-gold/30 rounded text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold"
                >
                  {Array.from({ length: 20 }, (_, i) => 1985 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-vintage-inkLight text-xs block mb-1">季节</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full py-2 px-2.5 bg-vintage-paper border border-vintage-gold/30 rounded text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold"
                >
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-vintage-inkLight text-xs block mb-1">心情</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full py-2 px-2.5 bg-vintage-paper border border-vintage-gold/30 rounded text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-vintage-inkLight text-xs block mb-1">自定义标题（留空则自动组合）</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="例如：1998·夏·与你共听"
                maxLength={20}
                className="w-full py-2 px-3 bg-vintage-paper border border-vintage-gold/30 rounded text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold placeholder:text-vintage-inkLight/40"
              />
            </div>
            <div className="text-center py-2.5 bg-vintage-gold/10 rounded border border-vintage-gold/20">
              <span className="text-vintage-brown font-bold font-display text-lg tracking-wide">
                {getBottomText()}
              </span>
            </div>
          </div>
        </div>

        <div className="vintage-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-vintage-ink font-bold text-sm font-serif flex items-center gap-1.5">
              <Quote size={15} />
              底部歌词/寄语
            </h4>
            <div className="flex gap-1">
              <button
                onClick={shuffleLyric}
                className="p-1.5 rounded bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-gold hover:bg-vintage-gold/20 transition-colors"
                title="换一条"
              >
                <Shuffle size={14} />
              </button>
              {!isEditingLyric ? (
                <button
                  onClick={startEditLyric}
                  className="p-1.5 rounded bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-gold hover:bg-vintage-gold/20 transition-colors"
                  title="编辑"
                >
                  <Edit3 size={14} />
                </button>
              ) : (
                <button
                  onClick={saveLyric}
                  className="p-1.5 rounded bg-vintage-moss/20 border border-vintage-moss/40 text-vintage-moss hover:bg-vintage-moss/30 transition-colors"
                  title="保存"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          </div>
          {isEditingLyric ? (
            <div>
              <textarea
                value={lyricDraft}
                onChange={(e) => setLyricDraft(e.target.value)}
                maxLength={60}
                rows={3}
                autoFocus
                className="w-full p-2.5 bg-vintage-paper border border-vintage-gold/40 rounded text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold resize-none font-serif leading-relaxed"
                placeholder="写下你想说的话..."
              />
              <p className="text-vintage-inkLight/50 text-[10px] text-right mt-1">
                {lyricDraft.length}/60
              </p>
            </div>
          ) : (
            <p className="text-vintage-inkLight/80 text-sm font-serif italic leading-relaxed min-h-[3.5rem] flex items-center">
              "{lyricText}"
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-md mb-6">
          <div className="vintage-card p-3 flex gap-3">
            <button
              onClick={autoGenerate}
              className="flex-1 vintage-btn-gold py-3 text-sm"
            >
              <Sparkles size={17} />
              <span>一键生成</span>
            </button>
            <button
              onClick={clearAll}
              className="vintage-btn-outline py-3 px-5 text-sm"
            >
              <Trash2 size={17} />
              <span>清空全部</span>
            </button>
          </div>
          {items.length > 0 && (
            <p className="text-vintage-paper/50 text-xs text-center mt-2 font-serif">
              已添加 {items.length} 个元素 · 悬停元素右上角可快速删除
            </p>
          )}
        </div>

        <div ref={polaroidRef} className="relative">
          <div className="bg-vintage-paper p-4 pb-16 shadow-vintage-lg rounded-sm" style={{ width: 360 }}>
            <div
              ref={frameRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => {
                setSelectedItemId(null);
                setIsEditingLyric(false);
              }}
              className="relative aspect-square bg-vintage-brownDark rounded-sm overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
              }}
            >
              <div className="absolute inset-4 border border-dashed border-vintage-gold/30 rounded pointer-events-none" />
              {items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-vintage-paper/40">
                    <Image size={44} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-serif">将左侧元素</p>
                    <p className="text-sm font-serif">拖拽到此处</p>
                  </div>
                </div>
              )}
              {items.map(renderItem)}
            </div>

            <div className="mt-5 text-center">
              <p className="vintage-heading text-2xl text-vintage-brown tracking-wide">
                {getBottomText()}
              </p>
              <p className="text-vintage-inkLight/70 text-xs mt-2 font-serif italic max-w-[280px] mx-auto leading-relaxed">
                "{lyricText}"
              </p>
            </div>
          </div>

          <div className="absolute -left-3 -top-3 w-10 h-10 bg-vintage-paper/60 rotate-[-8deg] shadow-sm pointer-events-none" />
          <div className="absolute -right-4 -top-1 w-10 h-10 bg-vintage-paper/60 rotate-[6deg] shadow-sm pointer-events-none" />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="vintage-btn-gold disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3"
          >
            <Download size={18} />
            <span>{isGenerating ? '生成中…' : '下载图片'}</span>
          </button>
          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="vintage-btn-outline disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3"
          >
            <Share2 size={18} />
            <span>{isGenerating ? '生成中…' : '分享'}</span>
          </button>
        </div>

        <p className="text-vintage-paper/40 text-xs mt-5 font-serif text-center max-w-xs">
          提示：点击选中元素可调整旋转/缩放；悬停元素右上角 × 可快速删除
        </p>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="vintage-card max-w-sm w-full p-6 animate-popup-bounce-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="vintage-heading text-xl text-vintage-ink">分享到社交平台</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-vintage-inkLight/50 hover:text-vintage-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-vintage-inkLight text-sm font-serif mb-5">
              您的浏览器暂不支持直接分享，请先下载图片或复制图片，然后粘贴到社交平台分享。
            </p>
            <div className="flex gap-3">
              <button onClick={copyToClipboard} className="flex-1 vintage-btn-gold text-sm py-2.5">
                复制图片
              </button>
              <button
                onClick={() => {
                  handleDownload();
                  setShowShareModal(false);
                }}
                className="flex-1 vintage-btn-outline text-sm py-2.5"
              >
                下载图片
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
