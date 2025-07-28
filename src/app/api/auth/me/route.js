// src/app/api/auth/me/route.js
import { connectDB } from '@/lib/db'
import { Team } from '@/models/Team'
import jwt from 'jsonwebtoken'

export async function GET(req) {
  await connectDB()
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return new Response(JSON.stringify({ message: 'No token' }), { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const team = await Team.findById(decoded.teamId)

    if (!team) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })

    return new Response(JSON.stringify({
      _id: team._id,
      teamName: team.teamName,
      email: team.email,
    }))
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 403 })
  }
}
