const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= USER SCHEMA ================= */
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
});

const User = mongoose.model("User", UserSchema);

/* ================= DEFAULT ADMIN CREATE ================= */
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@mail.com" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await User.create({
        name: "Super Admin",
        email: "admin@mail.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Default admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.log("Admin creation error:", err.message);
  }
};

/* ================= MONGODB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await createAdmin();
  })
  .catch((err) => console.log(err));

/* ================= AUTH MIDDLEWARE ================= */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= ROLE CHECK ================= */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};

/* ================= REGISTER ================= */
/* ❗ Admin register block */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "teacher" ? "teacher" : "student",
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= PROFILE ================= */
app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

/* ================= COURSE SCHEMA ================= */
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  price: Number,

  /* ⭐ OWNER TEACHER */
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Course = mongoose.model("Course", CourseSchema);

/* ================= ADD COURSE ================= */
app.post(
  "/courses",
  authMiddleware,
  allowRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const { title, description, instructor, price } = req.body;

      const course = new Course({
        title,
        description,
        instructor,
        price,
        teacherId: req.userId, // ⭐ important security
      });

      await course.save();

      res.json({ message: "Course added successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ================= GET COURSES ================= */
app.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

/* ================= UPDATE COURSE ================= */
app.put("/courses/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    /* ⭐ only owner teacher or admin */
    if (req.role !== "admin" && course.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json({ message: "Course updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE COURSE ================= */
app.delete("/courses/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    /* ⭐ only owner teacher or admin */
    if (req.role !== "admin" && course.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await course.deleteOne();

    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ENROLLMENT ================= */
const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

/* ================= ENROLL ================= */
app.post("/enroll/:courseId", authMiddleware, async (req, res) => {
  try {
    await Enrollment.create({ userId: req.userId, courseId: req.params.courseId });
    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Already enrolled" });

    res.status(500).json({ error: err.message });
  }
});

/* ================= MY COURSES ================= */
app.get("/my-courses", authMiddleware, async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.userId }).populate("courseId");
  res.json(enrollments.map((e) => e.courseId));
});

/* ================= ADMIN → ALL USERS ================= */
app.get("/admin/users", authMiddleware, allowRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* ================= TEST ================= */
app.get("/", (req, res) => res.send("LearnHub API running..."));

/* ================= SERVER ================= */
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
