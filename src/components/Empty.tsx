import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

interface EmptyProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function Empty({
  icon: Icon = Sparkles,
  title = '暂无内容',
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 md:py-20 ${className}`}
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 flex items-center justify-center mb-5">
        <Icon size={36} className="text-vintage-gold/50" />
      </div>
      <h3 className="font-display text-vintage-paper/70 text-xl md:text-2xl font-semibold mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-vintage-paper/40 text-sm md:text-base font-serif max-w-md text-center mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="vintage-btn-gold text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
