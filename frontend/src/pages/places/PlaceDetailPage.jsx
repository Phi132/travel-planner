import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Ticket, ExternalLink, ImageOff, Heart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePlace } from '@/hooks/usePlaces';
import { useSetFavorite, useRemoveFavorite } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import { DEFAULT_PLACE_IMAGE } from '@/lib/imageDefaults';

function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-[16/9] rounded-3xl bg-muted" />
      <div className="h-7 w-2/3 rounded-full bg-muted" />
      <div className="h-4 w-1/3 rounded-full bg-muted" />
      <div className="h-24 rounded-3xl bg-muted" />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/places"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Quay lại Khám phá
    </Link>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { data: place, isLoading, isError } = usePlace(id);
  const [activeImage, setActiveImage] = useState(0);
  const setFavoriteMutation = useSetFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  const isFavoriteBusy = setFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  function toggleFavorite() {
    if (!place) return;
    if (place.favoriteStatus) {
      removeFavoriteMutation.mutate(place.id);
    } else {
      setFavoriteMutation.mutate({ placeId: place.id, status: 'WANT_TO_GO' });
    }
  }

  if (isLoading) {
    return (
      <div>
        <BackLink />
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div>
        <BackLink />
        <Card className="p-10 text-center">
          <ImageOff className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Không tìm thấy địa điểm này, có thể đã bị xoá.</p>
        </Card>
      </div>
    );
  }

  const gallery = [place.coverImageUrl, ...(place.images ?? [])].filter(Boolean);
  const displayGallery = gallery.length > 0 ? gallery : [DEFAULT_PLACE_IMAGE];

  return (
    <div>
      <BackLink />

      <div className="rounded-3xl overflow-hidden bg-muted aspect-[16/9] mb-3 relative">
        {displayGallery.length > 0 ? (
          <img
            src={displayGallery[activeImage] || DEFAULT_PLACE_IMAGE}
            alt={place.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_PLACE_IMAGE) e.currentTarget.src = DEFAULT_PLACE_IMAGE;
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        {place.isFeatured && (
          <span className="absolute top-4 right-4 rounded-full bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 shadow-soft">
            Địa điểm nổi bật
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          {gallery.map((url, index) => (
            <button
              key={url + index}
              onClick={() => setActiveImage(index)}
              className={cn(
                'shrink-0 h-16 w-20 rounded-xl overflow-hidden border-2 transition-colors',
                activeImage === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mb-2 flex items-center gap-2 flex-wrap">
        {place.category && (
          <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">{place.category.name}</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold tracking-tight">{place.name}</h1>
        <button
          onClick={toggleFavorite}
          disabled={isFavoriteBusy}
          aria-label={place.favoriteStatus ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
          className={cn(
            'h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center border transition-colors disabled:opacity-60',
            place.favoriteStatus
              ? 'bg-destructive/10 border-destructive/20 text-destructive'
              : 'bg-card border-border text-muted-foreground hover:text-destructive hover:border-destructive/30'
          )}
        >
          <Heart className={cn('h-5 w-5', place.favoriteStatus && 'fill-current')} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Star className={cn('h-4.5 w-4.5', place.ratingCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
          <span className="font-semibold text-sm">
            {place.ratingCount > 0 ? `${place.ratingAvg.toFixed(1)} (${place.ratingCount} đánh giá)` : 'Chưa có đánh giá'}
          </span>
        </div>
      </div>

      <Card className="p-5 mb-4 space-y-4">
        <InfoRow icon={MapPin} label="Địa chỉ" value={place.address} />
        {place.openHours && <InfoRow icon={Clock} label="Giờ mở cửa" value={place.openHours} />}
        {place.ticketPrice && <InfoRow icon={Ticket} label="Giá vé" value={place.ticketPrice} />}
      </Card>

      {place.description && (
        <Card className="p-5 mb-4">
          <h2 className="font-bold mb-2">Giới thiệu</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{place.description}</p>
        </Card>
      )}

      <div className="flex gap-3 sticky bottom-20 lg:bottom-6">
        {place.googleMapsUrl && (
          <a href={place.googleMapsUrl} target="_blank" rel="noreferrer" className="flex-1">
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4" />
              Xem trên Google Maps
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
