import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.header}>
      <div>
        <strong>{user?.name}</strong>
        <span style={styles.role}>({user?.role})</span>
      </div>

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  header: {
    height: "60px",
    background: "#f5f5f5",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
  },
  role: {
    marginLeft: "8px",
    fontSize: "13px",
    color: "#666",
  },
  logout: {
    padding: "8px 14px",
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
  },
};
