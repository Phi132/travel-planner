import { cn } from '@/lib/utils';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export function Avatar({ src, name, size = 'md', className }) {
  const sizes = { sm: 'h-9 w-9 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-20 w-20 text-xl', xl: 'h-28 w-28 text-3xl' };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover shrink-0 ring-2 ring-background', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shrink-0 ring-2 ring-background',
        sizes[size],
        className
      )}
    >
      {getInitials(name) || '?'}
    </div>
  );
}
