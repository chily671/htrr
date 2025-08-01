import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  await connectDB();

  // Lấy token từ header hoặc cookie
  const cookieStore = await cookies(); // ✅ Await cookies() trước khi dùng
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const team = await Team.findById(decoded.teamId);
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Kiểm tra token hiện tại có khớp không
    if (team.currentToken !== token) {
      return NextResponse.json({ message: "Token mismatch" }, { status: 403 });
    }

    // ✅ Xoá token để đăng xuất
    team.currentToken = null;
    await team.save();

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
