import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_PLACE_IMAGE } from '@/lib/imageDefaults';

const DEFAULT_CENTER = [16.0471, 108.2068]; // Đà Nẵng, Việt Nam

function isValidCoordinate(place) {
  return (
    Number.isFinite(Number(place?.latitude)) &&
    Number.isFinite(Number(place?.longitude)) &&
    Number(place.latitude) >= -90 &&
    Number(place.latitude) <= 90 &&
    Number(place.longitude) >= -180 &&
    Number(place.longitude) <= 180
  );
}

function createMarkerIcon(isSelected) {
  return L.divIcon({
    className: 'travel-planner-marker',
    html: `
      <div class="travel-planner-marker__pin ${isSelected ? 'travel-planner-marker__pin--selected' : ''}">
        <span></span>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42]
  });
}

function MapViewport({ places, selectedPlaceId }) {
  const map = useMap();

  const validPlaces = useMemo(
    () => places.filter(isValidCoordinate),
    [places]
  );

  useEffect(() => {
    if (validPlaces.length === 0) {
      map.setView(DEFAULT_CENTER, 5);
      return;
    }

    if (validPlaces.length === 1) {
      map.setView(
        [Number(validPlaces[0].latitude), Number(validPlaces[0].longitude)],
        14,
        { animate: true }
      );
      return;
    }

    const bounds = L.latLngBounds(
      validPlaces.map((place) => [Number(place.latitude), Number(place.longitude)])
    );

    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 13,
      animate: true
    });
  }, [map, validPlaces]);

  useEffect(() => {
    if (!selectedPlaceId) return;

    const selected = validPlaces.find((place) => place.id === selectedPlaceId);
    if (!selected) return;

    map.flyTo(
      [Number(selected.latitude), Number(selected.longitude)],
      Math.max(map.getZoom(), 14),
      { duration: 0.6 }
    );
  }, [map, selectedPlaceId, validPlaces]);

  return null;
}

export function PlaceMap({ places, selectedPlaceId, onSelect }) {
  const validPlaces = useMemo(
    () => places.filter(isValidCoordinate),
    [places]
  );

  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="h-[360px] sm:h-[440px] lg:h-[500px]">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={5}
          scrollWheelZoom
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewport places={validPlaces} selectedPlaceId={selectedPlaceId} />

          {validPlaces.map((place) => {
            const isSelected = place.id === selectedPlaceId;

            return (
              <Marker
                key={place.id}
                position={[Number(place.latitude), Number(place.longitude)]}
                icon={createMarkerIcon(isSelected)}
                eventHandlers={{
                  click: () => onSelect?.(place)
                }}
              >
                <Popup className="travel-planner-popup">
                  <div className="min-w-[190px] max-w-[240px]">
                    {place.coverImageUrl && (
                      <img
                        src={place.coverImageUrl || DEFAULT_PLACE_IMAGE}
                        alt={place.name}
                        className="mb-2 h-24 w-full rounded-xl object-cover"
                        onError={(e) => {
                          if (e.currentTarget.src !== DEFAULT_PLACE_IMAGE) e.currentTarget.src = DEFAULT_PLACE_IMAGE;
                        }}
                      />
                    )}

                    <p className="font-bold text-sm leading-tight">{place.name}</p>

                    <div className="mt-1 flex items-start gap-1 text-xs text-gray-500">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{place.address}</span>
                    </div>

                    <Link
                      to={`/places/${place.id}`}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {validPlaces.length === 0 && (
        <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          Chưa có địa điểm có tọa độ hợp lệ để hiển thị trên bản đồ.
        </div>
      )}
    </div>
  );
}
