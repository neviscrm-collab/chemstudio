export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelative(dateStr: string): string {
  const now = new Date('2026-07-06T00:00:00Z');
  const d = new Date(dateStr);
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: '#059669',
    draft: '#9ca3af',
    in_review: '#d97706',
    approved: '#059669',
    rejected: '#e11d48',
    published: '#2563eb',
    paused: '#6b7280',
    completed: '#2563eb',
    lead: '#2563eb',
    promising: '#d97706',
    inactive: '#e11d48',
    failed: '#e11d48',
    pending: '#d97706',
    granted: '#059669',
    filed: '#0891b2',
    provisional: '#9ca3af',
  };
  return map[status] ?? '#9ca3af';
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function phaseLabel(phase: string): string {
  const map: Record<string, string> = {
    discovery: 'Discovery',
    lead_optimization: 'Lead Opt.',
    preclinical: 'Preclinical',
    clinical: 'Clinical',
    approved: 'Approved',
  };
  return map[phase] ?? phase;
}
