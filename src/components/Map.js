'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Sửa lỗi hình ảnh marker không hiển thị
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Icon tùy chỉnh cho đội chơi
const teamIcon = new L.Icon({
  iconUrl: '/team-icon.png', // Bạn cần đảm bảo file này tồn tại trong public/
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Icon tùy chỉnh cho trạm
const stationIcon = new L.Icon({
  iconUrl: '/station-icon.png', // Bạn cần đảm bảo file này tồn tại trong public/
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function Map() {
  const [teamPosition, setTeamPosition] = useState(null);
  const [stations, setStations] = useState([
    { id: 1, name: 'Trạm 1', position: [10.762622, 106.660172] },
    { id: 2, name: 'Trạm 2', position: [10.763, 106.663] },
  ]);

  // Lấy vị trí GPS thật từ thiết bị
  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setTeamPosition([latitude, longitude]);
      },
      (error) => {
        console.error('Lỗi lấy GPS:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const center = teamPosition || [10.762622, 106.660172];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {/* Marker cho đội chơi */}
        {teamPosition && (
          <Marker position={teamPosition} icon={teamIcon}>
            <Popup>Vị trí của bạn</Popup>
          </Marker>
        )}

        {/* Marker cho các trạm */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={station.position}
            icon={stationIcon}
          >
            <Popup>{station.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
