import { useState } from "react";
import { motion } from "framer-motion";
import { signUp, signIn } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSignUp = async () => {
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Cont creat!");
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
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "4rem",
          }}
        >
          ePrimaria
        </motion.h1>

        <p
          style={{
            textAlign: "center",
            color: "#dbeafe",
            marginTop: 0,
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
              color: isLogin ? "white" : "black",
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
              color: !isLogin ? "white" : "black",
            }}
          >
            Register
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
            fontSize: "18px",
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
            marginBottom: "20px",
            fontSize: "18px",
            boxSizing: "border-box",
          }}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={isLogin ? handleLogin : handleSignUp}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "15px",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {isLogin ? "Conectare" : "Creează cont"}
        </motion.button>
      </motion.div>
    </div>
  );
}
