"use client";

import dynamic from "next/dynamic";

// Leaflet requires window, so we must load it client-side only
const MapComponent = dynamic(() => import("@/components/map/map-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse flex items-center justify-center">
      <span className="text-sm text-slate-400">Loading map...</span>
    </div>
  ),
});

interface DestinationMapProps {
  destination: string;
  lat?: number;
  lng?: number;
}

export function DestinationMap({ destination, lat, lng }: DestinationMapProps) {
  return (
    <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60">
      <MapComponent destination={destination} lat={lat || 0} lng={lng || 0} />
    </div>
  );
}
