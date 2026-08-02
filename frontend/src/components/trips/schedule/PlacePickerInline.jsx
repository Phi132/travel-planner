import { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { usePlaces } from '@/hooks/usePlaces';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { cn } from '@/lib/utils';

/**
 * Ô tìm kiếm địa điểm rút gọn để gắn vào 1 hoạt động trong lịch trình —
 * tái sử dụng API /places đã có sẵn thay vì phải chọn từ danh sách cứng.
 */
export function PlacePickerInline({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(value ?? null);
  const debouncedQuery = useDebouncedValue(query, 350);

  const { data } = usePlaces({ search: debouncedQuery || undefined, limit: 6, page: 1 });
  const results = debouncedQuery ? data?.places ?? [] : [];

  function handleSelect(place) {
    setSelectedPlace(place);
    setQuery('');
    onChange(place.id, place);
  }

  function handleClear() {
    setSelectedPlace(null);
    onChange(null, null);
  }

  if (selectedPlace) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/50 px-4 h-12">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium truncate">{selectedPlace.name}</span>
        </div>
        <button type="button" onClick={handleClear} className="text-muted-foreground hover:text-foreground shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm địa điểm để gắn vào (không bắt buộc)..."
          className={cn(
            'flex h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-[15px]',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring'
          )}
        />
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 mt-1.5 w-full rounded-2xl border border-border bg-card shadow-elevated overflow-hidden max-h-56 overflow-y-auto">
          {results.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => handleSelect(place)}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{place.name}</span>
              <span className="text-xs text-muted-foreground truncate ml-auto">{place.province?.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
