"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Vị trí người dùng:", position);
          // 👉 Nếu cần lưu vị trí vào server thì gọi API ở đây
          router.push("/map");
        },
        (error) => {
          console.error("Không thể lấy vị trí:", error);
          // Tùy bạn có thể redirect luôn hoặc thông báo
        }
      );
    } else {
      console.warn("Trình duyệt không hỗ trợ định vị.");
    }
  }, [user]);

  return (
    <>
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Chào mừng bạn đến với chương trình!
          </h1>
          <p className="text-gray-600 mt-2">
            Vui lòng đăng nhập để bắt đầu hành trình.
          </p>
        </div>
      </main>
    </>
  );
}
