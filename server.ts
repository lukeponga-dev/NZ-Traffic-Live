import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { SAFETY_CAMERAS } from './src/data/safetyCameras.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type Camera = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  image: string;
  viewUrl: string;
  region: string;
  description: string;
  offline: boolean;
};

let cache: Camera[] = [];
let lastFetch = 0;
const TTL = 30 * 1000; // 30s

const FALLBACK_CAMERAS: Camera[] = [
  {
    "id": "714",
    "name": "SH1 Tinwald ",
    "lat": -43.919632,
    "lng": 171.721055,
    "image": "https://trafficnz.info/camera/714.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/714",
    "region": "Canterbury",
    "description": "South along Hinds Highway from Lagmhor Rd",
    "offline": false
  },
  {
    "id": "831",
    "name": "SH1 Tinwald North",
    "lat": -43.919508,
    "lng": 171.721221,
    "image": "https://trafficnz.info/camera/831.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/831",
    "region": "Canterbury",
    "description": "North along Hinds Highway towards Ashburton",
    "offline": false
  },
  {
    "id": "653",
    "name": "SH20 May Rd Overbridge",
    "lat": -36.90943,
    "lng": 174.73442,
    "image": "https://trafficnz.info/camera/653.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/653",
    "region": "Auckland",
    "description": "SH20 May Rd Overbridge",
    "offline": false
  },
  {
    "id": "654",
    "name": "SH16 Carrington Rd Overbridge",
    "lat": -36.87173,
    "lng": 174.71018,
    "image": "https://trafficnz.info/camera/654.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/654",
    "region": "Auckland",
    "description": "SH16 Carrington Rd Overbridge",
    "offline": false
  },
  {
    "id": "655",
    "name": "SH16/20 Interchange South",
    "lat": -36.871997,
    "lng": 174.704836,
    "image": "https://trafficnz.info/camera/655.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/655",
    "region": "Auckland",
    "description": "SH16/20 Interchange South",
    "offline": false
  },
  {
    "id": "818",
    "name": "SH1 McClymonts Rd Overbridge",
    "lat": -36.724252,
    "lng": 174.713939,
    "image": "https://trafficnz.info/camera/818.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/818",
    "region": "Auckland",
    "description": "SH1 McClymonts Rd Overbridge",
    "offline": false
  },
  {
    "id": "819",
    "name": "SH1 Tirohanga Whanui Bridge",
    "lat": -36.728623,
    "lng": 174.7143,
    "image": "https://trafficnz.info/camera/819.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/819",
    "region": "Auckland",
    "description": "SH1 Tirohanga Whanui Bridge",
    "offline": false
  },
  {
    "id": "820",
    "name": "SH1 Rosedale",
    "lat": -36.743377,
    "lng": 174.720401,
    "image": "https://trafficnz.info/camera/820.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/820",
    "region": "Auckland",
    "description": "SH1 Rosedale",
    "offline": false
  },
  {
    "id": "821",
    "name": "SH1 Constellation Dr",
    "lat": -36.750564,
    "lng": 174.726254,
    "image": "https://trafficnz.info/camera/821.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/821",
    "region": "Auckland",
    "description": "SH1 Constellation Dr",
    "offline": false
  },
  {
    "id": "822",
    "name": "SH1 Sunset Rd Overbridge",
    "lat": -36.753905,
    "lng": 174.728353,
    "image": "https://trafficnz.info/camera/822.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/822",
    "region": "Auckland",
    "description": "SH1 Sunset Rd Overbridge",
    "offline": false
  },
  {
    "id": "101",
    "name": "SH1 Fanshawe St",
    "lat": -36.8485,
    "lng": 174.7633,
    "image": "https://trafficnz.info/camera/101.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/101",
    "region": "Auckland",
    "description": "SH1 Fanshawe St",
    "offline": false
  },
  {
    "id": "201",
    "name": "SH1 Terrace Tunnel",
    "lat": -41.2865,
    "lng": 174.7762,
    "image": "https://trafficnz.info/camera/201.jpg",
    "viewUrl": "https://trafficnz.info/camera/view/201",
    "region": "Wellington",
    "description": "SH1 Terrace Tunnel",
    "offline": false
  },
  {
    "id": "ESM_FRED",
    "name": "Esmonde Road and Fred Thomas Drive, Takapuna",
    "lat": -36.796787,
    "lng": 174.765623,
    "image": "https://trafficnz.info/camera/default.jpg",
    "viewUrl": "https://www.nzta.govt.nz/",
    "region": "Auckland",
    "description": "Red Light Camera",
    "offline": false
  },
  {
    "id": "DAIRY_ALB",
    "name": "Dairy Flat Highway and Oteha Valley Road, Albany",
    "lat": -36.726608,
    "lng": 174.69771,
    "image": "https://trafficnz.info/camera/default.jpg",
    "viewUrl": "https://www.nzta.govt.nz/",
    "region": "Auckland",
    "description": "Red Light Camera",
    "offline": false
  },
  {
    "id": "LINCOLN_POM",
    "name": "Lincoln Road and Pomaria Road, Henderson",
    "lat": -36.86235,
    "lng": 174.629207,
    "image": "https://trafficnz.info/camera/default.jpg",
    "viewUrl": "https://www.nzta.govt.nz/",
    "region": "Auckland",
    "description": "Red Light Camera",
    "offline": false
  },
  {
    "id": "PONSONBY_KAR",
    "name": "Ponsonby Road and Karangahape Road, Grey Lynn",
    "lat": -36.859408,
    "lng": 174.752392,
    "image": "https://trafficnz.info/camera/default.jpg",
    "viewUrl": "https://www.nzta.govt.nz/",
    "region": "Auckland",
    "description": "Red Light Camera",
    "offline": false
  },
  {
    "id": "GREAT_SOUTH_CAV",
    "name": "Great South Road and Cavendish Drive, Manukau",
    "lat": -36.98732,
    "lng": 174.881609,
    "image": "https://trafficnz.info/camera/default.jpg",
    "viewUrl": "https://www.nzta.govt.nz/",
    "region": "Auckland",
    "description": "Red Light Camera",
    "offline": false
  },
  {
    "id": "GREAT_SOUTH_TE_IRI",
    "name": "Great South Road and Te Irirangi Drive, Manukau",
    "lat": -36.9864,
    "lng": 174.881137,
    "image": "https://trafficnz.info/camera/default.jpg",
    "viewUrl": "https://www.nzta.govt.nz/",
    "region": "Auckland",
    "description": "Red Light Camera",
    "offline": false
  }
];

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalize(camera: any): Camera {
  return {
    id: (camera.id || camera.camera_id || Math.random().toString()).toString(),
    name: camera.name || camera.description || "Unknown Camera",
    lat: Number(camera.latitude || camera.lat || camera.location?.lat || 0),
    lng: Number(camera.longitude || camera.lon || camera.lng || camera.location?.lon || 0),
    image: camera.imageUrl ? (camera.imageUrl.startsWith('http') ? camera.imageUrl : `https://trafficnz.info${camera.imageUrl}`) : "https://trafficnz.info/camera/default.jpg",
    viewUrl: camera.viewUrl ? (camera.viewUrl.startsWith('http') ? camera.viewUrl : `https://trafficnz.info${camera.viewUrl}`) : "https://www.nzta.govt.nz/",
    region: camera.region?.name || camera.region || "Unknown",
    description: camera.description || "",
    offline: !!camera.offline,
  };
}

