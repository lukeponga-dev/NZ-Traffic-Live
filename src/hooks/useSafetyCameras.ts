import { useState, useEffect, useCallback } from "react";
import { fetchSafetyCameras } from "../services/safetyCameraService";
import { Camera } from "../types";

export function useSafetyCameras() {
  const [safetyCameras, setSafetyCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSafetyCameras();
      setSafetyCameras(data);
    } catch (e) {
      console.error("Failed to load safety cameras:", e);
      setError("Failed to load safety camera data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { safetyCameras, loading, error, load };
}
