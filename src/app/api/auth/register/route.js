import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Team } from '@/models/Team'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  await connectDB()
  const { teamName, password } = await req.json()

  const existingTeam = await Team.findOne({ teamName })
  if (existingTeam) {
    return NextResponse.json({ message: 'Team already exists' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newTeam = new Team({ teamName, password: hashedPassword })
  await newTeam.save()

  return NextResponse.json({ message: 'Team registered successfully' })
}
