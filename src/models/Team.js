import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stationHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Station' }]
})

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema)
