import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);

  const token = localStorage.getItem("token");

  // GET ALL COURSES
  useEffect(() => {
    axios
      .get("http://localhost:5000/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ENROLL FUNCTION
  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Enroll failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Trending Courses</h2>

      {courses.map((course) => (
        <div
          key={course._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            width: "250px",
            marginBottom: "10px",
          }}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>Instructor: {course.instructor}</p>
          <p>Price: ₹{course.price}</p>

          {/* ENROLL BUTTON */}
          <button onClick={() => handleEnroll(course._id)}>
            Enroll
          </button>
        </div>
      ))}
    </div>
  );
}

export default Courses;
