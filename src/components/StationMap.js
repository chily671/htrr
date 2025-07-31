"'use client';";
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocateButton from "./LocateButton";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default function StationMap({ stations, onMapClick }) {
  return (
    <MapContainer
      center={[16.0471, 108.2062]}
      zoom={13}
      className="h-[500px] rounded-xl shadow-md"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((st) => (
        <Marker
          key={st._id}
          position={[st?.location?.lat, st?.location?.lng]}
          icon={
            new L.Icon({
              iconUrl: "/station-icon.png",
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
            })
          }
        />
      ))}
      <ClickHandler onMapClick={onMapClick} />
      <LocateButton />
    </MapContainer>
  );
}
