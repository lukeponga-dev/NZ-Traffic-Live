import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Navigation } from "lucide-react";
import { renderToString } from "react-dom/server";

const UserIcon = L.divIcon({
  html: renderToString(
    <div className="relative flex items-center justify-center">
      {/* Pulse rings */}
      <div className="absolute w-12 h-12 bg-emerald-500/20 rounded-full animate-ping" />
      <div className="absolute w-8 h-8 bg-emerald-500/30 rounded-full animate-pulse" />
      
      {/* Marker body */}
      <div className="relative w-6 h-6 bg-[#0f1115] border-2 border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        <Navigation className="w-3 h-3 text-emerald-500 fill-emerald-500" />
      </div>
    </div>
  ),
  className: "user-location-marker",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

export default function UserMarker({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <Marker position={[lat, lng]} icon={UserIcon}>
      <Popup>
        <div className="px-3 py-2 bg-[#0f1115] border border-emerald-500/30 rounded shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Current Position</span>
          </div>
          <div className="mt-1 text-[9px] font-mono text-emerald-500/70">
            {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
