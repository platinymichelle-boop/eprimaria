import ComplaintForm from "../components/ComplaintForm";
import ComplaintsList from "../components/ComplaintsList";

export default function ComplaintsPage() {
  return (
    <div
      style={{
        padding: "30px",
        color: "white",
      }}
    >
      <h1>Sesizări</h1>

      <p>
        Gestionarea sesizărilor cetățenilor.
      </p>

      <ComplaintForm />

      <ComplaintsList />
    </div>
  );
}