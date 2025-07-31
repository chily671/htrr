"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext"; // bạn phải tạo và cung cấp AuthContext
import Image from "next/image";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function MapPage() {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [confirmTeam, setConfirmTeam] = useState(false);

 useEffect(() => {
  if (!user) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(newLocation);

        // Gửi dữ liệu về backend
        try {
          await fetch('/api/location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              teamId: user._id,
              lat: newLocation.lat,
              lng: newLocation.lng,
              timestamp: new Date().toISOString(), // Định dạng chuẩn ISO
            }),
          });
        } catch (error) {
          console.error("Lỗi khi gửi vị trí về backend:", error);
        }
      },
      (err) => {
        console.error("Vị trí bị từ chối hoặc lỗi:", err);
      }
    );
  }
}, [user]);


  if (!user) return <p>Bạn cần đăng nhập để xem bản đồ.</p>;
  if (!location) return <p>Đang lấy vị trí hiện tại...</p>;

  return (
    <div>
      {!confirmTeam ? (
        <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
          <h1 className="text-xl font-semibold">
            Bạn có muốn xác nhận vị trí hiện tại của đội{" "}
            <span className="text-blue-600">{user.teamName}</span> không?
          </h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setConfirmTeam(true)}
          >
            Xác nhận
          </button>
        </div>
      ) : (
        <Map userLocation={location} teamId={user.teamId} />
      )}
    </div>
  );
}
