export type CameraFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    imageUrl: string;
  };
};

export type CameraResponse = {
  type: "FeatureCollection";
  features: CameraFeature[];
};

export type Camera = {
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

export type IncidentSeverity = "Minor" | "Moderate" | "Severe";

export type IncidentStatus = "Active" | "Resolved" | "Planned";

export type IncidentType = "Crash" | "Roadworks" | "Congestion" | "Weather" | "Breakdown" | "Other";

export type TimeWindow = "30m" | "1h" | "4h" | "24h" | "All";

export type FilterState = {
  severity: IncidentSeverity | "All";
  status: IncidentStatus | "All";
  type: IncidentType | "All";
  timeWindow: TimeWindow;
  searchQuery: string;
  showCameras: boolean;
  showIncidents: boolean;
  showSafetyCameras: boolean;
  showRoadClosures: boolean;
  showPublicTransport: boolean;
  highlightRadius: number; // in km, 0 means disabled
};

export type Incident = {
  id: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  lat: number;
  lng: number;
  startTime: string;
  updatedTime: string;
};
