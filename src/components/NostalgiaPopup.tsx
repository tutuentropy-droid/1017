import { useEffect, useState } from 'react';
import { Music, Sparkles } from 'lucide-react';
import { getRandomComment } from '@/data/nostalgiaComments';

interface NostalgiaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lyric: string;
  songId: string;
  songTitle: string;
  artist: string;
  year: number;
}

export default function NostalgiaPopup({
  isOpen,
  onClose,
  lyric,
  songId,
  songTitle,
  artist,
  year,
}: NostalgiaPopupProps) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen) {
      setComment(getRandomComment(songId));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, songId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-vintage-brownDark/70 backdrop-blur-sm" />
      <div
        className="relative retro-window w-full max-w-md animate-popup-bounce-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="retro-window-titlebar">
          <div className="retro-window-title">
            <Music size={14} />
            <span>怀旧记忆.exe</span>
          </div>
          <div className="flex gap-1">
            <button
              className="retro-window-btn"
              title="最小化"
              onClick={onClose}
            >
              _
            </button>
            <button
              className="retro-window-btn"
              title="最大化"
              onClick={onClose}
            >
              □
            </button>
            <button
              className="retro-window-btn"
              title="关闭"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <div className="retro-window-content">
          <div className="retro-inset-panel mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center bg-[#c0c0c0] border border-[#808080]">
                <Music size={20} className="text-[#000080]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-[#808080] mb-1">—— 歌词弹幕详情 ——</div>
                <p className="text-[14px] text-black leading-relaxed font-bold">
                  「{lyric}」
                </p>
              </div>
            </div>
          </div>

          <div className="retro-inset-panel mb-4">
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center gap-2">
                <span className="text-[#808080] w-16">歌曲名：</span>
                <span className="text-black font-bold">《{songTitle}》</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#808080] w-16">歌手：</span>
                <span className="text-black">{artist}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#808080] w-16">年份：</span>
                <span className="text-black">{year}年</span>
              </div>
            </div>
          </div>

          <div className="retro-inset-panel mb-4">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles size={16} className="text-[#000080] flex-shrink-0 mt-0.5" />
              <span className="text-[12px] text-[#000080] font-bold">
                时光留言板
              </span>
            </div>
            <p className="text-[13px] text-black leading-relaxed italic pl-6">
              {comment}
            </p>
          </div>

          <div className="flex justify-center">
            <button className="retro-button" onClick={onClose}>
              确定
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-[#808080]">
            <div className="flex items-center justify-between text-[11px] text-[#808080]">
              <span>● 已连接到时光服务器</span>
              <span>内存占用: 640K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
