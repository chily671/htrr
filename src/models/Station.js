import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: { type: String },
});

export default mongoose.models.Station || mongoose.model('Station', StationSchema);