function normalizeIncident(event: any): any {
  // Map NZTA severity to our IncidentSeverity
  let severity: string = "Minor";
  const nztaSeverity = (event.severity || "").toLowerCase();
  if (nztaSeverity.includes("high") || nztaSeverity.includes("severe") || nztaSeverity.includes("major")) {
    severity = "Severe";
  } else if (nztaSeverity.includes("moderate") || nztaSeverity.includes("medium")) {
    severity = "Moderate";
  }

  // Map NZTA status
  let status: string = "Active";
  const nztaStatus = (event.status || "").toLowerCase();
  if (nztaStatus.includes("resolved") || nztaStatus.includes("cleared")) {
    status = "Resolved";
  } else if (nztaStatus.includes("planned") || nztaStatus.includes("future")) {
    status = "Planned";
  }

  return {
    id: (event.id || event.event_id || Math.random().toString()).toString(),
    type: event.eventType || event.type || "Other",
    severity: severity,
    status: status,
    description: event.description || event.summary || "No description provided.",
    lat: Number(event.latitude || event.lat || event.location?.lat || 0),
    lng: Number(event.longitude || event.lon || event.lng || event.location?.lon || 0),
    startTime: event.startDate || event.start_date || new Date().toISOString(),
    updatedTime: event.lastModifiedDate || event.updated_date || new Date().toISOString(),
  };
}

let isFetching = false;
let incidentCache: any[] = [];
let lastIncidentFetch = 0;

async function fetchCameras(): Promise<Camera[]> {
  const now = Date.now();
  if (cache.length > 0 && now - lastFetch < TTL) return cache;
  if (isFetching && cache.length > 0) return cache;
  if (cache.length === 0) {
    cache = FALLBACK_CAMERAS;
    doFetch().catch(err => console.error("Initial background fetch failed:", err));
    return cache;
  }
  if (now - lastFetch >= TTL) {
    doFetch().catch(err => console.error("Background fetch failed:", err));
  }
  return cache;
}

