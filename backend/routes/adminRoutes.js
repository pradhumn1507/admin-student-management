import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import  protect  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/change-password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.user.id);

  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();
  res.json({ message: 'Password changed successfully' });
});


router.put('/edit-profile-picture',protect, async (req, res) => {
  const { profilePicture } = req.body;
  const admin = await Admin.findByIdAndUpdate(req.user.id, { profilePicture }, { new: true });

  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  res.json({ message: 'Profile picture updated', admin });
});

router.get('/admin-details',protect, async (req, res) => {
  const admin = await Admin.findById(req.user._id).select('-password');

  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  res.json(admin);
});

router.post('/logout', async (_req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;
