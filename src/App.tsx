import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DocumentsPage from "./pages/DocumentsPage";
import NewspaperTemplate from "./pages/NewspaperTemplate";

import DashboardPage from "./pages/DashboardPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import CitizensPage from "./pages/CitizensPage";
import AdminPage from "./pages/AdminPage";
import InstitutionsPage from "./pages/InstitutionsPage";

// ADĂUGAT: Importul noilor pagini pentru Rapoarte și Setări
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

import Sidebar from "./components/Sidebar";

import { getCurrentUser, getProfile } from "./services/authService";

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
        {currentPage === "dashboard" && <DashboardPage />}

        {currentPage === "complaints" && <ComplaintsPage />}

        {currentPage === "citizens" && <CitizensPage />}

        {currentPage === "documents" && <DocumentsPage />}

        {/* Ziarul Digital în stil clasic */}
        {currentPage === "news" && <NewspaperTemplate />}

        {/* ADĂUGAT: Randarea paginii de Rapoarte */}
        {currentPage === "reports" && <ReportsPage />}

        {/* ADĂUGAT: Randarea paginii de Setări */}
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
