'use client'

import { useState, useEffect } from 'react'

export default function StationPage() {
  const [name, setName] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [stations, setStations] = useState([])

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      window.location.href = '/admin/login'
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newStation = { name, lat, lng }
    setStations([...stations, newStation])
    setName('')
    setLat('')
    setLng('')
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thêm Trạm</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tên trạm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Vĩ độ (lat)"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Kinh độ (lng)"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white py-2 rounded">
          Thêm trạm
        </button>
      </form>

      <h2 className="text-xl mt-8">Danh sách trạm</h2>
      <ul className="list-disc pl-5 mt-2">
        {stations.map((station, idx) => (
          <li key={idx}>
            {station.name} – ({station.lat}, {station.lng})
          </li>
        ))}
      </ul>
    </div>
  )
}
