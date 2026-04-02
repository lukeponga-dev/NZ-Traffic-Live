import { useMap } from "react-leaflet";
import { useState } from "react";
import { Crosshair, Loader2, AlertCircle } from "lucide-react";

export default function LocateButton({
  onLocate,
}: {
  onLocate?: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLocate() {
    if (!navigator.geolocation) {
      setError("GEOLOCATION_UNSUPPORTED");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Animate map
        map.flyTo([lat, lng], 13);

        onLocate?.(lat, lng);

        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("PERMISSION_DENIED");
        setLoading(false);
      }
    );
  }

  return (
    <div className="absolute bottom-28 sm:bottom-8 right-6 z-[1000] flex flex-col items-end gap-3">
      {error && (
        <div className="bg-red-500/10 text-red-400 text-[10px] font-mono font-bold px-3 py-2 rounded border border-red-500/20 shadow-2xl backdrop-blur-xl flex items-center gap-2 uppercase tracking-widest">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
      <button
        onClick={handleLocate}
        disabled={loading}
        title="Locate Me"
        className="group relative w-14 h-14 glass-panel hover:bg-white/5 text-emerald-500 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Radar Pulse Effect */}
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
        <div className="absolute inset-0 border border-emerald-500/20 rounded-lg group-hover:border-emerald-500/40 transition-colors" />
        
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Crosshair className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}

        {/* Technical Corner Accents */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-emerald-500/40" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-emerald-500/40" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-emerald-500/40" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-emerald-500/40" />
      </button>
    </div>
  );
}
