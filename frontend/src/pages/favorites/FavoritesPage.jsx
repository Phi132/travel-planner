import { useState } from 'react';
import { Heart, Compass } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAVORITE_STATUS_LABELS } from '@/components/favorites/FavoriteStatusBadge';
import { FavoritePlaceCard } from '@/components/favorites/FavoritePlaceCard';
import { useFavorites, useSetFavorite, useRemoveFavorite } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

const STATUS_TABS = [{ value: undefined, label: 'Tất cả' }, ...Object.entries(FAVORITE_STATUS_LABELS).map(([value, label]) => ({ value, label }))];
const PAGE_LIMIT = 20;

export default function FavoritesPage() {
  const [status, setStatus] = useState(undefined);
  const { data, isLoading, isFetching } = useFavorites({ status, page: 1, limit: PAGE_LIMIT });
  const setFavoriteMutation = useSetFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const favorites = data?.favorites ?? [];
  const isUpdating = setFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  function handleStatusChange(placeId, newStatus) {
    setFavoriteMutation.mutate({ placeId, status: newStatus });
  }

  function handleRemove(placeId) {
    removeFavoriteMutation.mutate(placeId);
  }

  return (
    <div>
      <PageHeader title="Yêu thích" description="Những địa điểm bạn muốn đi hoặc đã ghé thăm." />

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatus(tab.value)}
            className={cn(
              'shrink-0 rounded-2xl px-4 h-11 text-sm font-semibold transition-colors',
              status === tab.value ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-muted'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 sm:h-32 rounded-3xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <Card>
          <EmptyState
            icon={Heart}
            title={status ? 'Chưa có địa điểm nào ở mục này' : 'Chưa có địa điểm yêu thích'}
            description="Khám phá và lưu lại những địa điểm bạn muốn ghé thăm."
            action={
              <Link to="/places">
                <Button>
                  <Compass className="h-4 w-4" />
                  Khám phá địa điểm
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity', isFetching && 'opacity-60')}>
          <AnimatePresence mode="popLayout">
            {favorites.map((favorite) => (
              <FavoritePlaceCard
                key={favorite.placeId}
                favorite={favorite}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
                isUpdating={isUpdating}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
