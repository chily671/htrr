import { connectDB } from "@/lib/db";
import Station from "@/models/Station";

export async function GET() {
  await connectDB();
  const stations = await Station.find();
  return Response.json(stations);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { name, lat, lng, description } = body;
  if (!name || !lat || !lng) {
    return new Response(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
    });
  }

  const newStation = await Station.create({
    name,
    location: { lat, lng },
    description,
  });
  return Response.json(newStation);
}
