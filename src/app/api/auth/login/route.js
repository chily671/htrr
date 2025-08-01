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
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, team.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
  if (team.currentToken) {
    try {
      // Thử verify token cũ
      jwt.verify(team.currentToken, process.env.JWT_SECRET);
      // Nếu verify không lỗi => vẫn còn hạn => từ chối login
      return NextResponse.json(
        { message: "Tài khoản đã đăng nhập trên thiết bị khác." },
        { status: 403 }
      );
    } catch (err) {
      // Nếu token cũ đã hết hạn => cho phép login tiếp
    }
  }

  // Tạo token mới
  const token = jwt.sign({ teamId: team._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // ✅ Cập nhật token vào DB
  team.currentToken = token;
  await team.save();

  return NextResponse.json({
    token,
    teamName: team.teamName,
    teamId: team._id,
  });
}
