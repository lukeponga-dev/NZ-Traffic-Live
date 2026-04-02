import React from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import TrafficCameraMarker from "./TrafficCameraMarker";
import { Camera } from "../types";
import { CameraPopup } from "./CameraPopup";

interface MarkerClusterProps {
  cameras: Camera[];
}

const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let sizeClass = "low";
  if (count >= 50) sizeClass = "high";
  else if (count >= 10) sizeClass = "medium";

  return L.divIcon({
    html: `
      <div class="bubble ${sizeClass}">
        <div class="bubble-inner">
          <span class="bubble-text">${count}</span>
          <div class="bubble-ring"></div>
        </div>
      </div>
    `,
    className: "custom-marker-cluster",
    iconSize: L.point(42, 42, true),
  });
};

export function MarkerCluster({ cameras }: MarkerClusterProps) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
      maxClusterRadius={60}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
    >
      {cameras.map((cam) => (
        <TrafficCameraMarker key={cam.id} position={[cam.lat, cam.lng]}>
          <CameraPopup cam={cam} />
        </TrafficCameraMarker>
      ))}
    </MarkerClusterGroup>
  );
}
