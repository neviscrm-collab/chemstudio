import { cn } from '../../lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md';
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
};

const sizes = {
  xs: 'text-xs px-2 py-1 rounded-md gap-1',
  sm: 'text-[13px] px-2.5 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-3.5 py-2 rounded-lg gap-2',
};

export function Button({ variant = 'secondary', size = 'sm', icon, iconRight, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
