import { Disc3, Heart, Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-vintage-gold/20 bg-vintage-brownDark/80 mt-16">
      <div className="container py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Disc3 size={32} className="text-vintage-gold" />
              <div>
                <h3 className="vintage-heading text-2xl leading-none">岁月如歌</h3>
                <p className="text-vintage-paper/60 text-xs mt-0.5 tracking-widest">
                  8090 MUSIC MEMORY
                </p>
              </div>
            </div>
            <p className="text-vintage-paper/60 text-sm leading-relaxed font-serif">
              用音乐唤醒岁月，用故事珍藏回忆。<br />
              致我们终将怀念的八十年代、九十年代。
            </p>
          </div>

          <div>
            <h4 className="font-display text-vintage-gold text-lg font-semibold mb-4 flex items-center gap-2">
              <Music size={18} />
              <span>经典岁月</span>
            </h4>
            <ul className="space-y-2 text-vintage-paper/60 text-sm font-serif">
              <li className="hover:text-vintage-gold transition-colors cursor-pointer">
                · 1980年代金曲
              </li>
              <li className="hover:text-vintage-gold transition-colors cursor-pointer">
                · 1990年代经典
              </li>
              <li className="hover:text-vintage-gold transition-colors cursor-pointer">
                · 华语乐坛黄金年代
              </li>
              <li className="hover:text-vintage-gold transition-colors cursor-pointer">
                · 影视原声带回忆
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-vintage-gold text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart size={18} />
              <span>关于</span>
            </h4>
            <p className="text-vintage-paper/60 text-sm leading-relaxed font-serif">
              这是一个献给80后、90后的音乐记忆社区。在这里，每一首歌都是一把钥匙，打开尘封的往事；每一个故事都是一封情书，写给过去的自己。
            </p>
          </div>
        </div>

        <div className="vintage-divider my-8" />

        <div className="text-center text-vintage-paper/40 text-xs font-serif">
          <p>© 岁月如歌 · 用音乐留住时光</p>
          <p className="mt-1 italic">
            "流水它带走光阴的故事，改变了我们"
          </p>
        </div>
      </div>
    </footer>
  );
}
