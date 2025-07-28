'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Sửa lỗi marker không hiển thị
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({ gpsData }) {
  const [center, setCenter] = useState([10.762622, 106.660172]); // mặc định trung tâm Sài Gòn

  useEffect(() => {
    if (gpsData?.length > 0) {
      setCenter(gpsData[0].position);
    }
  }, [gpsData]);

  return (
    <MapContainer center={center} zoom={15} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
      />
      {gpsData.map((team, idx) => (
        <Marker key={idx} position={team.position}>
          <Popup>Đội {team.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
