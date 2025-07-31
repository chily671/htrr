"use client";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function StationFormDrawer({ coords, onCreated, onClose }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch('/api/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lat: coords.lat, lng: coords.lng })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      onCreated(data);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Tạo Trạm mới</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Tên trạm</Label>
        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <p>Tọa độ: {coords?.lat.toFixed(5)}, {coords?.lng.toFixed(5)}</p>
      <Button onClick={handleCreate} disabled={loading}>
        {loading ? "Đang tạo..." : "Tạo trạm"}
      </Button>
      <Button variant="ghost" onClick={onClose}>Hủy</Button>
    </div>
  );
}
