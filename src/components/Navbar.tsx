import { Link, NavLink } from 'react-router-dom';
import { Disc3, Calendar, Heart, BookOpen, Sparkles, Camera, Gamepad2 } from 'lucide-react';

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
      isActive
        ? 'text-vintage-gold bg-vintage-gold/10 border border-vintage-gold/30'
        : 'text-vintage-paper/80 hover:text-vintage-gold hover:bg-vintage-brownLight/30'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-vintage-brownDark/95 backdrop-blur-md border-b border-vintage-gold/20">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Disc3
                size={36}
                className="text-vintage-gold group-hover:animate-spin-slow"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="vintage-heading text-xl md:text-2xl leading-none">
                岁月如歌
              </h1>
              <p className="text-vintage-paper/60 text-xs mt-0.5 tracking-widest">
                8090 MUSIC MEMORY
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <NavLink to="/" end className={linkClass}>
              <Sparkles size={18} />
              <span className="hidden md:inline">首页</span>
            </NavLink>
            <NavLink to="/timeline" className={linkClass}>
              <Calendar size={18} />
              <span className="hidden md:inline">年代索引</span>
            </NavLink>
            <NavLink to="/collection" className={linkClass}>
              <Heart size={18} />
              <span className="hidden md:inline">我的收藏</span>
            </NavLink>
            <NavLink to="/memory-wall" className={linkClass}>
              <BookOpen size={18} />
              <span className="hidden md:inline">记忆墙</span>
            </NavLink>
            <NavLink to="/guess-song" className={linkClass}>
              <Gamepad2 size={18} />
              <span className="hidden md:inline">猜歌</span>
            </NavLink>
            <NavLink to="/polaroid" className={linkClass}>
              <Camera size={18} />
              <span className="hidden md:inline">拍立得</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
