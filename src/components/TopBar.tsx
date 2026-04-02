import React from "react";
import { SearchBar } from "./SearchBar";
import { Activity, Radio } from "lucide-react";

interface TopBarProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export function TopBar({ onLocationSelect }: TopBarProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 flex items-center justify-center rounded-lg overflow-hidden">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight text-white leading-none flex items-center gap-2">
              NZ TRAFFIC <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">CORE</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Radio className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl px-8">
        <SearchBar onLocationSelect={onLocationSelect} />
      </div>

      <div className="hidden lg:flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Network Status</span>
          <span className="text-[11px] font-mono text-zinc-300">STABLE // 128ms</span>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Current Region</span>
          <span className="text-[11px] font-mono text-zinc-300">NEW ZEALAND</span>
        </div>
      </div>
    </header>
  );
}

