"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocateButton from "./LocateButton";

// Default marker config
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Icon
const teamIcon = new L.Icon({
  iconUrl: "/team-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const stationIcon = new L.Icon({
  iconUrl: "/station-icon.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const crowdedStationIcon = new L.Icon({
  // ⚠️ icon khi station quá đông
  iconUrl: "/crowded-station.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const otherTeamIcon = new L.Icon({
  iconUrl: "/other-team-icon.svg",
  iconSize: [35, 35],
  iconAnchor: [18, 35],
  popupAnchor: [0, -35],
});

// ⚠️ Hàm tính khoảng cách giữa 2 điểm (đơn vị: km)
function getDistance(loc1, loc2) {
  if (!loc1 || !loc2) return Infinity;
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Map() {
  const [teamPosition, setTeamPosition] = useState(null);
  const [stations, setStations] = useState([]);
  const [otherTeams, setOtherTeams] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/location")
        .then((res) => res.json())
        .then((data) => setOtherTeams(data));
    }, 5000); // Cập nhật mỗi 5 giây

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setTeamPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Lỗi lấy GPS:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => setOtherTeams(data));

    fetch("/api/stations")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Lỗi tải station:", err));
  }, []);

  const center = teamPosition || [10.762622, 106.660172];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ⚠️ Marker đội của bạn */}
        {teamPosition && (
          <Marker position={teamPosition} icon={teamIcon}>
            <Popup>Vị trí của bạn</Popup>
          </Marker>
        )}

        {/* ⚠️ Marker các station + logic kiểm tra "đông" */}
        {stations.map((station) => {
          const nearbyCount = otherTeams.filter((team) => {
            const dist = getDistance(station.location, team?.location);
            return dist < 0.1; // < 200m
          }).length;

          const isCrowded = nearbyCount >= 3;

          return (
            <Marker
              key={station._id}
              position={station.location}
              icon={isCrowded ? crowdedStationIcon : stationIcon}
            >
              <Popup>
                {station.name}{" "}
                {isCrowded && (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    (Trạm đã đông)
                  </span>
                )}
              </Popup>
            </Marker>
          );
        })}

        {/* ⚠️ Marker đội khác */}
        {otherTeams.map((team) => (
          <Marker
            key={`${team.teamId}-${team.location?.lat}-${team.location?.lng}`}
            position={[team?.location?.lat || 0, team?.location?.lng || 0]}
            icon={otherTeamIcon}
          >
            <Popup>Đội {team?.teamName || "Đội khác"}</Popup>
          </Marker>
        ))}

        <LocateButton />
      </MapContainer>
    </div>
  );
}
