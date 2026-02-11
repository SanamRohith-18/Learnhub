import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        background: "black",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <h2 style={{ margin: 0 }}>LearnHub</h2>

      {/* Right side links */}
      {token && (
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Link to="/courses" style={{ color: "white", textDecoration: "none" }}>
            Courses
          </Link>

          {/* 🔥 NEW → My Courses */}
          <Link to="/my-courses" style={{ color: "white", textDecoration: "none" }}>
            My Courses
          </Link>

          <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
            Profile
          </Link>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
