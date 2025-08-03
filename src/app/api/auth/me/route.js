// src/app/api/auth/me/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { Team } from "@/models/Team";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "No token" }), {
        status: 401,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const team = await Team.findById(decoded.teamId);

      if (!team)
        return new Response(JSON.stringify({ message: "Not found" }), {
          status: 404,
        });

      // 🔐 So sánh token hiện tại với token trong DB
      if (team.token !== token) {
        return new Response(JSON.stringify({ message: "Session expired" }), {
          status: 403,
        });
      }

      let InfoTeam = {
        _id: team._id,
        teamName: team.teamName,
        email: team.email,
      };
      return NextResponse.json(InfoTeam, { status: 200 });
    } catch (error) {
      console.error("Lỗi khi xác thực:", error);
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đội chơi:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
