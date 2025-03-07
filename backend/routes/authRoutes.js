import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      let admin = await Admin.findOne({ email });
      if (admin) return res.status(400).json({ message: 'Admin already exists' });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      admin = new Admin({ name, email, password: hashedPassword });
      await admin.save();
  
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // Admin Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      admin.lastLogin = new Date();
      await admin.save();

      const token = jwt.sign({ id: admin._id }, process.env.AUTH_SECRET, { expiresIn: '1h' });
      res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email ,lastLogin: admin.lastLogin,} });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  export default router;
  