import { useRef, useEffect } from 'react';
import { getYears } from '@/data/songs';

interface YearSelectorProps {
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
}

export default function YearSelector({
  selectedYear,
  onSelectYear,
}: YearSelectorProps) {
  const years = getYears();
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedYear]);

  const decades = [
    { label: "80's", years: years.filter((y) => y < 1990) },
    { label: "90's", years: years.filter((y) => y >= 1990) },
  ];

  return (
    <div className="relative py-6">
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-vintage-gold/30 to-transparent" />

      <div
        ref={scrollRef}
        className="relative flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={() => onSelectYear(null)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border-2 ${
            selectedYear === null
              ? 'bg-gradient-to-br from-vintage-gold to-vintage-goldDark text-vintage-brown border-vintage-gold shadow-gold-glow scale-105'
              : 'bg-vintage-brown/30 text-vintage-paper/70 border-vintage-gold/20 hover:border-vintage-gold/50 hover:text-vintage-gold'
          }`}
        >
          全部
        </button>

        {decades.map((decade) => (
          <div key={decade.label} className="flex items-center gap-2 md:gap-3">
            <div className="flex-shrink-0 flex items-center">
              <span className="px-3 py-1.5 rounded-full bg-vintage-brick/20 text-vintage-brickLight text-xs font-bold tracking-wider border border-vintage-brick/30">
                {decade.label}
              </span>
            </div>
            {decade.years.map((year) => (
              <button
                key={year}
                ref={selectedYear === year ? selectedRef : undefined}
                onClick={() => onSelectYear(year)}
                className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full text-sm md:text-base font-display font-bold transition-all duration-300 border-2 flex items-center justify-center ${
                  selectedYear === year
                    ? 'bg-gradient-to-br from-vintage-gold to-vintage-goldDark text-vintage-brown border-vintage-gold shadow-gold-glow scale-110'
                    : 'bg-vintage-brown/40 text-vintage-paper/80 border-vintage-gold/20 hover:border-vintage-gold/60 hover:text-vintage-gold hover:scale-105'
                }`}
              >
                {year.toString().slice(2)}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
