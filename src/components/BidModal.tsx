import { useState, useEffect } from 'react';
import {
  X,
  Gavel,
  Trophy,
  Minus,
  Plus,
  AlertCircle,
  CheckCircle,
  Zap,
  Crown,
} from 'lucide-react';
import type { AuctionPlaylist } from '@/types';
import { useGuessStore } from '@/store/guessStore';
import { useAuctionStore } from '@/store/auctionStore';

interface Props {
  playlist: AuctionPlaylist;
  onClose: () => void;
}

export default function BidModal({ playlist, onClose }: Props) {
  const { points } = useGuessStore();
  const { placeBid } = useAuctionStore();
  const minBid = (playlist.currentBid || playlist.startingPrice) + playlist.minBidIncrement;
  const [bidAmount, setBidAmount] = useState<number>(minBid);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickBids = [
    playlist.minBidIncrement,
    playlist.minBidIncrement * 3,
    playlist.minBidIncrement * 5,
    playlist.minBidIncrement * 10,
  ];

  useEffect(() => {
    setBidAmount(minBid);
  }, [minBid]);

  const handleQuickBid = (delta: number) => {
    setBidAmount((prev) => Math.max(minBid, prev + delta));
  };

  const handleCustomBid = (value: string) => {
    const num = parseInt(value) || 0;
    setBidAmount(Math.max(minBid, num));
  };

  const handleSubmit = async () => {
    if (bidAmount < minBid) {
      setMessage({
        type: 'error',
        text: `出价至少需要 ${minBid} 积分`,
      });
      return;
    }
    if (bidAmount > points) {
      setMessage({ type: 'error', text: '积分不足，请先答题赚取积分' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    await new Promise((r) => setTimeout(r, 600));

    const result = placeBid(playlist.id, bidAmount);
    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="vintage-card max-w-md w-full animate-popup-bounce-in overflow-hidden">
        <div className="p-5 border-b border-vintage-gold/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-vintage-brick/15 flex items-center justify-center">
                <Gavel size={24} className="text-vintage-brick" />
              </div>
              <div>
                <h2 className="vintage-heading text-xl text-vintage-ink">参与竞拍</h2>
                <p className="text-vintage-inkLight text-xs mt-0.5">
                  {playlist.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-vintage-inkLight/50 hover:text-vintage-ink transition-colors p-1"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-vintage-brownLight/20 mb-4">
            <div>
              <p className="text-vintage-inkLight/60 text-[11px] mb-0.5">当前最高出价</p>
              <p className="text-vintage-brick text-2xl font-bold font-display">
                {playlist.currentBid || playlist.startingPrice}
                <span className="text-sm font-normal ml-1 text-vintage-brick/60">积分</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-vintage-inkLight/60 text-[11px] mb-0.5">您的积分</p>
              <p className="text-vintage-gold text-2xl font-bold font-display flex items-center gap-1">
                <Trophy size={18} />
                {points}
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-vintage-moss/10 border border-vintage-moss/30 text-vintage-moss'
                  : message.type === 'error'
                  ? 'bg-vintage-brick/10 border border-vintage-brick/30 text-vintage-brick'
                  : 'bg-vintage-gold/10 border border-vintage-gold/30 text-vintage-gold'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={18} />
              ) : message.type === 'error' ? (
                <AlertCircle size={18} />
              ) : (
                <Zap size={18} />
              )}
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label className="text-vintage-ink text-sm font-medium mb-2 block">
              我的出价 <span className="text-vintage-inkLight/60">（至少 {minBid} 积分）</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuickBid(-playlist.minBidIncrement)}
                className="w-12 h-12 rounded-xl bg-vintage-brownLight/30 hover:bg-vintage-brownLight/50 text-vintage-ink flex items-center justify-center transition-colors"
              >
                <Minus size={18} />
              </button>
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => handleCustomBid(e.target.value)}
                  min={minBid}
                  className="w-full h-12 px-4 rounded-xl bg-vintage-paper border-2 border-vintage-gold/30 text-vintage-ink text-center text-xl font-bold font-display focus:outline-none focus:border-vintage-gold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-vintage-inkLight/50 text-sm">
                  积分
                </span>
              </div>
              <button
                onClick={() => handleQuickBid(playlist.minBidIncrement)}
                className="w-12 h-12 rounded-xl bg-vintage-brownLight/30 hover:bg-vintage-brownLight/50 text-vintage-ink flex items-center justify-center transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-vintage-inkLight/60 text-xs mb-2">快捷加价</p>
            <div className="grid grid-cols-4 gap-2">
              {quickBids.map((delta) => (
                <button
                  key={delta}
                  onClick={() => handleQuickBid(delta)}
                  className="py-2 rounded-lg bg-vintage-gold/10 hover:bg-vintage-gold/20 text-vintage-gold text-sm font-medium border border-vintage-gold/30 transition-colors"
                >
                  +{delta}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-vintage-gold/5 border border-vintage-gold/20 mb-5">
            <div className="flex items-start gap-2">
              <Crown size={16} className="text-vintage-gold mt-0.5 flex-shrink-0" />
              <div className="text-xs text-vintage-inkLight/80 leading-relaxed space-y-1">
                <p>竞拍成功即可获得该绝版歌单的<strong className="text-vintage-gold">永久独占播放权</strong></p>
                <p>您的名字将永久镌刻在磁带封面上</p>
                <p>如被他人超越，您的积分将自动退还</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-vintage-gold/40 text-vintage-gold text-sm font-bold hover:bg-vintage-gold/10 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || bidAmount < minBid || bidAmount > points}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-vintage-brick to-vintage-brick/80 text-vintage-paper text-sm font-bold flex items-center justify-center gap-1.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Gavel size={16} />
              {isSubmitting ? '出价中…' : '确认出价'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
