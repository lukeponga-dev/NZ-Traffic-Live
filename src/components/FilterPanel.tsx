import React from "react";
import { FilterState, IncidentSeverity, TimeWindow, IncidentStatus, IncidentType } from "../types";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const severityOptions: { id: IncidentSeverity | "All"; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Severe", label: "Severe" },
  { id: "Moderate", label: "Moderate" },
  { id: "Minor", label: "Minor" },
];

const statusOptions: { id: IncidentStatus | "All"; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Resolved", label: "Resolved" },
  { id: "Planned", label: "Planned" },
];

const typeOptions: { id: IncidentType | "All"; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Crash", label: "Crash" },
  { id: "Roadworks", label: "Roadworks" },
  { id: "Congestion", label: "Congestion" },
  { id: "Weather", label: "Weather" },
  { id: "Breakdown", label: "Breakdown" },
  { id: "Other", label: "Other" },
];

const timeOptions: { id: TimeWindow; label: string }[] = [
  { id: "30m", label: "30M" },
  { id: "1h", label: "1H" },
  { id: "4h", label: "4H" },
  { id: "24h", label: "24H" },
  { id: "All", label: "ALL" },
];

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  return (
    <div className="w-72 glass-panel rounded-lg p-5 animate-in fade-in slide-in-from-left-4 duration-300 max-h-[75vh] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">Control Panel</h3>
        </div>
        <span className="text-[9px] font-mono text-zinc-600">v4.2.0</span>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="data-label">Search Query</span>
          <Search className="w-3 h-3 text-zinc-600" />
        </div>
        <div className="relative group">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="ENTER KEYWORDS..."
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-[11px] font-mono text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-zinc-700 uppercase"
          />
          <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500/0 group-focus-within:bg-blue-500/50 transition-all w-full" />
        </div>
      </div>

      {/* Type Section */}
      <div className="mb-8">
        <span className="data-label block mb-3 px-1">Incident Type</span>
        <div className="grid grid-cols-2 gap-1.5">
          {typeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onFilterChange({ ...filters, type: opt.id })}
              className={`px-3 py-2 rounded border text-[10px] font-mono font-bold uppercase tracking-wider transition-all
                ${
                  filters.type === opt.id
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:text-zinc-300"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Section */}
      <div className="mb-8">
        <span className="data-label block mb-3 px-1">Status</span>
        <div className="grid grid-cols-2 gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onFilterChange({ ...filters, status: opt.id })}
              className={`px-3 py-2 rounded border text-[10px] font-mono font-bold uppercase tracking-wider transition-all
                ${
                  filters.status === opt.id
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                    : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:text-zinc-300"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Severity Section */}
      <div className="mb-8">
        <span className="data-label block mb-3 px-1">Severity</span>
        <div className="grid grid-cols-2 gap-1.5">
          {severityOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onFilterChange({ ...filters, severity: opt.id })}
              className={`px-3 py-2 rounded border text-[10px] font-mono font-bold uppercase tracking-wider transition-all
                ${
                  filters.severity === opt.id
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                    : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:text-zinc-300"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Window Section */}
      <div className="mb-8">
        <span className="data-label block mb-3 px-1">Time Window</span>
        <div className="flex flex-wrap gap-1.5">
          {timeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onFilterChange({ ...filters, timeWindow: opt.id })}
              className={`flex-1 min-w-[50px] px-2 py-2 rounded border text-[10px] font-mono font-bold uppercase tracking-wider transition-all
                ${
                  filters.timeWindow === opt.id
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                    : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:text-zinc-300"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proximity Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="data-label">Proximity</span>
          <span className="text-[10px] font-mono font-bold text-blue-400">
            {filters.highlightRadius > 0 ? `${filters.highlightRadius}KM` : 'DISABLED'}
          </span>
        </div>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={filters.highlightRadius}
            onChange={(e) => onFilterChange({ ...filters, highlightRadius: parseInt(e.target.value) })}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-2">
            <span className="text-[8px] font-mono text-zinc-600">0KM</span>
            <span className="text-[8px] font-mono text-zinc-600">50KM</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          onFilterChange({ 
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
        }}
        className="w-full group flex items-center justify-center gap-2 py-3 text-[10px] font-mono font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-all border border-dashed border-white/10 hover:border-white/20 rounded active:scale-95"
      >
        <RotateCcw className="w-3 h-3 group-hover:rotate-[-180deg] transition-transform duration-500" />
        Reset Parameters
      </button>
    </div>
  );
}
