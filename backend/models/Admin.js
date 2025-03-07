// backend/models/Admin.js
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  profilePicture: { type: String, required: true, unique: true },
});

export default mongoose.model('Admin', AdminSchema);


