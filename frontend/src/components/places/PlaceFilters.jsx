import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

export function PlaceFilters({
  searchInput,
  onSearchChange,
  provinces,
  provinceSlug,
  onProvinceChange,
  categories,
  categorySlug,
  onCategoryChange
}) {
  return (
    <div className="space-y-3 mb-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm địa điểm, quán ăn, cafe..."
            className="pl-11"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="relative sm:w-64">
          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
          <Select className="pl-11" value={provinceSlug ?? ''} onChange={(e) => onProvinceChange(e.target.value || undefined)}>
            <option value="">Tất cả tỉnh/thành</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onCategoryChange(undefined)}
          className={cn(
            'shrink-0 rounded-2xl px-4 h-10 text-sm font-semibold transition-colors',
            !categorySlug ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-muted'
          )}
        >
          Tất cả
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onCategoryChange(c.slug)}
            className={cn(
              'shrink-0 rounded-2xl px-4 h-10 text-sm font-semibold transition-colors',
              categorySlug === c.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted'
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
