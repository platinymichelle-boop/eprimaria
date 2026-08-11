type SidebarProps = {
  onNavigate: (page: string) => void;
};

export default function Sidebar({
  onNavigate,
}: SidebarProps) {
  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "40px",
        }}
      >
        ePrimaria
      </h2>

      <div
        onClick={() => onNavigate("dashboard")}
        style={{
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "12px",
          cursor: "pointer",
          background: "rgba(255,255,255,0.08)",
          color: "white",
        }}
      >
        🏠 Dashboard
      </div>

      <div
        onClick={() => onNavigate("complaints")}
        style={{
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "12px",
          cursor: "pointer",
          background: "rgba(255,255,255,0.08)",
          color: "white",
        }}
      >
        📝 Sesizări
      </div>

      <div
        style={{
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.04)",
          color: "#cbd5e1",
        }}
      >
        👥 Cetățeni
      </div>

      <div
        style={{
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.04)",
          color: "#cbd5e1",
        }}
      >
        🏛️ Instituții
      </div>

      <div
        style={{
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.04)",
          color: "#cbd5e1",
        }}
      >
        📊 Rapoarte
      </div>

      <div
        style={{
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.04)",
          color: "#cbd5e1",
        }}
      >
        ⚙️ Setări
      </div>
    </div>
  );
}