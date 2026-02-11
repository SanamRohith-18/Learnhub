import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/courses");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔹 Add Course
  const addCourse = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/courses",
        { title, description, instructor, price },
        { headers: { Authorization: token } }
      );

      alert("Course added successfully ✅");

      setTitle("");
      setDescription("");
      setInstructor("");
      setPrice("");

      fetchCourses();
    } catch (err) {
      alert("Only teacher/admin can add course ❌");
    }
  };

  // 🔹 Enroll course (testing)
  const enrollCourse = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/enroll/${id}`,
        {},
        { headers: { Authorization: token } }
      );

      alert("Enrolled successfully 🎉");
    } catch {
      alert("Already enrolled or error ❌");
    }
  };

  // 🔹 Delete course
  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`, {
        headers: { Authorization: token },
      });

      alert("Course deleted 🗑️");
      fetchCourses();
    } catch {
      alert("Delete failed ❌");
    }
  };

  // 🔹 Search filter
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        Teacher Dashboard
      </motion.h2>

      {/* TOTAL COUNT */}
      <p className="mb-6">
        Total Courses: <b>{courses.length}</b>
      </p>

      {/* ADD COURSE FORM */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Course</h3>

        <form onSubmit={addCourse} className="grid gap-3 md:grid-cols-2">
          <input
            className="border p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />

          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-2 md:col-span-2 hover:bg-blue-700"
          >
            Add Course
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Search Courses</h3>
        <input
          className="border p-2 rounded w-full"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* COURSE LIST */}
      <h3 className="text-xl font-semibold mb-4">All Courses</h3>

      {filteredCourses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c) => (
            <div
              key={c._id}
              className="bg-white shadow-md rounded-2xl p-4 space-y-2"
            >
              <h4 className="text-lg font-bold">{c.title}</h4>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-sm">Instructor: {c.instructor}</p>
              <p className="font-semibold">₹{c.price}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => enrollCourse(c._id)}
                  className="flex-1 bg-green-600 text-white rounded p-2 hover:bg-green-700"
                >
                  Enroll
                </button>

                <button
                  onClick={() => deleteCourse(c._id)}
                  className="flex-1 bg-red-600 text-white rounded p-2 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
