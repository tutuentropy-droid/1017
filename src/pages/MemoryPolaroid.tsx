import { Camera } from 'lucide-react';
import PolaroidCreator from '@/components/PolaroidCreator';

export default function MemoryPolaroid() {
  return (
    <div className="min-h-screen bg-vintage-brownDark">
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-vintage-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-vintage-brick/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vintage-gold/15 border border-vintage-gold/30 mb-6">
              <Camera size={16} className="text-vintage-gold" />
              <span className="text-vintage-gold/90 text-sm">
                合成你的音乐记忆
              </span>
            </div>
            <h1 className="vintage-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              音乐记忆拍立得
            </h1>
            <p className="text-vintage-paper/70 text-lg font-serif leading-relaxed">
              把收藏的歌曲、记忆标签、好友祝福拖入相框，合成一张专属于你的时光照片。
              <br />
              让那些动人的旋律和温暖的瞬间，永远定格在此刻。
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container">
          <PolaroidCreator />
        </div>
      </section>
    </div>
  );
}
