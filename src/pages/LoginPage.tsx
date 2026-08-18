import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signUp, signIn } from "../services/authService";
import { supabase } from "../services/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [county, setCounty] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");

  const [counties, setCounties] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);

  useEffect(() => {
    loadMunicipalities();
  }, []);

  async function loadMunicipalities() {
    const { data, error } = await supabase
      .from("municipalities")
      .select("*")
      .order("county");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!data) return;

    setMunicipalities(data);

    const uniqueCounties = [...new Set(data.map((x) => x.county))].sort();

    setCounties(uniqueCounties as string[]);
  }

  const handleSignUp = async () => {
    if (!municipalityId) {
      alert("Selectează localitatea.");
      return;
    }

    const { error } = await signUp(email, password, municipalityId);

    if (error) {
      alert(error.message);
      return;
    }

    const { error: loginError } = await signIn(email, password);

    if (loginError) {
      alert(loginError.message);
      return;
    }

    window.location.reload();
  };

  const handleLogin = async () => {
    const { error } = await signIn(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "450px",
          padding: "40px",
          borderRadius: "25px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "4rem",
          }}
        >
          ePrimaria
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#dbeafe",
            marginBottom: "30px",
          }}
        >
          Cetățeanul conectat la primărie
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: isLogin ? "#2563eb" : "#d1d5db",
            }}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: !isLogin ? "#2563eb" : "#d1d5db",
            }}
          >
            Înregistrare
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "15px",
            border: "none",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "15px",
            border: "none",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        {!isLogin && (
          <>
            <select
              value={county}
              onChange={(e) => {
                setCounty(e.target.value);
                setMunicipalityId("");
              }}
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "15px",
                marginBottom: "15px",
              }}
            >
              <option value="">Selectează județul</option>

              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>

            <select
              value={municipalityId}
              onChange={(e) => setMunicipalityId(e.target.value)}
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "15px",
                marginBottom: "15px",
              }}
            >
              <option value="">Selectează localitatea</option>

              {municipalities
                .filter((m) => m.county === county)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
            </select>
          </>
        )}

        <button
          onClick={isLogin ? handleLogin : handleSignUp}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {isLogin ? "Conectare" : "Creează cont"}
        </button>
      </motion.div>
    </div>
  );
}
