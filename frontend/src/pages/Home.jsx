import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>LearnHub</h1>

        <p style={styles.subtitle}>
          Your smart online learning platform.  
          Explore courses, learn new skills, and grow your career.
        </p>

        <div style={styles.buttons}>
          <Link to="/login">
            <button style={styles.loginBtn}>Login</button>
          </Link>

          <Link to="/register">
            <button style={styles.registerBtn}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "380px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "40px",
    marginBottom: "10px",
    color: "#0f2027",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "25px",
    color: "#555",
  },
  buttons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  loginBtn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#0f2027",
    color: "white",
    cursor: "pointer",
  },
  registerBtn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#2c5364",
    color: "white",
    cursor: "pointer",
  },
};

export default Home;
