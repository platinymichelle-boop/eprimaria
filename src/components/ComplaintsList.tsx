import { useEffect, useState } from "react";
import { getComplaints } from "../services/complaintsService";

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const { data, error } = await getComplaints();

    if (error) {
      console.error(error);
      return;
    }

    setComplaints(data || []);
  };

  return (
    <div
      style={{
        marginTop: "30px",
      }}
    >
      <h2>Lista sesizări</h2>

      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "15px",
            borderRadius: "12px",
            marginTop: "10px",
          }}
        >
          <h3>{complaint.title}</h3>
          <p>{complaint.description}</p>
          <small>Status: {complaint.status}</small>
        </div>
      ))}
    </div>
  );
}