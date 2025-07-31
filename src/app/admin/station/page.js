"use client";
import React, { useEffect, useState } from "react";
import StationMap from "@/components/StationMap";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import StationFormDrawer from "./StationForm";

export default function StationManager() {
  const [stations, setStations] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [newCoords, setNewCoords] = useState(null);

  useEffect(() => {
    fetch("/api/stations")
      .then((res) => res.json())
      .then((data) => setStations(data));
  }, []);

  const handleMapClick = (latlng) => {
    setNewCoords(latlng);
    setShowDrawer(true);
  };

  const handleStationCreated = (newStation) => {
    setStations((prev) => [...prev, newStation]);
    setShowDrawer(false);
    setNewCoords(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Quản lý trạm (Station)</h2>

      <StationMap stations={stations} onMapClick={handleMapClick} />

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
        <StationFormDrawer
          coords={newCoords}
          onCreated={handleStationCreated}
          onClose={() => setShowDrawer(false)}
        />
      </Drawer>
    </div>
  );
}
