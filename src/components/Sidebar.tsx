export default function Sidebar() {
  const menuItems = [
    "🏠 Dashboard",
    "📝 Sesizări",
    "👥 Cetățeni",
    "🏛️ Instituții",
    "📊 Rapoarte",
    "⚙️ Setări",
  ];

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
          marginBottom: "40px",
        }}
      >
        ePrimaria
      </h2>

      {menuItems.map((item) => (
        <div
          key={item}
          style={{
            padding: "12px 15px",
            marginBottom: "10px",
            borderRadius: "12px",
            cursor: "pointer",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}