import { useState } from 'react';
import { X, Plus, Music, Search, Check } from 'lucide-react';
import type { GuessQuestion, Song } from '@/types';
import { mockSongs } from '@/data/songs';
import { useGuessStore } from '@/store/guessStore';
import { useUserStore } from '@/store/userStore';

interface Props {
  onClose: () => void;
}

export default function CreateQuestionModal({ onClose }: Props) {
  const { currentUser } = useUserStore();
  const { createQuestion } = useGuessStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [lyricLine, setLyricLine] = useState('');
  const [points, setPoints] = useState(15);
  const [hintTVShow, setHintTVShow] = useState('');
  const [created, setCreated] = useState(false);

  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    const lines = song.lyrics.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length > 0) {
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      const nextLine = lines[lines.indexOf(randomLine) + 1] || '';
      setLyricLine(nextLine ? `${randomLine}，${nextLine}` : randomLine);
    }
  };

  const handleSubmit = () => {
    if (!selectedSong || !lyricLine.trim()) return;

    const newQuestion: GuessQuestion = {
      id: `user-${Date.now()}`,
      weekNumber: 0,
      songId: selectedSong.id,
      lyricLine: lyricLine.trim(),
      correctTitle: selectedSong.title,
      correctArtist: selectedSong.artist,
      hintYear: selectedSong.year,
      hintTVShow: hintTVShow.trim() || undefined,
      points,
      isUserCreated: true,
      createdBy: currentUser.nickname,
      createdAt: new Date().toISOString(),
    };

    createQuestion(newQuestion);
    setCreated(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="vintage-card max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-popup-bounce-in">
        <div className="flex items-center justify-between p-5 border-b border-vintage-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vintage-moss/20 flex items-center justify-center">
              <Plus size={22} className="text-vintage-moss" />
            </div>
            <div>
              <h2 className="vintage-heading text-xl text-vintage-ink">出一道题</h2>
              <p className="text-vintage-inkLight text-xs">分享你喜欢的老歌给大家猜</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-vintage-inkLight/50 hover:text-vintage-ink transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {created ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-20 h-20 rounded-full bg-vintage-moss/15 flex items-center justify-center mb-4 animate-popup-bounce-in">
              <Check size={40} className="text-vintage-moss" />
            </div>
            <p className="vintage-heading text-2xl text-vintage-ink mb-2">题目创建成功！</p>
            <p className="text-vintage-inkLight/70 font-serif text-center">
              你出的题目已加入本周挑战，感谢分享！
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div>
              <label className="block text-vintage-ink text-sm font-medium mb-2">
                选择歌曲
              </label>
              <div className="relative mb-3">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-vintage-inkLight/50"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索歌名或歌手..."
                  className="w-full py-2.5 pl-9 pr-4 bg-vintage-paperLight border border-vintage-gold/30 rounded-lg text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold font-serif"
                />
              </div>
              <div className="max-h-40 overflow-y-auto rounded-lg border border-vintage-gold/20 divide-y divide-vintage-gold/10">
                {filteredSongs.length === 0 ? (
                  <p className="p-4 text-center text-vintage-inkLight/50 text-sm">
                    未找到相关歌曲
                  </p>
                ) : (
                  filteredSongs.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => handleSelectSong(song)}
                      className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                        selectedSong?.id === song.id
                          ? 'bg-vintage-gold/10'
                          : 'hover:bg-vintage-gold/5'
                      }`}
                    >
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-vintage-ink text-sm font-medium truncate">
                          {song.title}
                        </p>
                        <p className="text-vintage-inkLight/60 text-xs truncate">
                          {song.artist} · {song.year}
                        </p>
                      </div>
                      {selectedSong?.id === song.id && (
                        <Check size={18} className="text-vintage-gold" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {selectedSong && (
              <div>
                <label className="block text-vintage-ink text-sm font-medium mb-2">
                  歌词提示
                </label>
                <textarea
                  value={lyricLine}
                  onChange={(e) => setLyricLine(e.target.value)}
                  placeholder="输入一句歌词作为提示..."
                  rows={3}
                  className="w-full p-3 bg-vintage-paperLight border border-vintage-gold/30 rounded-lg text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold resize-none font-serif leading-relaxed"
                />
                <p className="text-vintage-inkLight/50 text-xs mt-1">
                  提示：可以从上方歌词中挑选，也可以自己输入
                </p>
              </div>
            )}

            {selectedSong && (
              <div>
                <label className="block text-vintage-ink text-sm font-medium mb-2">
                  电视剧关联（选填）
                </label>
                <input
                  type="text"
                  value={hintTVShow}
                  onChange={(e) => setHintTVShow(e.target.value)}
                  placeholder="例如：还珠格格、流星花园..."
                  className="w-full py-2.5 px-3 bg-vintage-paperLight border border-vintage-gold/30 rounded-lg text-vintage-ink text-sm focus:outline-none focus:border-vintage-gold font-serif"
                />
              </div>
            )}

            {selectedSong && (
              <div>
                <label className="block text-vintage-ink text-sm font-medium mb-2">
                  答对奖励积分
                </label>
                <div className="flex gap-2">
                  {[10, 15, 20, 30].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPoints(p)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        points === p
                          ? 'bg-vintage-gold text-vintage-brown'
                          : 'bg-vintage-paperDark/50 text-vintage-inkLight hover:bg-vintage-paperDark'
                      }`}
                    >
                      {p} 分
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSong && (
              <div className="p-4 rounded-xl bg-vintage-gold/5 border border-vintage-gold/20">
                <p className="text-vintage-inkLight/70 text-xs mb-2 font-medium">题目预览</p>
                <p className="quote-mark text-vintage-gold/30 text-3xl leading-none">"</p>
                <p className="text-vintage-ink font-serif italic px-4 -mt-4">
                  {lyricLine || '请输入歌词提示...'}
                </p>
                <div className="mt-3 pt-3 border-t border-vintage-gold/10 flex items-center justify-between text-xs">
                  <span className="text-vintage-inkLight/60">
                    正确答案：{selectedSong.title} - {selectedSong.artist}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-vintage-gold/15 text-vintage-gold font-medium">
                    {points} 积分
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {!created && (
          <div className="p-5 border-t border-vintage-gold/20 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-vintage-gold/30 text-vintage-inkLight text-sm font-medium hover:bg-vintage-gold/5 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedSong || !lyricLine.trim()}
              className="flex-1 vintage-btn-gold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              创建题目
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
