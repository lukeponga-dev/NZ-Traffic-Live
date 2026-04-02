import { useState, useEffect, useCallback } from "react";
import { fetchCameras } from "../services/cameraService";
import { Camera } from "../types";

export function useTrafficData() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const load = useCallback(async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCameras(lat, lng, 500);
      const uniqueCams = Array.from(new Map(data.map(c => [c.id, c])).values());
      setCameras(uniqueCams);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to load traffic cameras:", e);
      // If we already have cameras, don't show a blocking error
      if (cameras.length === 0) {
        setError("Failed to load traffic camera data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(), 30000);
    return () => clearInterval(interval);
  }, [load]);

  return { cameras, loading, error, lastUpdated, load };
}
