'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function LocationDialog({ open, onConfirm }) {
  const [coords, setCoords] = useState(null)

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setCoords({ latitude, longitude })
          onConfirm({ latitude, longitude }) // gửi lên parent
        },
        error => {
          console.error('Error getting location:', error)
          onConfirm(null)
        }
      )
    } else {
      alert('Trình duyệt không hỗ trợ định vị')
      onConfirm(null)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chia sẻ vị trí hiện tại</DialogTitle>
        </DialogHeader>
        <p>Vui lòng cho phép truy cập vị trí để hiển thị trên bản đồ</p>
        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={() => onConfirm(null)} variant="secondary">Từ chối</Button>
          <Button onClick={handleShareLocation}>Cho phép</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
