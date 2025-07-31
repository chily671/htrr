import { connectDB } from "@/lib/db";
import { Team } from "@/models/Team";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  await connectDB();

  const data = await req.json();
  const { teamId, lat, lng } = data;

  if (!teamId || !lat || !lng) {
    return new Response(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
    });
  }

  // Tìm team và thêm vào history
  const team = await Team.findOneAndUpdate(
    { _id: teamId },
    {
      $set: {
        location: {
          lat,
          lng,
          updatedAt: new Date(),
        },
      },
    },
    { new: true }
  );

  return Response.json(team);
}

export async function GET() {
  await connectDB();
  const cookieStore = await cookies(); // ✅ Await cookies() trước khi dùng
  const teamIdRaw = cookieStore.get("teamId")?.value;
  // replace "" for teamIdRaw
  const teamId = teamIdRaw ? JSON.parse(teamIdRaw) : null;
  // Lấy tất cả vị trí của các team trừ đội hiện tại
  try {
    const locations = await Team.find({ _id: { $ne: teamId } });
    return NextResponse.json(locations || [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
