import { useEffect, useState } from "react";
import axios from "axios";

function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/my-courses", {
          headers: { Authorization: token },
        });

        setCourses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Courses</h2>

      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {courses.map((course) => (
            <div
              key={course._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                width: "250px",
                borderRadius: "8px",
              }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><b>Instructor:</b> {course.instructor}</p>
              <p><b>Price:</b> ₹{course.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
