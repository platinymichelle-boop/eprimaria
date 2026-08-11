import { useState } from "react";
import { createComplaint } from "../services/complaintsService";

export default function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const { error } = await createComplaint(
      title,
      description
    );

    if (error) {
      alert(error.message);
      return;
    }

    alert("Sesizare trimisă!");

    setTitle("");
    setDescription("");
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.1)",
        padding: "20px",
        borderRadius: "20px",
        marginTop: "20px",
      }}
    >
      <h2>Sesizare nouă</h2>

      <input
        type="text"
        placeholder="Titlu sesizare"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "none",
          boxSizing: "border-box",
        }}
      />

      <textarea
        placeholder="Descriere"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "15px",
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Trimite sesizarea
      </button>
    </div>
  );
}