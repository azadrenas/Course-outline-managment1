import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import "./dashboard-layout.css";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="layout">
      <Sidebar role={user.role} />
      <main className="content">{children}</main>
    </div>
  );
}
