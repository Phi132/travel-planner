import { useState } from 'react';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlaceCard } from '@/components/places/PlaceCard';
import { PlaceMap } from '@/components/places/PlaceMap';
import { PlaceFilters } from '@/components/places/PlaceFilters';
import { PlaceCardSkeleton } from '@/components/skeletons/PlaceCardSkeleton';
import { usePlaces, useProvinces, useCategories } from '@/hooks/usePlaces';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { cn } from '@/lib/utils';

const PAGE_LIMIT = 12;

export default function PlacesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [provinceSlug, setProvinceSlug] = useState(undefined);
  const [categorySlug, setCategorySlug] = useState(undefined);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const search = useDebouncedValue(searchInput, 400);

  const { data: provinces = [] } = useProvinces();
  const { data: categories = [] } = useCategories();

  const { data, isLoading, isFetching } = usePlaces({
    page,
    limit: PAGE_LIMIT,
    search: search || undefined,
    provinceSlug,
    categorySlug
  });

  const places = data?.places ?? [];
  const meta = data?.meta;
  const hasFilter = !!(search || provinceSlug || categorySlug);

  // Khi đổi bộ lọc/trang, không giữ marker đã chọn nếu marker đó không còn trong danh sách.
  const selectedPlace = places.find((place) => place.id === selectedPlaceId);

  function resetPage() {
    setPage(1);
    setSelectedPlaceId(null);
  }

  return (
    <div>
      <PageHeader title="Khám phá" description="Tìm địa điểm du lịch, quán ăn, cafe nổi bật khắp Việt Nam." />

      <PlaceFilters
        searchInput={searchInput}
        onSearchChange={(v) => {
          setSearchInput(v);
          resetPage();
        }}
        provinces={provinces}
        provinceSlug={provinceSlug}
        onProvinceChange={(v) => {
          setProvinceSlug(v);
          resetPage();
        }}
        categories={categories}
        categorySlug={categorySlug}
        onCategoryChange={(v) => {
          setCategorySlug(v);
          resetPage();
        }}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
      ) : places.length === 0 ? (
        <Card>
          <EmptyState
            icon={Compass}
            title={hasFilter ? 'Không tìm thấy địa điểm phù hợp' : 'Chưa có địa điểm nào'}
            description={
              hasFilter
                ? 'Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc.'
                : 'Dữ liệu địa điểm sẽ sớm được cập nhật thêm.'
            }
          />
        </Card>
      ) : (
        <>
          <PlaceMap
            places={places}
            selectedPlaceId={selectedPlace?.id}
            onSelect={(place) => setSelectedPlaceId(place.id)}
          />

          <div className={cn('grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity', isFetching && 'opacity-60')}>
            <AnimatePresence mode="popLayout">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </AnimatePresence>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { setSelectedPlaceId(null); setPage((p) => p - 1); }}>
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <span className="text-sm text-muted-foreground font-medium">
                Trang {meta.page} / {meta.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => { setSelectedPlaceId(null); setPage((p) => p + 1); }}>
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
