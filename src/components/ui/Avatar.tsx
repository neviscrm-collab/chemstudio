import { cn } from '../../lib/utils';
import type { User } from '../../types';

interface AvatarProps {
  user: User;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showOnline?: boolean;
  className?: string;
}

const sizes = { xs: 20, sm: 24, md: 32, lg: 40 };
const textSizes = { xs: '8px', sm: '9px', md: '11px', lg: '14px' };

export function Avatar({ user, size = 'sm', showOnline, className }: AvatarProps) {
  const px = sizes[size];
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className="rounded-full flex items-center justify-center font-semibold select-none"
        style={{ width: px, height: px, background: user.color + '20', color: user.color, fontSize: textSizes[size] }}
        title={user.name}
      >
        {user.initials}
      </div>
      {showOnline && user.isOnline && (
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
      )}
    </div>
  );
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: { users: User[]; max?: number; size?: AvatarProps['size'] }) {
  const shown = users.slice(0, max);
  const extra = users.length - max;
  const px = sizes[size ?? 'sm'];
  return (
    <div className="flex items-center">
      {shown.map((u, i) => (
        <div key={u.id} className="rounded-full ring-2 ring-white" style={{ marginLeft: i === 0 ? 0 : -6 }}>
          <Avatar user={u} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div
          className="rounded-full ring-2 ring-white flex items-center justify-center bg-gray-100 text-gray-500 font-medium"
          style={{ width: px, height: px, fontSize: 9, marginLeft: -6 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
