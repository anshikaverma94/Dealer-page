"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { Dealer } from "@/lib/dealers";
import "leaflet/dist/leaflet.css";

const INDIA_CENTER: [number, number] = [22.9734, 78.6569];

function pinIcon(L: typeof import("leaflet"), color: string) {
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="6" fill="#fff"/>
    </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
}

export default function DealerMap({
  dealers,
  selectedId,
  userLocation,
  onSelectDealer,
}: {
  dealers: Dealer[];
  selectedId: string | null;
  userLocation: { lat: number; lng: number } | null;
  onSelectDealer: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const userMarkerRef = useRef<Marker | null>(null);
  const onSelectDealerRef = useRef(onSelectDealer);
  onSelectDealerRef.current = onSelectDealer;
  const [mapReady, setMapReady] = useState(false);

  // create the map + tile layer once
  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: userLocation ? [userLocation.lat, userLocation.lng] : INDIA_CENTER,
        zoom: userLocation ? 11 : 5,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep the dealer pins in sync with whichever dealers are currently
  // passed in (e.g. filtered by the city search box)
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    import("leaflet").then((L) => {
      const dealerIcon = pinIcon(L, "#7828ec");
      const activeIcon = pinIcon(L, "#05bece");
      const currentIds = new Set(dealers.map((d) => d.id));

      // drop markers for dealers no longer in the filtered list
      markersRef.current.forEach((marker, id) => {
        if (!currentIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      });

      // add/update markers for the current list
      dealers.forEach((dealer) => {
        const icon = dealer.id === selectedId ? activeIcon : dealerIcon;
        const existing = markersRef.current.get(dealer.id);
        if (existing) {
          existing.setIcon(icon);
          return;
        }
        const marker = L.marker([dealer.lat, dealer.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${dealer.name}</strong><br/>${dealer.address}`)
          .on("click", () => onSelectDealerRef.current(dealer.id));
        markersRef.current.set(dealer.id, marker);
      });
    });
  }, [dealers, mapReady, selectedId]);

  // pan/zoom to the selected dealer
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const dealer = dealers.find((d) => d.id === selectedId);
    if (dealer) mapRef.current.flyTo([dealer.lat, dealer.lng], 13, { duration: 0.6 });
  }, [selectedId, dealers]);

  // show/update the "you are here" marker once geolocation resolves
  useEffect(() => {
    if (!mapReady) return;
    import("leaflet").then((L) => {
      if (!mapRef.current || !userLocation) return;
      const userIcon = L.divIcon({
        className: "",
        html: `<div style="width:18px;height:18px;border-radius:9999px;background:#05bece;border:3px solid white;box-shadow:0 0 0 4px rgba(5,190,206,0.35)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(mapRef.current)
          .bindPopup("Your location");
      }
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 11, { duration: 0.6 });
    });
  }, [userLocation, mapReady]);

  return <div ref={containerRef} className="h-full w-full" />;
}
