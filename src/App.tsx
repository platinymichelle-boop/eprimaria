import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar onNavigate={setCurrentPage} />

      <div style={{ flex: 1 }}>
        {currentPage === "dashboard" && <DashboardPage />}
        {currentPage === "complaints" && <ComplaintsPage />}
      </div>
    </div>
  );
}