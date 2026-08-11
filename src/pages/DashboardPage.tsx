import Sidebar from "../components/Sidebar";

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "10px",
          }}
        >
          ePrimaria Dashboard
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "40px",
          }}
        >
          Platformă digitală pentru administrația publică locală.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            { title: "Sesizări Noi", value: "0" },
            { title: "În Lucru", value: "0" },
            { title: "Rezolvate", value: "0" },
            { title: "Cetățeni", value: "0" },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "25px",
              }}
            >
              <h3>{card.title}</h3>

              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}