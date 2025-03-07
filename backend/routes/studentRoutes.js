import express from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import  protect  from '../middlewares/authMiddleware.js';
const router = express.Router();

// Create Student
router.post('/', protect, async (req, res) => {
  const { name, email, password, phone, qualification, gender, profileImage } = req.body;
  try {
    let student = await Student.findOne({ email });
    if (student) return res.status(400).json({ message: 'Student already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({ name, email, password: hashedPassword, phone, qualification, gender, profileImage });
    await student.save();

    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all students
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


// Update student
router.put('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});



export default router;