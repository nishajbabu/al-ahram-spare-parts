import { useEffect, useState } from 'react';
import { Cog } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({ src, alt, className = '', fallbackLabel }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#141418] via-[#0E0E12] to-[#1A1A20] border border-white/10 text-[#9CA3AF] p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Cog className="w-8 h-8 text-[#DC2626]/70 mb-3 stroke-[1.5]" />
        <span className="text-xs font-mono tracking-wider text-center text-[#D4D7DD]/80">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
