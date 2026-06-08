import { useState } from 'react';
import { Music, Gamepad2, Sparkles } from 'lucide-react';
import GuessSongChallenge from '@/components/GuessSongChallenge';
import RewardShop from '@/components/RewardShop';
import CreateQuestionModal from '@/components/CreateQuestionModal';

export default function GuessSong() {
  const [showShop, setShowShop] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-vintage-brownDark relative">
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-vintage-brick/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/30 mb-6">
              <Gamepad2 size={16} className="text-vintage-gold" />
              <span className="text-vintage-gold/90 text-sm">怀旧小游戏</span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-5xl mb-4">
              歌词猜歌挑战
            </h1>
            <p className="text-vintage-paper/70 font-serif text-lg max-w-xl mx-auto">
              每周三句经典老歌歌词，猜对赢积分，兑换怀旧磁带封面与限定徽章！
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-vintage-paper/60">
                <Sparkles size={16} className="text-vintage-gold" />
                答错可看提示
              </div>
              <div className="flex items-center gap-2 text-vintage-paper/60">
                <Music size={16} className="text-vintage-gold" />
                支持网友出题
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <GuessSongChallenge
            onOpenShop={() => setShowShop(true)}
            onOpenCreate={() => setShowCreate(true)}
          />
        </div>
      </section>

      {showShop && <RewardShop onClose={() => setShowShop(false)} />}
      {showCreate && (
        <CreateQuestionModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
