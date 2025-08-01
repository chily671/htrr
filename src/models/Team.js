import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Lịch sử các trạm đã đi qua
  stationHistory: [
    {
      station: { type: mongoose.Schema.Types.ObjectId, ref: "Station" },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  // Vị trí hiện tại của đội
  location: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date },
  },
  currentToken: {
    type: String,
    default: null,
  },

  // Thời gian tạo team
  createdAt: { type: Date, default: Date.now },
});
export const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
