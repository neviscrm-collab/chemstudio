import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, color = '#2563eb', size = 'sm', showLabel, className }: ProgressBarProps) {
  const pct = Math.round((value / max) * 100);
  const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2' };
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-gray-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {showLabel && <span className="text-[11px] text-gray-500 tabular-nums w-7 text-right">{pct}%</span>}
    </div>
  );
}
