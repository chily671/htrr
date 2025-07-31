import { connectDB } from "@/lib/db";
import Station from "@/models/Station";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const body = await req.json();
  const updated = await Station.findByIdAndUpdate(id, body, { new: true });
  return Response.json(updated);
}

export async function DELETE(_, { params }) {
  await connectDB();
  const { id } = params;
  await Station.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}
