import { useEffect, useState } from "react";

import {
  Dashboard,
  Description,
  People,
  AccountBalance,
  BarChart,
  Settings,
  AdminPanelSettings,
} from "@mui/icons-material";

import { getCurrentUser } from "../services/authService";
import { getMunicipalityByUser } from "../services/adminService";

type SidebarProps = {
  onNavigate: (page: string) => void;
};

export default function Sidebar({
  onNavigate,
}: SidebarProps) {
  const [municipality, setMunicipality] =
    useState<any>(null);

  useEffect(() => {
    loadMunicipality();
  }, []);

  async function loadMunicipality() {
    const {
      data: { user },
    } = await getCurrentUser();

    if (!user) return;

    const { data } =
      await getMunicipalityByUser(user.id);

    if (data?.municipalities) {
      setMunicipality(data.municipalities);
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

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#0f172a",
        padding: "20px",
        boxSizing: "border-box",
        borderRight: "1px solid #1e293b",
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          marginBottom: "10px",
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
        onClick={() => onNavigate("dashboard")}
        style={{
          ...menuItemStyle,
          background: "#1e293b",
        }}
      >
        <Dashboard />
        Dashboard
      </div>

      <div
        onClick={() => onNavigate("complaints")}
        style={menuItemStyle}
      >
        <Description />
        Sesizări
      </div>

      <div
        onClick={() => onNavigate("citizens")}
        style={menuItemStyle}
      >
        <People />
        Cetățeni
      </div>

      <div
        onClick={() => onNavigate("admin")}
        style={menuItemStyle}
      >
        <AdminPanelSettings />
        Administrare
      </div>

      <div style={menuItemStyle}>
        <AccountBalance />
        Instituții
      </div>

      <div style={menuItemStyle}>
        <BarChart />
        Rapoarte
      </div>

      <div style={menuItemStyle}>
        <Settings />
        Setări
      </div>
    </div>
  );
}