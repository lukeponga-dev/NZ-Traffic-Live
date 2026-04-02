import React from "react";
import { FilterState } from "../types";
import { Layers, Video, Shield, AlertTriangle, XCircle, Bus } from "lucide-react";

interface LayerPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function LayerPanel({ filters, onFilterChange }: LayerPanelProps) {
  const layers = [
    { id: 'showCameras', label: 'Traffic Cameras', icon: Video, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'showSafetyCameras', label: 'Safety Cameras', icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { id: 'showIncidents', label: 'Active Incidents', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'showRoadClosures', label: 'Road Closures', icon: XCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 'showPublicTransport', label: 'Public Transport', icon: Bus, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="w-64 glass-panel rounded-lg p-5 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-4 h-4 text-blue-400" />
        <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">Data Layers</h3>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => (
          <label 
            key={layer.id}
            className={`flex items-center justify-between p-3 rounded border transition-all cursor-pointer group active:scale-[0.98]
              ${filters[layer.id as keyof FilterState] 
                ? 'bg-white/5 border-white/10' 
                : 'bg-transparent border-transparent opacity-50 hover:opacity-80'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded flex items-center justify-center border ${layer.bg} ${layer.border}`}>
                <layer.icon className={`w-4 h-4 ${layer.color}`} />
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">{layer.label}</span>
            </div>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={!!filters[layer.id as keyof FilterState]}
                onChange={(e) => onFilterChange({ ...filters, [layer.id]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-7 h-3.5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-blue-500 peer-checked:after:bg-white"></div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <span className="data-label block mb-3 px-1">Visual Engine</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="py-2 px-3 bg-blue-500/10 rounded border border-blue-500/20 text-[9px] font-mono font-bold text-blue-400 text-center uppercase">
            Vector 2.0
          </div>
          <div className="py-2 px-3 bg-white/5 rounded border border-white/5 text-[9px] font-mono font-bold text-zinc-700 text-center uppercase">
            Legacy
          </div>
        </div>
      </div>
    </div>
  );
}
