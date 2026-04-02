import React from "react";
import { Camera, Incident } from "../types";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { Download, Shield, AlertTriangle, Video } from "lucide-react";

interface SummaryPanelProps {
  cameras: Camera[];
  incidents: Incident[];
  lastUpdated: Date;
}

export function SummaryPanel({ cameras, incidents, lastUpdated }: SummaryPanelProps) {
  const severeCount = incidents.filter(i => i.severity === 'Severe').length;
  const { isInstallable, install } = usePWAInstall();

  return (
    <div className="flex flex-col gap-4 w-full sm:w-72">
      <div className="glass-panel rounded-lg p-5 border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <h2 className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">System Status</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Video className="w-3 h-3 text-zinc-500" />
                <span className="data-label">Nodes</span>
              </div>
              <span className="text-2xl font-mono font-bold text-white tracking-tighter">
                {cameras.length.toString().padStart(3, '0')}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="data-label">Severe</span>
              </div>
              <span className={`text-2xl font-mono font-bold tracking-tighter ${severeCount > 0 ? 'text-red-500' : 'text-zinc-700'}`}>
                {severeCount.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="data-label">Last Sync</span>
              <span className="text-[10px] font-mono text-blue-400 font-bold">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500/40 w-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          {isInstallable && (
            <button
              onClick={install}
              className="w-full group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-mono font-bold py-3 rounded transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
              Install Interface
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
