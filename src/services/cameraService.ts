import { Camera } from "../types";

export async function fetchCameras(lat?: number, lng?: number, limit?: number): Promise<Camera[]> {
  const isNearest = lat !== undefined && lng !== undefined;
  const endpoint = isNearest ? "/api/cameras/nearest" : "/api/cameras";
  
  const url = new URL(endpoint, window.location.origin);
  if (lat !== undefined) url.searchParams.append("lat", lat.toString());
  if (lng !== undefined) url.searchParams.append("lng", lng.toString());
  if (limit !== undefined) url.searchParams.append("limit", limit.toString());

  console.log("Fetching cameras from:", url.toString());

  try {
    const res = await fetch(url.toString());
    console.log("Fetch response status:", res.status);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error (${res.status}): ${errorText || res.statusText}`);
    }

    const json = await res.json();
    const data = json.data;
    console.log("Fetch data received:", data);

    if (!Array.isArray(data)) {
      console.warn("API returned invalid data structure:", json);
      return [];
    }

    return data;
  } catch (err) {
    console.error("fetchCameras failed:", err);
    throw err;
  }
}
