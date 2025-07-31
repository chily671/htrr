// components/MapUpdater.js
"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position]);

  return null;
}
