import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rect',
  count = 1,
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full aspect-square';
      case 'text':
        return 'h-4 rounded-md w-full';
      case 'rect':
      default:
        return 'rounded-xl h-24 w-full';
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`relative overflow-hidden bg-white/[0.04] border border-white/[0.05] animate-pulse ${getVariantClass()} ${className}`}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      ))}
    </>
  );
};
