// utils/authCheck.js
import { Team } from "@/models/Team";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

export async function verifyToken(req) {
  await connectDB();
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const team = await Team.findById(decoded.teamId);

    // ❌ Nếu token không khớp với currentToken => bị đá
    if (!team || team.currentToken !== token) return null;

    return team;
  } catch (err) {
    return null;
  }
}
