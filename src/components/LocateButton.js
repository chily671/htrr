import { useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { LocateIcon } from "lucide-react";

const LocateButton = () => {
  const map = useMap();

  const handleClick = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 16); // zoom 16 là gần
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí:", error);
        alert("Không thể lấy vị trí hiện tại");
      }
    );
  };

  return (
    <Button
      className="absolute top-4 right-4 z-[1000] shadow-md rounded-full p-2"
      onClick={handleClick}
      variant="outline"
    >
      <LocateIcon className="w-4 h-4 mr-2" />
      Vị trí của tôi
    </Button>
  );
};

export default LocateButton;
