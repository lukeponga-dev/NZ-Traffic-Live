import React, { useState } from "react";
import { Camera, Incident, FilterState, IncidentSeverity, TimeWindow } from "../types";

interface BottomDrawerProps {
  cameras: Camera[];
  incidents: Incident[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  lastUpdated: Date;
}

const severityOptions: { id: IncidentSeverity | "All"; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Severe", label: "Severe" },
  { id: "Moderate", label: "Moderate" },
  { id: "Minor", label: "Minor" },
];

const timeOptions: { id: TimeWindow; label: string }[] = [
  { id: "30m", label: "Last 30 min" },
  { id: "1h", label: "Last 1 hr" },
  { id: "4h", label: "Last 4 hrs" },
  { id: "24h", label: "Last 24 hrs" },
  { id: "All", label: "All Time" },
];

export function BottomDrawer({ cameras, incidents, filters, onFilterChange, lastUpdated }: BottomDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const severeCount = incidents.filter(i => i.severity === 'Severe').length;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[1000] bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-800 rounded-t-[2.5rem] transition-transform duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] sm:hidden ${isOpen ? "translate-y-0" : "translate-y-[calc(100%-64px)]"}`}>
      <div 
        className="w-full h-16 flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-12 h-1.5 bg-neutral-600 rounded-full"></div>
      </div>
      
      <div className="p-6 pt-0 h-[75vh] overflow-y-auto custom-scrollbar flex flex-col gap-8">
        
        {/* Filters Section */}
        <div>
          <h2 className="text-sm font-semibold text-neutral-200 mb-4 tracking-tight flex items-center gap-2">
            <i className="bi bi-sliders text-green-500"></i> Filters & Controls
          </h2>
          
          <div className="flex flex-col gap-6">
            {/* Search Input */}
            <div>
              <p className="text-xs text-neutral-400 mb-2 tracking-wide">SEARCH MARKERS</p>
              <div className="relative">
                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                  placeholder="Filter by name or type..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-3 py-3 text-sm text-neutral-200 focus:outline-none focus:border-green-500 transition-colors placeholder-neutral-600 shadow-inner"
                />
              </div>
            </div>

            {/* Proximity Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-neutral-400 tracking-wide uppercase">PROXIMITY FILTER</p>
                <span className="text-xs font-mono text-green-500 font-bold">{filters.highlightRadius > 0 ? `${filters.highlightRadius}km` : 'OFF'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={filters.highlightRadius}
                onChange={(e) => onFilterChange({ ...filters, highlightRadius: parseInt(e.target.value) })}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-neutral-600 font-bold">Off</span>
                <span className="text-[10px] text-neutral-600 font-bold">50km</span>
              </div>
            </div>

            {/* Layer Toggles */}
            <div>
              <p className="text-xs text-neutral-400 mb-2 tracking-wide uppercase">MAP LAYERS</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onFilterChange({ ...filters, showCameras: !filters.showCameras })}
                  className={`px-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                    filters.showCameras 
                      ? "bg-blue-600/20 text-blue-400 border-blue-500/30" 
                      : "bg-neutral-800 text-neutral-500 border-neutral-700"
                  }`}
                >
                  <i className="bi bi-camera-video"></i> Cameras
                </button>
                <button
                  onClick={() => onFilterChange({ ...filters, showIncidents: !filters.showIncidents })}
                  className={`px-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                    filters.showIncidents 
                      ? "bg-red-600/20 text-red-400 border-red-500/30" 
                      : "bg-neutral-800 text-neutral-500 border-neutral-700"
                  }`}
                >
                  <i className="bi bi-exclamation-triangle"></i> Incidents
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-2 tracking-wide">SEVERITY LEVEL</p>
              <div className="grid grid-cols-2 gap-2">
                {severityOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onFilterChange({ ...filters, severity: opt.id })}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.severity === opt.id 
                        ? "bg-green-600 text-white" 
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-neutral-400 mb-2 tracking-wide">TIME WINDOW</p>
              <div className="grid grid-cols-2 gap-2">
                {timeOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onFilterChange({ ...filters, timeWindow: opt.id })}
                    className={`px-3 py-2 rounded-lg text-sm transition-all text-left flex items-center justify-between ${
                      filters.timeWindow === opt.id
                        ? "bg-green-600 text-white"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    {opt.label}
                    {filters.timeWindow === opt.id && <i className="bi bi-check2"></i>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-neutral-800" />

        {/* Summary Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-200 tracking-tight flex items-center gap-2">
              <i className="bi bi-bar-chart-fill text-green-500"></i> Live Summary
            </h2>
            <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Cameras</span>
                <span className="text-neutral-100 font-bold text-xl">{cameras.length || "—"}</span>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Severe</span>
                <span className={`font-bold text-xl ${severeCount > 0 ? 'text-red-400' : 'text-neutral-100'}`}>
                  {severeCount}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Last Sync</span>
              <span className="text-green-500 text-[11px] font-bold">{lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
