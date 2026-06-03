"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapInnerProps {
  destination: string;
  lat: number;
  lng: number;
}

// Simple geocoding lookup for common destinations
const COORDS: Record<string, [number, number]> = {
  "santorini": [36.3932, 25.4615],
  "kyoto": [35.0116, 135.7681],
  "paris": [48.8566, 2.3522],
  "zermatt": [46.0207, 7.7491],
  "tokyo": [35.6762, 139.6503],
  "rome": [41.9028, 12.4964],
  "bali": [-8.3405, 115.0920],
  "new york": [40.7128, -74.0060],
  "london": [51.5074, -0.1278],
  "barcelona": [41.3874, 2.1686],
  "dubai": [25.2048, 55.2708],
  "amalfi": [40.6340, 14.6027],
  "positano": [40.6280, 14.4840],
  "machu picchu": [-13.1631, -72.5450],
  "iceland": [64.1466, -21.9426],
  "maldives": [3.2028, 73.2207],
  "marrakech": [31.6295, -7.9811],
  "amsterdam": [52.3676, 4.9041],
  "lisbon": [38.7223, -9.1393],
  "cape town": [-33.9249, 18.4241],
  "sydney": [-33.8688, 151.2093],
  "singapore": [1.3521, 103.8198],
  "bangkok": [13.7563, 100.5018],
};

async function getCoords(destination: string, lat: number, lng: number): Promise<[number, number]> {
  if (lat !== 0 && lng !== 0) return [lat, lng];
  
  const key = destination.toLowerCase();
  for (const [name, coords] of Object.entries(COORDS)) {
    if (key.includes(name)) return coords;
  }
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (err) {
    console.warn("Geocoding failed", err);
  }

  // Default to center of world
  return [20, 0];
}

export default function MapInner({ destination, lat, lng }: MapInnerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    getCoords(destination, lat, lng).then(([dlat, dlng]) => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [dlat, dlng],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    L.marker([dlat, dlng], { icon: DefaultIcon })
      .addTo(map)
      .bindPopup(`<strong>${destination}</strong>`)
      .openPopup();

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination, lat, lng]);

  return <div ref={mapRef} className="w-full h-full" />;
}
