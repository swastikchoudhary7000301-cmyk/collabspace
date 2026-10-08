import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-stone-200/70 shadow-2xs my-4">
      <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-stone-900 tracking-tight">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 mt-6">
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="secondary" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-3 p-4 bg-white rounded-xl border border-stone-200/70">
      <div className="h-5 w-48 bg-stone-100 rounded animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2 border-b border-stone-100 last:border-0">
          <div className="w-6 h-6 rounded-full bg-stone-100 animate-pulse shrink-0" />
          <div className="h-4 bg-stone-100 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-stone-100 rounded animate-pulse w-1/6 ml-auto" />
          <div className="h-4 bg-stone-100 rounded animate-pulse w-20" />
        </div>
      ))}
    </div>
  );
};
