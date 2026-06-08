import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dna,
  Sparkles,
  Share2,
  Download,
  X,
  ArrowRight,
  Heart,
  Music,
  Calendar,
  Tag,
  Disc3,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useCollectionStore } from '@/store/collectionStore';
import { generateMusicDNAReport } from '@/lib/musicDNAAnalyzer';
import { personalityTypeShareText } from '@/data/musicDNA';
import type { MusicDNAReport } from '@/types';

type TestStage = 'intro' | 'analyzing' | 'result';

export default function MusicDNA() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { getUserCollections } = useCollectionStore();
  const [stage, setStage] = useState<TestStage>('intro');
  const [report, setReport] = useState<MusicDNAReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const punchCardRef = useRef<HTMLDivElement>(null);

  const collections = getUserCollections(currentUser.id);

  const startTest = () => {
    setStage('analyzing');
    setAnalyzingProgress(0);

    const steps = [
      { label: '正在读取音乐收藏…', delay: 400 },
      { label: '分析年代分布…', delay: 800 },
      { label: '识别音乐风格…', delay: 1200 },
      { label: '提取记忆标签…', delay: 1600 },
      { label: '计算人格因子…', delay: 2000 },
      { label: '生成音乐DNA…', delay: 2400 },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setAnalyzingProgress(((i + 1) / steps.length) * 100);
      }, step.delay);
    });

    setTimeout(() => {
      const result = generateMusicDNAReport({
        userId: currentUser.id,
        collections,
      });
      setReport(result);
      setStage('result');
    }, 2800);
  };

  const retakeTest = () => {
    setReport(null);
    setStage('intro');
  };

  const generatePunchCardImage = useCallback(async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !report) throw new Error('Canvas not supported');

    const scale = 3;
    const width = 720;
    const height = 1020;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    const paperBg = '#F5E6C8';
    const inkColor = '#2C1810';
    const accentColor = report.personality.color;

    ctx.fillStyle = paperBg;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `rgba(44, 24, 16, ${Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    ctx.strokeStyle = `${inkColor}33`;
    ctx.lineWidth = 1;
    for (let y = 60; y < height - 40; y += 36) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 40, y);
      ctx.stroke();
    }

    const holePositions: number[] = [];
    for (let x = 60; x < width - 40; x += 36) {
      holePositions.push(x);
    }

    const seed = report.generatedAt.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pseudoRand = (n: number) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };

    for (let row = 0; row < 24; row++) {
      for (let col = 0; col < holePositions.length; col++) {
        const shouldPunch = pseudoRand(row * 100 + col) > 0.55;
        if (shouldPunch) {
          const x = holePositions[col];
          const y = 76 + row * 36;

          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = inkColor;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#1a0f08';
          ctx.fill();
        }
      }
    }

    ctx.fillStyle = inkColor;
    ctx.fillRect(0, 0, width, 44);
    ctx.fillStyle = paperBg;
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('◉ MUSIC DNA PUNCH CARD ◉  岁月如歌 MUSIC MEMORY SYSTEM', 24, 28);

    ctx.fillStyle = inkColor;
    ctx.fillRect(0, height - 80, width, 80);

    ctx.fillStyle = paperBg;
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`USER: ${currentUser.nickname}`, 24, height - 50);
    ctx.fillText(`ID: ${currentUser.id.toUpperCase().slice(0, 12)}`, 24, height - 28);
    ctx.textAlign = 'right';
    ctx.fillText(
      `DATE: ${new Date(report.generatedAt).toLocaleDateString('zh-CN')}`,
      width - 24,
      height - 50
    );
    ctx.fillText(
      `AVG-YEAR: ${report.avgYear}  DECADE: ${report.dominantDecade.decade}`,
      width - 24,
      height - 28
    );

    ctx.fillStyle = inkColor;
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 40, 950);

    const pType = report.personality;
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText(
      `> PERSONALITY: [${pType.id.toUpperCase()}] ${pType.emoji} ${pType.name}`,
      40,
      975
    );

    const styleLine = report.dominantStyles
      .slice(0, 3)
      .map((s) => `${s.style.label}${s.percentage}%`)
      .join(' | ');
    ctx.fillStyle = inkColor;
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText(`> STYLE-DNA: ${styleLine}`, 40, 995);

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    return canvas.toDataURL('image/png', 1.0);
  }, [report, currentUser]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generatePunchCardImage();
      const link = document.createElement('a');
      link.download = `音乐DNA报告_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('生成图片失败:', err);
      alert('图片生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const dataUrl = await generatePunchCardImage();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      alert('穿孔卡片已复制到剪贴板！');
      setShowShareModal(false);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请使用下载功能');
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generatePunchCardImage();
      if (navigator.share) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], '音乐DNA穿孔卡片.png', { type: 'image/png' });
        const text = report ? personalityTypeShareText(report.personality) : '';
        await navigator.share({
          title: '我的音乐DNA报告',
          text,
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

  if (stage === 'intro') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-vintage-gradient noise-overlay relative overflow-hidden py-16">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-vintage-brick/10 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30 mb-8">
              <Dna size={16} className="text-vintage-gold" />
              <span className="text-vintage-gold/90 text-sm">Music DNA Test</span>
            </div>

            <h1 className="vintage-heading text-5xl md:text-6xl mb-6">
              音乐DNA测试
            </h1>
            <p className="text-vintage-paper/80 font-serif text-xl md:text-2xl mb-4 italic">
              解锁你的怀旧人格类型
            </p>
            <p className="text-vintage-paper/60 font-serif text-base mb-10 max-w-xl mx-auto leading-relaxed">
              根据你收藏歌曲的风格、年份和记忆标签，
              <br className="hidden sm:block" />
              生成一份专属「音乐DNA报告」。
              <br />
              附带老式电脑穿孔卡片，一键分享到社交平台。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
              {[
                { icon: Music, title: '风格分析', desc: '识别摇滚、民谣、港乐等7种音乐DNA' },
                { icon: Calendar, title: '年代解码', desc: '分析80s vs 90s的音乐偏好' },
                { icon: Sparkles, title: '人格画像', desc: '生成专属怀旧人格类型与推荐' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-vintage-gold/20 bg-vintage-brown/50 backdrop-blur-sm"
                >
                  <item.icon size={28} className="text-vintage-gold mx-auto mb-3" />
                  <h3 className="text-vintage-gold font-display text-lg font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-vintage-paper/60 text-sm font-serif">{item.desc}</p>
                </div>
              ))}
            </div>

            <button onClick={startTest} className="vintage-btn-gold text-lg px-10 py-4">
              <Sparkles size={22} />
              <span>开始测试</span>
            </button>

            {collections.length > 0 && (
              <p className="text-vintage-paper/40 text-sm mt-4 font-serif">
                将基于你的 {collections.length} 首收藏歌曲进行分析
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'analyzing') {
    const messages = [
      '正在读取音乐收藏…',
      '分析年代分布…',
      '识别音乐风格…',
      '提取记忆标签…',
      '计算人格因子…',
      '生成音乐DNA…',
    ];
    const currentStep = Math.min(
      Math.floor((analyzingProgress / 100) * messages.length),
      messages.length - 1
    );

    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-vintage-brownDark py-16">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <div className="retro-window">
              <div className="retro-window-titlebar">
                <span className="retro-window-title">
                  <Disc3 size={14} /> MUSIC_DNA_ANALYZER.EXE
                </span>
                <div className="flex gap-1">
                  <button className="retro-window-btn">_</button>
                  <button className="retro-window-btn">□</button>
                  <button className="retro-window-btn">×</button>
                </div>
              </div>
              <div className="retro-window-content">
                <div className="retro-inset-panel mb-4">
                  <div className="mono-font text-sm space-y-1 min-h-[120px]">
                    {messages.slice(0, currentStep + 1).map((msg, i) => (
                      <p key={i} className="text-black">
                        <span className="text-green-700">{'>'}</span> {msg}
                        {i === currentStep && (
                          <span className="inline-block w-2 h-4 bg-black ml-1 animate-pulse" />
                        )}
                        {i < currentStep && (
                          <span className="text-green-700 ml-2">[OK]</span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mono-font text-black mb-1">
                    <span>PROGRESS</span>
                    <span>{Math.round(analyzingProgress)}%</span>
                  </div>
                  <div className="h-5 bg-white border-2 border-black relative overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${analyzingProgress}%`,
                        background:
                          'repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #1084d0 8px, #1084d0 16px)',
                      }}
                    />
                  </div>
                </div>

                <p className="mono-font text-xs text-black/60 text-center">
                  Please wait while we decode your music DNA...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-vintage-brownDark py-10 md:py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30 mb-4">
              <Dna size={16} className="text-vintage-gold" />
              <span className="text-vintage-gold/90 text-sm">你的音乐DNA报告</span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-5xl mb-2">Music DNA Report</h1>
            <p className="text-vintage-paper/60 font-serif">
              生成于 {new Date(report.generatedAt).toLocaleString('zh-CN')}
            </p>
          </div>

          <div
            className="vintage-card p-6 md:p-8 mb-8 overflow-hidden relative"
            style={{ borderLeft: `6px solid ${report.personality.color}` }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${report.personality.color}, transparent)`,
                  transform: 'translate(30%, -30%)',
                }}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto md:mx-0"
                style={{ backgroundColor: `${report.personality.color}20` }}
              >
                <span className="text-5xl">{report.personality.emoji}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm font-serif text-vintage-inkLight mb-1">你的怀旧人格</p>
                <h2
                  className="vintage-heading text-3xl md:text-4xl mb-2"
                  style={{ color: report.personality.color }}
                >
                  {report.personality.name}
                </h2>
                <p className="text-vintage-ink font-serif text-lg italic mb-4">
                  「{report.personality.title}」
                </p>
                <p className="text-vintage-inkLight/80 font-serif leading-relaxed mb-5">
                  {report.personality.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {report.personality.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 rounded-full text-sm font-medium font-serif"
                      style={{
                        backgroundColor: `${report.personality.color}15`,
                        color: report.personality.color,
                        border: `1px solid ${report.personality.color}40`,
                      }}
                    >
                      #{trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="vintage-card p-6">
              <h3 className="vintage-heading text-xl mb-4 flex items-center gap-2">
                <Music size={20} className="text-vintage-gold" />
                风格DNA分布
              </h3>
              <div className="space-y-3">
                {report.dominantStyles.slice(0, 5).map(({ style, percentage }) => (
                  <div key={style.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-vintage-ink font-medium font-serif">
                        {style.label}
                      </span>
                      <span className="text-vintage-inkLight font-serif">{percentage}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-vintage-brown/20 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: style.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="vintage-card p-6">
              <h3 className="vintage-heading text-xl mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-vintage-gold" />
                年代偏好
              </h3>
              <div className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-vintage-inkLight text-sm font-serif mb-2">平均收藏年份</p>
                  <p className="vintage-heading text-5xl" style={{ color: '#B7410E' }}>
                    {report.avgYear}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      report.dominantDecade.decade === '80s'
                        ? 'border-vintage-gold bg-vintage-gold/10'
                        : 'border-vintage-brown/20 bg-vintage-brown/5'
                    }`}
                  >
                    <p className="vintage-heading text-3xl mb-1">80s</p>
                    <p className="text-vintage-inkLight text-xs font-serif">八十年代</p>
                  </div>
                  <div
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      report.dominantDecade.decade === '90s'
                        ? 'border-vintage-gold bg-vintage-gold/10'
                        : 'border-vintage-brown/20 bg-vintage-brown/5'
                    }`}
                  >
                    <p className="vintage-heading text-3xl mb-1">90s</p>
                    <p className="text-vintage-inkLight text-xs font-serif">九十年代</p>
                  </div>
                </div>
                <p className="text-center text-vintage-inkLight/70 text-sm font-serif">
                  你的音乐偏好偏向{' '}
                  <span className="font-bold" style={{ color: report.personality.color }}>
                    {report.dominantDecade.decade === '80s' ? '八十年代' : '九十年代'}
                  </span>{' '}
                  （占比 {report.dominantDecade.percentage}%）
                </p>
              </div>
            </div>
          </div>

          {report.topCollectedArtists.length > 0 && (
            <div className="vintage-card p-6 mb-8">
              <h3 className="vintage-heading text-xl mb-4 flex items-center gap-2">
                <Disc3 size={20} className="text-vintage-gold" />
                你的挚爱歌手
              </h3>
              <div className="flex flex-wrap gap-3">
                {report.topCollectedArtists.map(({ artist, count }) => (
                  <div
                    key={artist}
                    className="flex items-center gap-3 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30"
                  >
                    <span className="text-vintage-ink font-serif font-medium">{artist}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-vintage-gold text-vintage-brown font-bold">
                      {count}首
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.dominantTags.length > 0 && (
            <div className="vintage-card p-6 mb-8">
              <h3 className="vintage-heading text-xl mb-4 flex items-center gap-2">
                <Tag size={20} className="text-vintage-gold" />
                高频记忆标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.dominantTags.map(({ tag, count }) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-vintage-paper font-medium font-serif shadow-md"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.text}
                    <span className="text-xs opacity-80">×{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div ref={punchCardRef} className="mb-8">
            <div className="text-center mb-4">
              <h3 className="vintage-heading text-2xl mb-1">穿孔卡片 · 你的音乐DNA凭证</h3>
              <p className="text-vintage-paper/60 font-serif text-sm">
                仿老式电脑穿孔卡片样式 · 可下载分享
              </p>
            </div>
            <PunchCardVisual report={report} nickname={currentUser.nickname} />
          </div>

          {report.recommendations.length > 0 && (
            <div className="vintage-card p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="vintage-heading text-xl flex items-center gap-2">
                  <Sparkles size={20} className="text-vintage-gold" />
                  同年代遗珠推荐
                </h3>
                <p className="text-vintage-inkLight/70 text-sm font-serif">
                  基于你的DNA精选，可能会喜欢
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.recommendations.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => navigate(`/song/${song.id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-vintage-brown/20 hover:bg-vintage-gold/10 border border-vintage-gold/20 hover:border-vintage-gold/40 transition-all cursor-pointer group"
                  >
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-14 h-14 rounded-lg object-cover shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-vintage-ink font-medium font-serif truncate group-hover:text-vintage-gold transition-colors">
                        {song.title}
                      </p>
                      <p className="text-vintage-inkLight/70 text-sm truncate">
                        {song.artist} · {song.year}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-vintage-inkLight/40 group-hover:text-vintage-gold transition-colors flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="vintage-btn-gold disabled:opacity-50"
            >
              <Share2 size={18} />
              <span>{isGenerating ? '生成中…' : '分享报告'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="vintage-btn-outline disabled:opacity-50"
            >
              <Download size={18} />
              <span>下载穿孔卡片</span>
            </button>
            <button onClick={retakeTest} className="vintage-btn-outline">
              <RefreshCw size={18} />
              <span>重新测试</span>
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/collection"
              className="inline-flex items-center gap-1 text-vintage-gold/80 hover:text-vintage-gold text-sm font-serif transition-colors"
            >
              <Heart size={14} />
              <span>管理我的音乐收藏</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="vintage-card max-w-sm w-full p-6 animate-popup-bounce-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="vintage-heading text-xl text-vintage-ink">分享音乐DNA</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-vintage-inkLight/50 hover:text-vintage-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-vintage-inkLight text-sm font-serif mb-5">
              您的浏览器暂不支持直接分享，请先下载或复制穿孔卡片图片，然后粘贴到社交平台。
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

function PunchCardVisual({
  report,
  nickname,
}: {
  report: MusicDNAReport;
  nickname: string;
}) {
  const rows = 24;
  const cols = 17;
  const seed = report.generatedAt.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pseudoRand = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };

  return (
    <div
      className="mx-auto max-w-[520px] rounded-lg overflow-hidden shadow-vintage-lg border-2 border-vintage-ink"
      style={{ backgroundColor: '#F5E6C8' }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: '#2C1810' }}
      >
        <span className="mono-font text-xs font-bold text-vintage-paper tracking-wider">
          ◉ MUSIC DNA PUNCH CARD
        </span>
        <span className="mono-font text-[10px] text-vintage-paper/70">岁月如歌 v1.0</span>
      </div>

      <div className="p-5">
        <div className="relative" style={{ minHeight: 320 }}>
          <div className="absolute inset-0 flex flex-col gap-[10px]">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex justify-between gap-[10px]">
                {Array.from({ length: cols }).map((_, colIdx) => {
                  const punched = pseudoRand(rowIdx * 100 + colIdx) > 0.55;
                  return (
                    <div
                      key={colIdx}
                      className="w-5 h-5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: punched ? '#2C1810' : 'transparent',
                        boxShadow: punched
                          ? 'inset 0 2px 4px rgba(0,0,0,0.5)'
                          : 'inset 0 0 0 1px rgba(44,24,16,0.1)',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-vintage-ink/20">
          <div className="mono-font text-[10px] text-vintage-ink/60 mb-2">
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="mono-font text-xs font-bold mb-1"
                style={{ color: report.personality.color }}
              >
                {'>'} {report.personality.emoji} {report.personality.name}
              </p>
              <p className="mono-font text-[10px] text-vintage-ink/60">
                {report.dominantStyles
                  .slice(0, 3)
                  .map((s) => `${s.style.label}${s.percentage}%`)
                  .join(' | ')}
              </p>
            </div>
            <div className="text-right">
              <p className="mono-font text-[10px] text-vintage-ink/60">USER: {nickname}</p>
              <p className="mono-font text-[10px] text-vintage-ink/60">
                YEAR: {report.avgYear} · {report.dominantDecade.decade}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ backgroundColor: '#2C1810' }}
      >
        <span className="mono-font text-[10px] text-vintage-paper/70">
          {new Date(report.generatedAt).toLocaleDateString('zh-CN')}
        </span>
        <span className="mono-font text-[10px] text-vintage-paper/70">
          ID: {report.personality.id.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
