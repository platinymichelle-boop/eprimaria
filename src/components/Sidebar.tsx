import { useEffect, useState } from "react";
import { Folder } from "@mui/icons-material";

import {
  Dashboard,
  Description,
  People,
  AccountBalance,
  BarChart,
  Settings,
  AdminPanelSettings,
  Newspaper,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { Drawer, IconButton, useMediaQuery } from "@mui/material";

import { getCurrentUser, getProfile, signOut } from "../services/authService";
import { getMunicipalityByUser } from "../services/adminService";

type SidebarProps = {
  onNavigate: (page: string) => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [municipality, setMunicipality] = useState<any>(null);
  const [role, setRole] = useState("");
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await getCurrentUser();

    if (!user) return;

    const { data: profile } = await getProfile(user.id);
    setRole(profile?.role || "");

    const { data } = await getMunicipalityByUser(user.id);
    if (data?.municipalities) {
      setMunicipality(data.municipalities);
    }
  }

  function navigate(page: string) {
    onNavigate(page);
    if (isMobile) {
      setDrawerOpen(false);
    }
  }

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    marginBottom: "8px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#cbd5e1",
    transition: "all 0.2s",
  };

  const sidebarContent = (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#0f172a",
        padding: "20px",
        boxSizing: "border-box",
        borderRight: "1px solid #1e293b",
        position: "relative",
      }}
    >
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#94a3b8",
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <h2
        style={{
          color: "#ffffff",
          marginBottom: "10px",
          marginTop: isMobile ? "20px" : "0px",
        }}
      >
        ePrimaria
      </h2>

      {municipality && (
        <div
          style={{
            marginBottom: "30px",
            padding: "12px",
            background: "#1e293b",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {municipality.name}
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            {municipality.county}
          </div>
        </div>
      )}

      <div
        onClick={() => navigate("dashboard")}
        style={{
          ...menuItemStyle,
          background: "#1e293b",
        }}
      >
        <Dashboard />
        Dashboard
      </div>

      <div onClick={() => navigate("complaints")} style={menuItemStyle}>
        <Description />
        Sesizări
      </div>

      <div onClick={() => navigate("citizens")} style={menuItemStyle}>
        <People />
        Cetățeni
      </div>

      <div onClick={() => navigate("documents")} style={menuItemStyle}>
        <Folder />
        Documente
      </div>

      <div onClick={() => navigate("news")} style={menuItemStyle}>
        <Newspaper />
        Ziar Digital
      </div>

      {role === "super-admin" && (
        <div onClick={() => navigate("admin")} style={menuItemStyle}>
          <AdminPanelSettings />
          Administrare
        </div>
      )}

      {role === "super-admin" && (
        <div onClick={() => navigate("institutions")} style={menuItemStyle}>
          <AccountBalance />
          Instituții
        </div>
      )}

      {/* ASCUNS PENTRU CETĂȚENI: Se randează doar dacă e admin sau angajat public */}
      {(role === "super-admin" || role === "employee") && (
        <div onClick={() => navigate("reports")} style={menuItemStyle}>
          <BarChart />
          Rapoarte
        </div>
      )}

      {/* ASCUNS PENTRU CETĂȚENI: Se randează doar dacă e admin sau angajat public */}
      {(role === "super-admin" || role === "employee") && (
        <div onClick={() => navigate("settings")} style={menuItemStyle}>
          <Settings />
          Setări
        </div>
      )}

      <div
        onClick={async () => {
          await signOut();
          window.location.reload();
        }}
        style={{
          ...menuItemStyle,
          marginTop: "30px",
          background: "#7f1d1d",
          color: "white",
        }}
      >
        Ieșire din cont
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 2000,
            backgroundColor: "#0f172a",
            color: "white",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#1e293b",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  return sidebarContent;
}
