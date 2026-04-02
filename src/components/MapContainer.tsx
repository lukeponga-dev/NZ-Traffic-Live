import React, { useState, useEffect, useMemo } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, ScaleControl, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, Layers, AlertCircle } from "lucide-react";

import { useTrafficData } from "../hooks/useTrafficData";
import { useIncidents } from "../hooks/useIncidents";
import { useSafetyCameras } from "../hooks/useSafetyCameras";
import { TopBar } from "./TopBar";
import { SummaryPanel } from "./SummaryPanel";
import { FilterPanel } from "./FilterPanel";
import { LayerPanel } from "./LayerPanel";
import LocateButton from "./LocateButton";
import UserMarker from "./UserMarker";
import IncidentMarker from "./IncidentMarker";
import { MarkerCluster } from "./MarkerCluster";
import { CameraPopup } from "./CameraPopup";
import SafetyCameraMarker from "./SafetyCameraMarker";
import { FilterState, Camera, Incident } from "../types";

function ZoomTracker() {
  const map = useMapEvents({
    zoom: () => {
      const zoom = map.getZoom();
      const scale = Math.max(0.4, Math.min(2.0, Math.pow(1.2, zoom - 10)));
      document.documentElement.style.setProperty('--marker-scale', scale.toString());
    }
  });

  useEffect(() => {
    const zoom = map.getZoom();
    const scale = Math.max(0.4, Math.min(2.0, Math.pow(1.2, zoom - 10)));
    document.documentElement.style.setProperty('--marker-scale', scale.toString());
  }, [map]);

  return null;
}

export default function MapContainer() {
  const { cameras, lastUpdated, error: cameraError, load: loadCameras } = useTrafficData();
  const { incidents, newlyUpdatedIds, error: incidentError, load: loadIncidents } = useIncidents();
  const { safetyCameras, error: safetyError, load: loadSafetyCameras } = useSafetyCameras();
  
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    severity: "All",
    status: "All",
    type: "All",
    timeWindow: "All",
    searchQuery: "",
    showCameras: true,
    showIncidents: true,
    showSafetyCameras: true,
    showRoadClosures: true,
    showPublicTransport: true,
    highlightRadius: 0
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    loadCameras(lat, lng);
    loadIncidents(lat, lng);
    loadSafetyCameras();
  };

  const filteredCameras = useMemo(() => {
    if (!filters.showCameras) return [];
    return cameras.filter(cam => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return cam.name.toLowerCase().includes(query) || cam.region.toLowerCase().includes(query);
      }
      return true;
    });
  }, [cameras, filters.showCameras, filters.searchQuery]);

  const filteredSafetyCameras = useMemo(() => {
    if (!filters.showSafetyCameras) return [];
    return safetyCameras.filter(cam => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return cam.name.toLowerCase().includes(query) || cam.region.toLowerCase().includes(query);
      }
      return true;
    });
  }, [safetyCameras, filters.showSafetyCameras, filters.searchQuery]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      // Layer visibility
      const isRoadClosure = inc.type.toLowerCase().includes('closure') || inc.description.toLowerCase().includes('closed');
      const isPublicTransport = inc.type.toLowerCase().includes('bus') || inc.type.toLowerCase().includes('train') || inc.type.toLowerCase().includes('ferry');

      if (isRoadClosure) {
        if (!filters.showRoadClosures) return false;
      } else if (isPublicTransport) {
        if (!filters.showPublicTransport) return false;
      } else {
        if (!filters.showIncidents) return false;
      }

      // Severity filter
      if (filters.severity !== "All" && inc.severity !== filters.severity) return false;

      // Status filter
      if (filters.status !== "All" && inc.status !== filters.status) return false;

      // Type filter
      if (filters.type !== "All" && inc.type !== filters.type) return false;

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return inc.description.toLowerCase().includes(query) || inc.type.toLowerCase().includes(query);
      }

      // Time window filter
      if (filters.timeWindow !== "All") {
        const startTime = new Date(inc.startTime).getTime();
        const now = Date.now();
        const diffHrs = (now - startTime) / (1000 * 60 * 60);
        
        if (filters.timeWindow === "30m" && diffHrs > 0.5) return false;
        if (filters.timeWindow === "1h" && diffHrs > 1) return false;
        if (filters.timeWindow === "4h" && diffHrs > 4) return false;
        if (filters.timeWindow === "24h" && diffHrs > 24) return false;
      }

      return true;
    });
  }, [incidents, filters]);

  const error = cameraError || incidentError || safetyError;

  return (
    <div className="relative h-screen w-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans">
      <LeafletMapContainer
        center={[-41.2865, 174.7762]}
        zoom={6}
        zoomControl={false}
        attributionControl={false}
        className="absolute inset-0 z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          className="map-labels-layer"
        />

        <ScaleControl position="bottomleft" />
        <ZoomTracker />

        <TopBar 
          onLocationSelect={handleLocationSelect} 
        />

        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[2000] bg-red-500/10 text-red-500 px-4 py-3 rounded border border-red-500/20 shadow-2xl flex items-center gap-3 backdrop-blur-xl max-w-[90vw] w-max">
            <AlertCircle className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-70">System Error</span>
              <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
            </div>
          </div>
        )}
        
        {/* Left Side Panels */}
        <div className="absolute top-24 left-6 z-[1000] flex flex-col gap-4 pointer-events-none w-auto">
          <div className="pointer-events-auto flex flex-col gap-4">
            <SummaryPanel 
              cameras={filteredCameras} 
              incidents={filteredIncidents} 
              lastUpdated={lastUpdated} 
            />
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowLayers(false);
                }}
                className={`p-3 rounded-lg glass-panel transition-all shadow-xl flex items-center gap-2 border ${showFilters ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10'}`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Filters</span>
              </button>
              
              <button 
                onClick={() => {
                  setShowLayers(!showLayers);
                  setShowFilters(false);
                }}
                className={`p-3 rounded-lg glass-panel transition-all shadow-xl flex items-center gap-2 border ${showLayers ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10'}`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Layers</span>
              </button>
            </div>

            {showFilters && (
              <FilterPanel filters={filters} onFilterChange={setFilters} />
            )}
            
            {showLayers && (
              <LayerPanel filters={filters} onFilterChange={setFilters} />
            )}
          </div>
        </div>
        
        <LocateButton
          onLocate={(lat, lng) => {
            setUserPos({ lat, lng });
            handleLocationSelect(lat, lng);
          }}
        />

        {userPos && <UserMarker lat={userPos.lat} lng={userPos.lng} />}
        
        {filters.highlightRadius > 0 && userPos && (
          <Circle 
            center={[userPos.lat, userPos.lng]} 
            radius={filters.highlightRadius * 1000} 
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.05, weight: 1, dashArray: '5, 5' }}
          />
        )}
        
        <MarkerCluster cameras={filteredCameras} />
        
        {filteredSafetyCameras.map(cam => (
          <SafetyCameraMarker key={cam.id} position={[cam.lat, cam.lng]}>
            <CameraPopup cam={cam} />
          </SafetyCameraMarker>
        ))}
        
        {filteredIncidents.map(incident => (
          <IncidentMarker 
            key={incident.id} 
            incident={incident} 
            isNew={newlyUpdatedIds.has(incident.id)} 
          />
        ))}
      </LeafletMapContainer>
    </div>
  );
}

