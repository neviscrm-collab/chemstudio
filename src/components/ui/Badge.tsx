import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'xs' | 'sm';
  className?: string;
}

export function Badge({ children, color = '#9ca3af', variant = 'soft', size = 'sm', className }: BadgeProps) {
  const base = cn(
    'inline-flex items-center font-medium rounded-full',
    size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
  );

  if (variant === 'soft') {
    return (
      <span className={cn(base, className)} style={{ background: color + '18', color }}>
        {children}
      </span>
    );
  }
  if (variant === 'solid') {
    return (
      <span className={cn(base, className)} style={{ background: color, color: '#fff' }}>
        {children}
      </span>
    );
  }
  return (
    <span className={cn(base, className)} style={{ border: `1px solid ${color}50`, color }}>
      {children}
    </span>
  );
}
