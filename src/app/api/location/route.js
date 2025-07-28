import { connectDB } from '@/lib/db'
import TeamLocation from '@/models/Team'

export async function POST(req) {
  await connectDB()
  const data = await req.json()
  const { teamName, lat, lng } = data

  if (!teamName || !lat || !lng) {
    return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 })
  }

  // Cập nhật hoặc tạo mới vị trí
  const updated = await TeamLocation.findOneAndUpdate(
    { teamName },
    { lat, lng, updatedAt: new Date() },
    { upsert: true, new: true }
  )

  return Response.json(updated)
}

export async function GET() {
  await connectDB()
  const locations = await TeamLocation.find()
  return Response.json(locations)
}
