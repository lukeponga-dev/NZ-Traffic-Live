import React, { useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Incident } from "../types";
import { AlertTriangle, Clock, RefreshCw, MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Severe": return "#ef4444";
    case "Moderate": return "#f97316";
    case "Minor": return "#eab308";
    default: return "#94a3b8";
  }
};

const createIncidentIcon = (severity: string, isNew: boolean) => {
  const color = getSeverityColor(severity);
  const iconHtml = renderToString(
    <div className={`incident-anim-wrapper ${isNew ? 'incident-new' : ''}`} style={{ color }}>
      <div className="relative">
        <AlertTriangle size={24} strokeWidth={2.5} />
        {isNew && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
        )}
      </div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "incident-icon-container",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export default function IncidentMarker({ incident, isNew = false }: { incident: Incident, isNew?: boolean, key?: React.Key }) {
  const markerRef = useRef<L.Marker>(null);
  const icon = createIncidentIcon(incident.severity, isNew);

  return (
    <Marker
      position={[incident.lat, incident.lng]}
      icon={icon}
      ref={markerRef}
      eventHandlers={{
        popupopen: () => {
          const el = markerRef.current?.getElement();
          if (el) el.classList.add('incident-active');
        },
        popupclose: () => {
          const el = markerRef.current?.getElement();
          if (el) el.classList.remove('incident-active');
        },
      }}
    >
      <Popup>
        <div className="min-w-[280px] bg-[#0f1115] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${incident.severity === 'Severe' ? 'text-red-500' : 'text-orange-500'}`} />
              <span className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">Incident Report</span>
            </div>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
              incident.severity === 'Severe' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
              incident.severity === 'Moderate' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            }`}>
              {incident.severity}
            </span>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-zinc-500" />
                <span className="data-label">Location Type</span>
              </div>
              <p className="text-[12px] font-bold text-white uppercase tracking-tight">
                {incident.type}
              </p>
            </div>

            <div className="space-y-1">
              <span className="data-label">Description</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                {incident.description}
              </p>
            </div>

            {/* Technical Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span className="data-label">Start</span>
                </div>
                <span className="text-[10px] font-mono text-white">
                  {new Date(incident.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-emerald-500" />
                  <span className="data-label">Updated</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500">
                  {new Date(incident.updatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer ID */}
          <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center">
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Reference ID</span>
            <span className="text-[8px] font-mono text-zinc-400 uppercase">{incident.id.slice(0, 12)}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
