import { useState, useEffect } from 'react';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Music,
  Trophy,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus,
  User,
} from 'lucide-react';
import type { GuessQuestion } from '@/types';
import { useGuessStore } from '@/store/guessStore';
import { useUserStore } from '@/store/userStore';
import {
  getCurrentWeekQuestions,
  getRandomPoolQuestion,
} from '@/data/guessSongs';
import { mockSongs } from '@/data/songs';

interface Props {
  onOpenShop: () => void;
  onOpenCreate: () => void;
}

type QuestionStatus = 'idle' | 'correct' | 'wrong';

export default function GuessSongChallenge({ onOpenShop, onOpenCreate }: Props) {
  const { currentUser } = useUserStore();
  const {
    points,
    totalCorrect,
    totalAttempts,
    recordGuess,
    addPoints,
    hasAnswered,
    userCreatedQuestions,
  } = useGuessStore();

  const [questions, setQuestions] = useState<GuessQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [titleInput, setTitleInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState<'year' | 'tvshow'>('year');
  const [status, setStatus] = useState<QuestionStatus>('idle');
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [activeTab, setActiveTab] = useState<'weekly' | 'extra'>('weekly');

  useEffect(() => {
    const weekly = getCurrentWeekQuestions();
    const userQuestions = userCreatedQuestions;
    const all = [...weekly, ...userQuestions];
    setQuestions(all);
  }, [userCreatedQuestions]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (!currentQuestion || status !== 'idle') return;

    const titleMatch =
      titleInput.trim().toLowerCase() ===
      currentQuestion.correctTitle.toLowerCase();
    const artistMatch =
      artistInput.trim().toLowerCase() ===
      currentQuestion.correctArtist.toLowerCase();
    const isCorrect = titleMatch && artistMatch;

    let earned = 0;
    if (isCorrect) {
      earned = showHint
        ? Math.floor(currentQuestion.points * 0.5)
        : currentQuestion.points;
      addPoints(earned);
      setStatus('correct');
      setEarnedPoints(earned);
    } else {
      setStatus('wrong');
    }

    recordGuess({
      questionId: currentQuestion.id,
      isCorrect,
      usedHint: showHint,
      pointsEarned: earned,
      guessedAt: new Date().toISOString(),
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setTitleInput('');
    setArtistInput('');
    setShowHint(false);
    setStatus('idle');
    setEarnedPoints(0);
  };

  const handleRandomExtra = () => {
    const random = getRandomPoolQuestion();
    setQuestions([random]);
    setCurrentIndex(0);
    setTitleInput('');
    setArtistInput('');
    setShowHint(false);
    setStatus('idle');
    setEarnedPoints(0);
    setActiveTab('extra');
  };

  const handleShowHint = (type: 'year' | 'tvshow') => {
    setHintType(type);
    setShowHint(true);
  };

  const isAnswered = currentQuestion ? hasAnswered(currentQuestion.id) : false;
  const accuracy =
    totalAttempts > 0
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 0;

  if (!currentQuestion) {
    return (
      <div className="vintage-card p-8 text-center">
        <Music size={48} className="mx-auto text-vintage-gold/50 mb-4" />
        <p className="text-vintage-inkLight font-serif">暂无猜歌题目</p>
        <button
          onClick={handleRandomExtra}
          className="mt-4 vintage-btn-gold text-sm"
        >
          <RefreshCw size={16} />
          随机挑战
        </button>
      </div>
    );
  }

  const relatedSong = mockSongs.find((s) => s.id === currentQuestion.songId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="vintage-card p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-vintage-gold/15 flex items-center justify-center">
            <Trophy size={24} className="text-vintage-gold" />
          </div>
          <div>
            <p className="text-vintage-inkLight text-xs">我的积分</p>
            <p className="vintage-heading text-2xl text-vintage-ink">{points}</p>
          </div>
        </div>
        <div className="vintage-card p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-vintage-moss/20 flex items-center justify-center">
            <CheckCircle2 size={24} className="text-vintage-moss" />
          </div>
          <div>
            <p className="text-vintage-inkLight text-xs">答对题数</p>
            <p className="vintage-heading text-2xl text-vintage-ink">
              {totalCorrect}
            </p>
          </div>
        </div>
        <div className="vintage-card p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-vintage-brick/15 flex items-center justify-center">
            <Sparkles size={24} className="text-vintage-brick" />
          </div>
          <div>
            <p className="text-vintage-inkLight text-xs">正确率</p>
            <p className="vintage-heading text-2xl text-vintage-ink">
              {accuracy}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setActiveTab('weekly');
            const weekly = getCurrentWeekQuestions();
            setQuestions([...weekly, ...userCreatedQuestions]);
            setCurrentIndex(0);
            setTitleInput('');
            setArtistInput('');
            setShowHint(false);
            setStatus('idle');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'weekly'
              ? 'bg-vintage-gold text-vintage-brown'
              : 'bg-vintage-paperDark/50 text-vintage-inkLight hover:bg-vintage-paperDark'
          }`}
        >
          本周挑战 ({getCurrentWeekQuestions().length}题)
        </button>
        <button
          onClick={handleRandomExtra}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'extra'
              ? 'bg-vintage-gold text-vintage-brown'
              : 'bg-vintage-paperDark/50 text-vintage-inkLight hover:bg-vintage-paperDark'
          }`}
        >
          <RefreshCw size={14} />
          随机练手
        </button>
        <button
          onClick={onOpenCreate}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-vintage-moss/20 text-vintage-moss hover:bg-vintage-moss/30 transition-all flex items-center gap-1"
        >
          <Plus size={14} />
          我来出题
        </button>
        <button
          onClick={onOpenShop}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-vintage-brick/15 text-vintage-brick hover:bg-vintage-brick/25 transition-all ml-auto"
        >
          <Trophy size={14} />
          积分兑换
        </button>
      </div>

      <div className="vintage-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-vintage-gold/5 rounded-full blur-2xl" />

        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-vintage-gold/15 text-vintage-gold text-xs font-medium">
              {currentQuestion.points} 积分
            </span>
            {currentQuestion.isUserCreated && (
              <span className="px-3 py-1 rounded-full bg-vintage-moss/20 text-vintage-moss text-xs font-medium flex items-center gap-1">
                <User size={12} />
                网友出题
              </span>
            )}
            {isAnswered && !status && (
              <span className="px-3 py-1 rounded-full bg-vintage-inkLight/10 text-vintage-inkLight text-xs font-medium">
                已答过
              </span>
            )}
          </div>
          <div className="text-vintage-inkLight text-xs font-serif">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="mb-8 relative">
          <p className="quote-mark absolute -top-4 -left-2">"</p>
          <p className="text-xl md:text-2xl text-vintage-ink font-serif leading-relaxed italic text-center px-8 py-6">
            {currentQuestion.lyricLine}
          </p>
          <p className="quote-mark absolute -bottom-8 right-0 rotate-180">"</p>
        </div>

        {status === 'correct' && (
          <div className="mb-6 p-4 rounded-xl bg-vintage-moss/10 border border-vintage-moss/30 flex items-center gap-3 animate-popup-bounce-in">
            <CheckCircle2 size={28} className="text-vintage-moss flex-shrink-0" />
            <div>
              <p className="text-vintage-moss font-bold">回答正确！</p>
              <p className="text-vintage-inkLight text-sm">
                获得 {earnedPoints} 积分
                {showHint && '（使用提示减半）'}
              </p>
            </div>
          </div>
        )}

        {status === 'wrong' && (
          <div className="mb-6 p-4 rounded-xl bg-vintage-brick/10 border border-vintage-brick/30 flex items-center gap-3 animate-popup-bounce-in">
            <XCircle size={28} className="text-vintage-brick flex-shrink-0" />
            <div>
              <p className="text-vintage-brick font-bold">回答错误</p>
              <p className="text-vintage-inkLight text-sm">
                正确答案：{currentQuestion.correctTitle} -{' '}
                {currentQuestion.correctArtist}
              </p>
            </div>
          </div>
        )}

        {status === 'idle' && showHint && (
          <div className="mb-6 p-4 rounded-xl bg-vintage-gold/10 border border-vintage-gold/30 flex items-start gap-3">
            <Lightbulb size={20} className="text-vintage-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-vintage-gold font-medium text-sm mb-1">提示</p>
              {hintType === 'year' && (
                <p className="text-vintage-ink text-sm">
                  这首歌发行于 <strong>{currentQuestion.hintYear}</strong> 年
                </p>
              )}
              {hintType === 'tvshow' && currentQuestion.hintTVShow && (
                <p className="text-vintage-ink text-sm">
                  出自电视剧：<strong>{currentQuestion.hintTVShow}</strong>
                </p>
              )}
              {hintType === 'tvshow' && !currentQuestion.hintTVShow && (
                <p className="text-vintage-ink text-sm">
                  这首歌发行于 <strong>{currentQuestion.hintYear}</strong> 年
                  （暂无电视剧关联信息）
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-vintage-inkLight text-sm mb-2 font-medium">
              歌名
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              disabled={status !== 'idle'}
              placeholder="请输入歌曲名称"
              className="w-full py-3 px-4 bg-vintage-paperLight border border-vintage-gold/30 rounded-lg text-vintage-ink focus:outline-none focus:border-vintage-gold transition-colors disabled:opacity-50 font-serif"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <label className="block text-vintage-inkLight text-sm mb-2 font-medium">
              歌手
            </label>
            <input
              type="text"
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              disabled={status !== 'idle'}
              placeholder="请输入歌手名称"
              className="w-full py-3 px-4 bg-vintage-paperLight border border-vintage-gold/30 rounded-lg text-vintage-ink focus:outline-none focus:border-vintage-gold transition-colors disabled:opacity-50 font-serif"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {status === 'idle' && (
            <>
              <button
                onClick={handleSubmit}
                disabled={!titleInput.trim() || !artistInput.trim()}
                className="vintage-btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={18} />
                提交答案
              </button>
              {!showHint && (
                <>
                  <button
                    onClick={() => handleShowHint('year')}
                    className="vintage-btn-outline text-sm"
                  >
                    <HelpCircle size={16} />
                    看年份提示
                  </button>
                  <button
                    onClick={() => handleShowHint('tvshow')}
                    className="vintage-btn-outline text-sm"
                  >
                    <Lightbulb size={16} />
                    看电视剧提示
                  </button>
                </>
              )}
            </>
          )}
          {status !== 'idle' && (
            <>
              {relatedSong && (
                <button
                  onClick={() => {
                    window.location.href = `/song/${relatedSong.id}`;
                  }}
                  className="vintage-btn-outline text-sm"
                >
                  <Music size={16} />
                  查看歌曲详情
                </button>
              )}
              <button onClick={handleNextQuestion} className="vintage-btn-gold">
                <ArrowRight size={18} />
                下一题
              </button>
            </>
          )}
        </div>

        {showHint && status === 'idle' && (
          <p className="mt-4 text-vintage-inkLight/60 text-xs text-center font-serif">
            💡 使用提示后答对只能获得一半积分
          </p>
        )}
      </div>
    </div>
  );
}
