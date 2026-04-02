import React, { useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Shield } from "lucide-react";
import { renderToString } from "react-dom/server";

const iconHtml = renderToString(
  <div className="marker-anim-wrapper" style={{ color: '#f97316' }}>
    <Shield size={24} strokeWidth={2.5} />
  </div>
);

const safetyCameraIcon = L.divIcon({
  html: iconHtml,
  className: "camera-icon-container",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export default function SafetyCameraMarker({ position, children }: { position: [number, number], children?: React.ReactNode, key?: React.Key }) {
  const markerRef = useRef<L.Marker>(null);

  return (
    <Marker
      position={position}
      icon={safetyCameraIcon}
      ref={markerRef}
      eventHandlers={{
        popupopen: () => {
          const el = markerRef.current?.getElement();
          if (el) el.classList.add('marker-active');
        },
        popupclose: () => {
          const el = markerRef.current?.getElement();
          if (el) el.classList.remove('marker-active');
        },
      }}
    >
      <Popup>
        <div className="min-w-[240px] bg-[#0f1115] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-400" />
            <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">Safety Node</h3>
          </div>
          <div className="p-4">
            {children || <span className="text-[11px] text-zinc-400">Security monitoring active at this coordinate.</span>}
          </div>
          <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center">
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Type</span>
            <span className="text-[8px] font-mono text-orange-500 uppercase">Enforcement</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
