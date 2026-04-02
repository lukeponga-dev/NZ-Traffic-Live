import { useState, useEffect, useCallback, useRef } from "react";
import { fetchIncidents } from "../services/incidentService";
import { Incident } from "../types";

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [newlyUpdatedIds, setNewlyUpdatedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const prevIncidentsRef = useRef<Incident[]>([]);

  const load = useCallback(async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncidents(lat, lng, 500);
      
      // Identify new or updated incidents
      const updatedIds = new Set<string>();
      const prevMap = new Map(prevIncidentsRef.current.map(i => [i.id, i.updatedTime]));
      
      data.forEach(incident => {
        const prevUpdatedTime = prevMap.get(incident.id);
        if (!prevUpdatedTime || prevUpdatedTime !== incident.updatedTime) {
          updatedIds.add(incident.id);
        }
      });

      if (updatedIds.size > 0) {
        setNewlyUpdatedIds(updatedIds);
        // Clear highlight after 5 seconds
        setTimeout(() => {
          setNewlyUpdatedIds(prev => {
            const next = new Set(prev);
            updatedIds.forEach(id => next.delete(id));
            return next;
          });
        }, 5000);
      }

      setIncidents(data);
      prevIncidentsRef.current = data;
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to load traffic incidents:", e);
      setError("Failed to load traffic incident data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(), 60000); // Update every minute
    return () => clearInterval(interval);
  }, [load]);

  return { incidents, newlyUpdatedIds, loading, error, lastUpdated, load };
}
