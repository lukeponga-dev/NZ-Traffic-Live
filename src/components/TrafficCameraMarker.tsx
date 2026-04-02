import React, { useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Video } from "lucide-react";
import { renderToString } from "react-dom/server";

const iconHtml = renderToString(
  <div className="marker-anim-wrapper" style={{ color: '#3b82f6' }}>
    <Video size={24} strokeWidth={2.5} />
  </div>
);

const cameraIcon = L.divIcon({
  html: iconHtml,
  className: "camera-icon-container",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export default function TrafficCameraMarker({ position, children }: { position: [number, number], children?: React.ReactNode, key?: React.Key }) {
  const markerRef = useRef<L.Marker>(null);

  return (
    <Marker
      position={position}
      icon={cameraIcon}
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
            <Video className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">Traffic Node</span>
          </div>
          <div className="p-4">
            {children || <span className="text-[11px] text-zinc-400">No data available for this node.</span>}
          </div>
          <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center">
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Status</span>
            <span className="text-[8px] font-mono text-emerald-500 uppercase">Online</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
