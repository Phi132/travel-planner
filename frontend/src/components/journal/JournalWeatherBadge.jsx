import { Sun, Cloud, CloudRain, CloudLightning, Wind, Thermometer, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';

export const JOURNAL_WEATHER_LABELS = {
  SUNNY: 'Nắng',
  CLOUDY: 'Nhiều mây',
  RAINY: 'Mưa',
  STORMY: 'Bão',
  COOL: 'Mát mẻ',
  HOT: 'Nóng',
  SNOWY: 'Tuyết'
};

const WEATHER_ICONS = {
  SUNNY: Sun,
  CLOUDY: Cloud,
  RAINY: CloudRain,
  STORMY: CloudLightning,
  COOL: Wind,
  HOT: Thermometer,
  SNOWY: Snowflake
};

export function JournalWeatherIcon({ weather, className }) {
  const Icon = WEATHER_ICONS[weather];
  if (!Icon) return null;
  return <Icon className={cn('h-4 w-4', className)} />;
}

export function JournalWeatherBadge({ weather, className }) {
  const Icon = WEATHER_ICONS[weather];
  if (!weather || !Icon) return null;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80', className)}>
      <Icon className="h-3.5 w-3.5" />
      {JOURNAL_WEATHER_LABELS[weather]}
    </span>
  );
}
