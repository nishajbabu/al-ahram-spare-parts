import { ShoppingBag } from 'lucide-react';

export type ActivePage = 'home' | 'part' | 'wholesale' | 'showroom';

interface NavbarProps {
  bagCount: number;
  activePage: ActivePage;
  onNavigateHome: () => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigatePage: (page: 'wholesale' | 'showroom') => void;
  onOpenBag: () => void;
}

export function Navbar({
  bagCount,
  activePage,
  onNavigateHome,
  onNavigateSection,
  onNavigatePage,
  onOpenBag,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0D]/90 backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-left font-display text-base sm:text-lg font-semibold tracking-tight text-[#F4F5F7] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Al Ahram Auto Parts
        </button>

        {/* Zone 2: 4 Clean Single-Line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9CA3AF]">
          <button
            type="button"
            onClick={() => onNavigateSection('chassis-explorer')}
            className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Chassis
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('catalog')}
            className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Catalog
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage('wholesale')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b ${
              activePage === 'wholesale'
                ? 'text-[#F4F5F7] border-[#DC2626]'
                : 'border-transparent hover:text-[#F4F5F7]'
            }`}
          >
            Wholesale
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage('showroom')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b ${
              activePage === 'showroom'
                ? 'text-[#F4F5F7] border-[#DC2626]'
                : 'border-transparent hover:text-[#F4F5F7]'
            }`}
          >
            Showroom
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-medium tracking-wide text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC2626]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quote Bag</span>
            {bagCount > 0 && (
              <span className="font-mono tabular-nums text-[11px] bg-black/30 px-1.5 py-0.5 rounded-sm">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar (ensures full Chassis/Catalog/Wholesale/Showroom parity on phones) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden border-t border-white/10 bg-[#0B0B0D]/95 px-4 py-2 flex items-center justify-between gap-3 text-xs font-medium text-[#9CA3AF] overflow-x-auto"
      >
        <button
          type="button"
          onClick={() => onNavigateSection('chassis-explorer')}
          className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
        >
          Chassis
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection('catalog')}
          className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
        >
          Catalog
        </button>
        <button
          type="button"
          onClick={() => onNavigatePage('wholesale')}
          className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer border-b ${
            activePage === 'wholesale'
              ? 'text-[#F4F5F7] border-[#DC2626]'
              : 'border-transparent hover:text-[#F4F5F7]'
          }`}
        >
          Wholesale
        </button>
        <button
          type="button"
          onClick={() => onNavigatePage('showroom')}
          className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer border-b ${
            activePage === 'showroom'
              ? 'text-[#F4F5F7] border-[#DC2626]'
              : 'border-transparent hover:text-[#F4F5F7]'
          }`}
        >
          Showroom
        </button>
      </nav>
    </header>
  );
}
