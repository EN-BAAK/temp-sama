"use client";

import React, { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents, } from "react-leaflet";
import { LeafletMapProps, MapClickHandlerProps, MapControllerProps } from "@/types/components";

const defaultMarkerIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapController: React.FC<MapControllerProps> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.panTo([position.lat, position.lng]);
  }, [map, position.lat, position.lng]);

  return null;
};

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  disabled,
  onChange,
}) => {
  useMapEvents({
    click(event) {
      if (disabled) return;

      onChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  position,
  zoom,
  disabled = false,
  onChange,
}) => {
  const markerEventHandlers = useMemo(
    () => ({
      dragend(event: L.LeafletEvent) {
        const marker = event.target as L.Marker;
        const markerPosition = marker.getLatLng();

        onChange(markerPosition.lat, markerPosition.lng);
      },
    }),
    [onChange]
  );

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={zoom}
      scrollWheelZoom
      className="h-80 w-full z-40"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={
          process.env.NEXT_PUBLIC_OSM_TILE_URL ??
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />

      <MapController position={position} />

      <MapClickHandler
        disabled={disabled}
        onChange={onChange}
      />

      <Marker
        position={[position.lat, position.lng]}
        icon={defaultMarkerIcon}
        draggable={!disabled}
        eventHandlers={markerEventHandlers}
      />
    </MapContainer>
  );
};

export default LeafletMap;