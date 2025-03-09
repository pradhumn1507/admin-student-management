import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
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
  

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
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
  


  router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.  body;
  
      const user = await Admin.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
      });
  
      res.status(200).json({ message: "Reset link sent to email" });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  router.post("/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  console.log(req.body);
      const user = await Admin.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });
  
      if (!user) return res.status(400).json({ message: "Invalid or expired token" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  export default router;
  