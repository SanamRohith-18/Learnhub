import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

import Navbar from "./components/Navbar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>

        {/* 🏠 Home page */}
        <Route path="/" element={<Home />} />

        {/* 🌐 Public routes (NO Navbar) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected routes */}
        {token ? (
          <>
            <Route
              path="/courses"
              element={
                <>
                  <Navbar />
                  <Courses />
                </>
              }
            />

            <Route
              path="/my-courses"
              element={
                <>
                  <Navbar />
                  <MyCourses />
                </>
              }
            />

            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />

            {/* 👩‍🏫 Teacher */}
            <Route
              path="/teacher"
              element={
                <>
                  <Navbar />
                  <TeacherDashboard />
                </>
              }
            />

            {/* 👑 Admin */}
            <Route
              path="/admin"
              element={
                <>
                  <Navbar />
                  <AdminDashboard />
                </>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

        {/* ❌ Unknown route fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
