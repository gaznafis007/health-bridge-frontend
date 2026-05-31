"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import type { LatLng } from "@/lib/ambulance/ambulance.types";

import "leaflet/dist/leaflet.css";

interface AmbulanceMapInnerProps {
  pickupLatLng: LatLng;
  destinationLatLng?: LatLng | null;
  ambulanceLatLng?: LatLng | null;
}

const pickupIcon = createIcon("#0ea5e9");
const destinationIcon = createIcon("#ef4444");
const ambulanceIcon = createIcon("#22c55e");

export default function AmbulanceMapInner({
  pickupLatLng,
  destinationLatLng,
  ambulanceLatLng,
}: AmbulanceMapInnerProps) {
  const center: [number, number] = [
    pickupLatLng.lat,
    pickupLatLng.lng,
  ];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
      aria-label="Ambulance tracking map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds
        pickupLatLng={pickupLatLng}
        destinationLatLng={destinationLatLng}
        ambulanceLatLng={ambulanceLatLng}
      />
      <Marker position={[pickupLatLng.lat, pickupLatLng.lng]} icon={pickupIcon}>
        <Popup>Pickup location</Popup>
      </Marker>
      {destinationLatLng ? (
        <Marker
          position={[destinationLatLng.lat, destinationLatLng.lng]}
          icon={destinationIcon}
        >
          <Popup>Destination</Popup>
        </Marker>
      ) : null}
      {ambulanceLatLng ? (
        <Marker
          position={[ambulanceLatLng.lat, ambulanceLatLng.lng]}
          icon={ambulanceIcon}
        >
          <Popup>Ambulance</Popup>
        </Marker>
      ) : null}
    </MapContainer>
  );
}

function FitBounds({
  pickupLatLng,
  destinationLatLng,
  ambulanceLatLng,
}: {
  pickupLatLng: LatLng;
  destinationLatLng?: LatLng | null;
  ambulanceLatLng?: LatLng | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [
      [pickupLatLng.lat, pickupLatLng.lng],
    ];

    if (destinationLatLng) {
      points.push([destinationLatLng.lat, destinationLatLng.lng]);
    }

    if (ambulanceLatLng) {
      points.push([ambulanceLatLng.lat, ambulanceLatLng.lng]);
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
  }, [ambulanceLatLng, destinationLatLng, map, pickupLatLng]);

  return null;
}

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color}55;"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}
