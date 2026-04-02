import React, { useState, useEffect } from "react";
import { Camera } from "../types";
import { GoogleGenAI } from "@google/genai";

export function CameraPopup({ cam }: { cam: Camera }) {
  const [src, setSrc] = useState<string | null>(null);
  const [trafficInfo, setTrafficInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSrc(`${cam.image}?t=${Date.now()}`);
  }, [cam.image]);

  const getCameraTraffic = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the current traffic situation specifically at or near ${cam.name} (Coordinates: ${cam.lat}, ${cam.lng}) in New Zealand. Provide a very brief, actionable summary of any incidents or congestion.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setTrafficInfo(response.text || "No specific traffic data found.");
    } catch (err) {
      console.error("Camera traffic report failed:", err);
      setTrafficInfo("Failed to retrieve traffic details.");
    } finally {
      setLoading(false);
    }
  };

  if (!src) return <div className="p-6 text-center text-gray-500 text-sm font-medium">Loading feed...</div>;

  return (
    <div className="max-w-[220px] overflow-hidden rounded-lg p-0 bg-neutral-900 text-neutral-200 border border-neutral-800 shadow-2xl">
      <div className="p-2 border-b border-neutral-800 bg-neutral-950/50">
        <div className="flex justify-between items-start gap-1 mb-0.5">
          <h3 className="text-[10px] font-bold text-neutral-200 line-clamp-1 leading-tight flex-1">{cam.name}</h3>
          <span className={`px-1 py-0 rounded text-[8px] font-bold uppercase tracking-wider ${cam.offline ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
            {cam.offline ? 'Offline' : 'Live'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-neutral-500 font-medium">
          <i className="bi bi-geo-alt text-neutral-600"></i>
          <span>{cam.region}</span>
        </div>
      </div>
      
      <div className="p-2">
        <div className="relative aspect-video bg-neutral-950 rounded border border-neutral-800 overflow-hidden shadow-inner mb-2 group">
          <img
            src={src}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={cam.name}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded pointer-events-none"></div>
          <div className="absolute bottom-1 right-1 px-1 py-0 bg-black/60 backdrop-blur-md rounded text-[8px] font-mono text-white/80 border border-white/10">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {cam.description && (
          <p className="text-[9px] text-neutral-400 italic mb-2 line-clamp-1 leading-relaxed px-0.5">
            "{cam.description}"
          </p>
        )}

        <div className="mb-2">
          <button
            onClick={getCameraTraffic}
            disabled={loading}
            className="w-full py-1.5 px-2 bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded text-[9px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 border border-neutral-700 disabled:opacity-50"
          >
            {loading ? (
              <i className="bi bi-arrow-clockwise animate-spin text-green-500"></i>
            ) : (
              <i className="bi bi-google text-blue-400"></i>
            )}
            {loading ? "..." : "Analyze Traffic"}
          </button>
        </div>

        {trafficInfo && (
          <div className="bg-neutral-950 p-2 rounded-lg border border-neutral-800 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-inner">
            <p className="text-[9px] text-gray-300 leading-relaxed">
              {trafficInfo}
            </p>
            <button 
              onClick={() => setTrafficInfo(null)}
              className="mt-1 w-full text-[8px] font-bold text-neutral-500 hover:text-neutral-200 uppercase tracking-wider transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