async function doFetch(): Promise<Camera[]> {
  if (isFetching) return cache;
  isFetching = true;
  const now = Date.now();
  const MAX_RETRIES = 3; 
  const TIMEOUT_MS = 15000;

  try {
    const urls = [
      "https://www.nzta.govt.nz/service/traffic/rest/6/cameras/all?format=json",
      "https://www.nzta.govt.nz/service/traffic/rest/5/cameras/all?format=json",
      "https://www.nzta.govt.nz/service/traffic/rest/4/cameras/all?format=json",
      "https://www.nzta.govt.nz/assets/traffic/cameras.json",
      "https://trafficnz.info/service/traffic/rest/6/cameras/all?format=json",
      "https://trafficnz.info/service/traffic/rest/4/cameras/all?format=json"
    ];

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      for (const url of urls) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
          console.log(`Attempting to fetch cameras from ${url} (attempt ${attempt})`);
          const res = await fetch(url, {
            headers: { 
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!res.ok) continue;

          const text = await res.text();
          if (!text.trim().startsWith('{')) continue;

          const data = JSON.parse(text);
          const rawCameras = data.response?.camera || data.cameras || data;
          
          if (!Array.isArray(rawCameras)) continue;

          const newCameras = rawCameras.map((c: any) => {
            try { return normalize(c); } catch (e) { return null; }
          }).filter((c: any) => c !== null && c.lat !== 0);

          if (newCameras.length > 0) {
            cache = newCameras;
            lastFetch = now;
            console.log(`Successfully fetched ${cache.length} cameras from ${url}`);
            return cache;
          }
        } catch (err: any) {
          clearTimeout(timeoutId);
        }
      }
      if (attempt < MAX_RETRIES) await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
    return cache;
  } finally {
    isFetching = false;
  }
}

async function fetchIncidents(): Promise<any[]> {
  const now = Date.now();
  if (incidentCache.length > 0 && now - lastIncidentFetch < TTL) return incidentCache;
  
  const urls = [
    "https://www.nzta.govt.nz/service/traffic/rest/6/events/all?format=json",
    "https://www.nzta.govt.nz/service/traffic/rest/5/events/all?format=json",
    "https://www.nzta.govt.nz/service/traffic/rest/4/events/all?format=json",
    "https://www.nzta.govt.nz/assets/traffic/events.json",
    "https://www.nzta.govt.nz/service/traffic/rest/events/all?format=json",
    "https://trafficnz.info/service/traffic/rest/6/events/all?format=json",
    "https://trafficnz.info/service/traffic/rest/4/events/all?format=json"
  ];

  for (const url of urls) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      console.log(`Attempting to fetch incidents from ${url}`);
      const res = await fetch(url, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.nzta.govt.nz/'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        console.warn(`NZTA incident fetch failed from ${url}: Status ${res.status}`);
        continue;
      }
      const text = await res.text();
      if (!text.trim().startsWith('{')) {
        console.warn(`Received non-JSON incident response from ${url}`);
        continue;
      }
      const data = JSON.parse(text);
      const rawEvents = data.response?.event || data.events || data.data || data;
      if (!Array.isArray(rawEvents)) {
        console.warn(`Invalid incident data structure from ${url}`);
        continue;
      }

      const newIncidents = rawEvents.map((e: any) => {
        try { return normalizeIncident(e); } catch (e) { return null; }
      }).filter((e: any) => e !== null && e.lat !== 0);

      if (newIncidents.length > 0) {
        incidentCache = newIncidents;
        lastIncidentFetch = now;
        console.log(`Successfully fetched ${incidentCache.length} incidents from ${url}`);
        return incidentCache;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(`Error fetching incidents from ${url}:`, err.message || err);
    }
  }
  return incidentCache;
}

async function startServer() {
  const app = express();
  app.use(cors());
  const PORT = 3000;

  app.get("/api/cameras", async (_: Request, res: Response) => {
    try {
      const cameras = await fetchCameras();
      res.json({ count: cameras.length, data: cameras });
    } catch (err) {
      console.error("Critical error in /api/cameras:", err);
      res.json({ count: cache.length, data: cache, error: "Partial data load" });
    }
  });

  app.get("/api/incidents", async (_: Request, res: Response) => {
    try {
      const incidents = await fetchIncidents();
      res.json({ count: incidents.length, data: incidents });
    } catch (err) {
      console.error("Critical error in /api/incidents:", err);
      res.json({ count: incidentCache.length, data: incidentCache, error: "Partial data load" });
    }
  });

  app.get("/api/safety-cameras", async (_: Request, res: Response) => {
    console.log("Received request for /api/safety-cameras");
    res.json({ count: SAFETY_CAMERAS.length, data: SAFETY_CAMERAS });
  });

  app.get("/api/cameras/nearest", async (req: Request, res: Response) => {
    console.log("Received request for /api/cameras/nearest");
    try {
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);
      const limit = Number(req.query.limit) || 10;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          error: "lat and lng query params required",
        });
      }

      const cameras = await fetchCameras();

      const nearest = cameras
        .map((cam) => ({
          ...cam,
          distance: haversine(lat, lng, cam.lat, cam.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);

      res.json({
        origin: { lat, lng },
        count: nearest.length,
        data: nearest,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to compute nearest cameras" });
    }
  });

  app.get('/api/health', (_: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
