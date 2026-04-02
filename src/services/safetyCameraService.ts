import { Camera } from "../types";

export async function fetchSafetyCameras(): Promise<Camera[]> {
  const url = new URL("/api/safety-cameras", window.location.origin);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch safety cameras");
  const json = await res.json();
  return json.data;
}
