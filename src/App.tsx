import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import DocumentsPage from "./pages/DocumentsPage";
import NewspaperTemplate from "./pages/NewspaperTemplate";
import DashboardPage from "./pages/DashboardPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import CitizensPage from "./pages/CitizensPage";
import AdminPage from "./pages/AdminPage";
import InstitutionsPage from "./pages/InstitutionsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

import Sidebar from "./components/Sidebar";

import { getCurrentUser, getProfile } from "./services/authService";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const {
        data: { user },
      } = await getCurrentUser();

      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      const { data } = await getProfile(user.id);

      if (data?.role === "super-admin") {
        setIsSuperAdmin(true);
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Se încarcă...
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
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
        {currentPage === "dashboard" && <DashboardPage />}

        {currentPage === "complaints" && <ComplaintsPage />}

        {currentPage === "citizens" && <CitizensPage />}

        {currentPage === "documents" && <DocumentsPage />}

        {currentPage === "news" && <NewspaperTemplate />}

        {currentPage === "reports" && <ReportsPage />}

        {currentPage === "settings" && <SettingsPage />}

        {currentPage === "admin" &&
          (isSuperAdmin ? (
            <AdminPage />
          ) : (
            <Box sx={{ p: 4 }}>Acces interzis.</Box>
          ))}

        {currentPage === "institutions" &&
          (isSuperAdmin ? (
            <InstitutionsPage />
          ) : (
            <Box sx={{ p: 4 }}>Acces interzis.</Box>
          ))}
      </Box>
    </Box>
  );
}
