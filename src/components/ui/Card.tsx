import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' };

export function Card({ children, className, onClick, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100',
        'shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.06)]',
        hover && 'cursor-pointer hover:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.08)] hover:border-gray-200 transition-all duration-200',
        paddings[padding],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
