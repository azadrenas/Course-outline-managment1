import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SIDEBAR_MENU } from "../../constants/sidebarMenu";
import "./sidebar.css";

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menu = SIDEBAR_MENU[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">FIU System</h2>

      <nav>
        {menu.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
