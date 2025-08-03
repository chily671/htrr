import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  const { teamName, password } = await req.json();

  const team = await Team.findOne({ teamName });
  if (!team) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, team.password);
  if (!isMatch) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // Tạo token mới
  const token = jwt.sign({ teamId: team._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Ghi đè token cũ => tự động "logout" thiết bị cũ
  team.currentToken = token;
  await team.save();

  return NextResponse.json({
    token,
    teamName: team.teamName, 
    teamId: team._id,
  });
}
