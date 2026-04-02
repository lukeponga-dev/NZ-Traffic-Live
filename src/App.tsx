import React, { useEffect } from "react";
import MapContainer from "./components/MapContainer";
import { testConnection } from "./services/incidentService";

export default function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return <MapContainer />;
}
