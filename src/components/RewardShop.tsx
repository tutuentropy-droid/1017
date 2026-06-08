import { useState } from 'react';
import {
  X,
  Trophy,
  ShoppingCart,
  Check,
  Lock,
  Sparkles,
  Disc,
  Award,
  Sticker,
} from 'lucide-react';
import type { Reward, RewardType } from '@/types';
import { rewards } from '@/data/guessSongs';
import { useGuessStore } from '@/store/guessStore';

interface Props {
  onClose: () => void;
}

const typeIcons: Record<RewardType, typeof Disc> = {
  'tape-cover': Disc,
  badge: Award,
  sticker: Sticker,
};

const typeLabels: Record<RewardType, string> = {
  'tape-cover': '磁带封面',
  badge: '限定徽章',
  sticker: '怀旧贴纸',
};

const rarityStyles = {
  common: {
    badge: 'bg-vintage-inkLight/20 text-vintage-inkLight',
    border: 'border-vintage-gold/20',
    glow: '',
  },
  rare: {
    badge: 'bg-vintage-gold/20 text-vintage-gold',
    border: 'border-vintage-gold/50',
    glow: 'shadow-gold-glow',
  },
  legendary: {
    badge: 'bg-vintage-brick/20 text-vintage-brick',
    border: 'border-vintage-brick/50',
    glow: 'shadow-[0_0_20px_rgba(183,65,14,0.25)]',
  },
};

const rarityLabels = {
  common: '普通',
  rare: '稀有',
  legendary: '传说',
};

export default function RewardShop({ onClose }: Props) {
  const { points, redeemReward, hasReward, getObtainedRewards } = useGuessStore();
  const [activeTab, setActiveTab] = useState<'shop' | 'owned'>('shop');
  const [redeemMessage, setRedeemMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleRedeem = (reward: Reward) => {
    if (hasReward(reward.id)) {
      setRedeemMessage({ type: 'error', text: '您已拥有此奖励' });
      setTimeout(() => setRedeemMessage(null), 2500);
      return;
    }
    if (points < reward.cost) {
      setRedeemMessage({ type: 'error', text: '积分不足，继续答题获取更多积分吧！' });
      setTimeout(() => setRedeemMessage(null), 2500);
      return;
    }
    const success = redeemReward(reward.id);
    if (success) {
      setRedeemMessage({ type: 'success', text: `成功兑换「${reward.name}」！` });
      setTimeout(() => setRedeemMessage(null), 2500);
    }
  };

  const ownedRewards = getObtainedRewards();
  const displayRewards = activeTab === 'shop' ? rewards : ownedRewards;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="vintage-card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-popup-bounce-in">
        <div className="flex items-center justify-between p-5 border-b border-vintage-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vintage-brick/15 flex items-center justify-center">
              <Trophy size={22} className="text-vintage-brick" />
            </div>
            <div>
              <h2 className="vintage-heading text-xl text-vintage-ink">积分兑换商店</h2>
              <p className="text-vintage-inkLight text-xs">当前积分：{points}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-vintage-inkLight/50 hover:text-vintage-ink transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        <div className="border-b border-vintage-gold/20 flex">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'shop'
                ? 'text-vintage-gold border-b-2 border-vintage-gold bg-vintage-gold/5'
                : 'text-vintage-inkLight/70 hover:text-vintage-ink'
            }`}
          >
            <ShoppingCart size={14} className="inline mr-1.5" />
            兑换商店
          </button>
          <button
            onClick={() => setActiveTab('owned')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'owned'
                ? 'text-vintage-gold border-b-2 border-vintage-gold bg-vintage-gold/5'
                : 'text-vintage-inkLight/70 hover:text-vintage-ink'
            }`}
          >
            <Check size={14} className="inline mr-1.5" />
            我的收藏 ({ownedRewards.length})
          </button>
        </div>

        {redeemMessage && (
          <div
            className={`mx-5 mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              redeemMessage.type === 'success'
                ? 'bg-vintage-moss/10 border border-vintage-moss/30 text-vintage-moss'
                : 'bg-vintage-brick/10 border border-vintage-brick/30 text-vintage-brick'
            }`}
          >
            {redeemMessage.type === 'success' ? (
              <Check size={18} />
            ) : (
              <Lock size={18} />
            )}
            {redeemMessage.text}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'owned' && ownedRewards.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles size={48} className="mx-auto text-vintage-gold/30 mb-4" />
              <p className="text-vintage-inkLight font-serif mb-2">还没有兑换任何奖励</p>
              <p className="text-vintage-inkLight/60 text-xs font-serif">
                快去答题赚积分，兑换心仪的怀旧纪念品吧！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayRewards.map((reward) => {
                const owned = hasReward(reward.id);
                const canAfford = points >= reward.cost;
                const Icon = typeIcons[reward.type];
                const style = rarityStyles[reward.rarity];

                return (
                  <div
                    key={reward.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      style.border
                    } ${style.glow} bg-vintage-paperLight/50`}
                  >
                    <div className="aspect-[4/3] bg-vintage-brownLight/30 relative overflow-hidden">
                      <img
                        src={reward.imageUrl}
                        alt={reward.name}
                        className="w-full h-full object-cover"
                      />
                      {reward.isLimited && (
                        <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-vintage-brick text-vintage-paper text-[10px] font-bold flex items-center gap-1">
                          <Sparkles size={10} />
                          限量
                        </span>
                      )}
                      {owned && (
                        <div className="absolute inset-0 bg-vintage-moss/70 flex items-center justify-center">
                          <div className="text-center text-vintage-paper">
                            <Check size={36} className="mx-auto mb-1" />
                            <p className="text-sm font-bold">已获得</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={14} className="text-vintage-gold" />
                        <span className="text-[10px] text-vintage-inkLight/70">
                          {typeLabels[reward.type]}
                        </span>
                        <span
                          className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium ${style.badge}`}
                        >
                          {rarityLabels[reward.rarity]}
                        </span>
                      </div>
                      <h3 className="font-bold text-vintage-ink text-sm mb-1">
                        {reward.name}
                      </h3>
                      <p className="text-vintage-inkLight/70 text-xs mb-3 line-clamp-2">
                        {reward.description}
                      </p>
                      {activeTab === 'shop' && (
                        <button
                          onClick={() => handleRedeem(reward)}
                          disabled={owned || !canAfford}
                          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                            owned
                              ? 'bg-vintage-moss/20 text-vintage-moss cursor-default'
                              : canAfford
                              ? 'bg-vintage-gold text-vintage-brown hover:bg-vintage-goldLight'
                              : 'bg-vintage-inkLight/10 text-vintage-inkLight/50 cursor-not-allowed'
                          }`}
                        >
                          {owned ? (
                            <>
                              <Check size={14} />
                              已拥有
                            </>
                          ) : (
                            <>
                              <Trophy size={14} />
                              {reward.cost} 积分兑换
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
