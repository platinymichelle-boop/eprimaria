import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import DashboardPage from "./pages/DashboardPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import CitizensPage from "./pages/CitizensPage";
import AdminPage from "./pages/AdminPage";

import Sidebar from "./components/Sidebar";

import {
  getCurrentUser,
  getProfile,
} from "./services/authService";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    loadUserRole();
  }, []);

  async function loadUserRole() {
    const {
      data: { user },
    } = await getCurrentUser();

    if (!user) return;

    const { data } = await getProfile(user.id);

    if (data?.role === "super-admin") {
      setIsSuperAdmin(true);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Sidebar onNavigate={setCurrentPage} />

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {currentPage === "dashboard" && (
          <DashboardPage />
        )}

        {currentPage === "complaints" && (
          <ComplaintsPage />
        )}

        {currentPage === "citizens" && (
          <CitizensPage />
        )}

        {currentPage === "admin" &&
          (isSuperAdmin ? (
            <AdminPage />
          ) : (
            <Box sx={{ p: 4 }}>
              Acces interzis.
            </Box>
          ))}
      </Box>
    </Box>
  );
}