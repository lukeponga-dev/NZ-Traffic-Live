import React, { useState } from "react";
import { useMap } from "react-leaflet";
import { searchLocation } from "../services/aiService";

export function SearchBar({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const map = useMap();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchLocation(query);
      if (result && result.lat && result.lng) {
        map.flyTo([result.lat, result.lng], 13);
        onLocationSelect(result.lat, result.lng);
        setQuery(result.displayName || query);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const quickTags = [
    { label: "Auckland", lat: -36.8485, lng: 174.7633 },
    { label: "Wellington", lat: -41.2865, lng: 174.7762 },
    { label: "Christchurch", lat: -43.5321, lng: 172.6362 },
    { label: "Hamilton", lat: -37.7870, lng: 175.2793 },
  ];

  return (
    <div className="flex-1 max-w-md mx-auto flex flex-col gap-2 w-full">
      <form onSubmit={handleSearch} className="relative group w-full">
        <i className={`bi ${isSearching ? 'bi-arrow-repeat animate-spin' : 'bi-search'} absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors`}></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search NZ regions or roads..."
          disabled={isSearching}
          className="w-full bg-neutral-800/80 border border-neutral-700/50 rounded-full pl-11 pr-10 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm placeholder-neutral-500 backdrop-blur-sm"
        />
        {query && !isSearching && (
          <button 
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
        )}
      </form>
      
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickTags.map((tag) => (
          <button
            key={tag.label}
            onClick={() => {
              map.flyTo([tag.lat, tag.lng], 12);
              onLocationSelect(tag.lat, tag.lng);
            }}
            className="whitespace-nowrap px-3 py-1 bg-neutral-800/30 hover:bg-neutral-700/50 border border-neutral-700/30 rounded-full text-[10px] font-bold text-neutral-400 hover:text-neutral-200 transition-all uppercase tracking-wider"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
