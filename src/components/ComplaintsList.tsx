import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { getCurrentUserRole } from "../services/userService";
import {
  getComplaints,
  updateComplaintStatus,
} from "../services/complaintsService";

interface ComplaintPhoto {
  photo_url: string;
}

interface Complaint {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  address?: string;
  status: string; // CORELAT: Va primi valorile exact ca în DB: 'new', 'in_progress', 'resolved'
  created_at: string;
  complaint_photos?: ComplaintPhoto[];
}

const categories = [
  "Toate",
  "Drumuri",
  "Iluminat Public",
  "Salubritate",
  "Spații Verzi",
  "Parcuri",
  "Trafic",
  "Parcări",
  "Altele",
];

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [role, setRole] = useState<string>("");
  const [photosDialog, setPhotosDialog] = useState<boolean>(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("Toate");

  useEffect(() => {
    loadComplaints();
    loadRole();
  }, []);

  async function loadRole() {
    const currentRole = await getCurrentUserRole();
    setRole(currentRole || "");
  }

  async function loadComplaints() {
    const { data, error } = await getComplaints();
    if (error) {
      console.error(error);
      return;
    }
    setComplaints((data as Complaint[]) || []);
  }

  // CORELAT PERFECT CU SUPABASE: Verifică string-urile exacte din poza ta
  const getStatusColor = (
    status: string,
  ): "success" | "warning" | "info" | "error" => {
    switch (status) {
      case "resolved":
        return "success"; // Verde pentru resolved
      case "in_progress":
        return "warning"; // Portocaliu pentru in_progress
      case "new":
        return "info"; // Albastru pentru new
      default:
        return "error";
    }
  };

  // Afișează textul tradus în aplicație pentru utilizatori
  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "Nouă";
      case "in_progress":
        return "În lucru";
      case "resolved":
        return "Rezolvată";
      default:
        return status;
    }
  };

  const getPriorityColor = (
    priority: string,
  ): "success" | "warning" | "error" => {
    switch (priority) {
      case "Mică":
        return "success";
      case "Urgentă":
        return "error";
      default:
        return "warning";
    }
  };

  // CORELAT: Schimbă statusul pas cu pas folosind valorile din baza ta de date
  const getNextStatus = (status: string) => {
    switch (status) {
      case "new":
        return "in_progress";
      case "in_progress":
        return "resolved";
      default:
        return "resolved";
    }
  };

  async function handleStatusChange(id: string, currentStatus: string) {
    const nextStatus = getNextStatus(currentStatus);
    const { error } = await updateComplaintStatus(id, nextStatus);

    if (error) {
      alert(error.message);
      return;
    }

    loadComplaints();
  }

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title?.toLowerCase().includes(search.toLowerCase()) ||
        complaint.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "Toate"
          ? true
          : complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, search, statusFilter, categoryFilter]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Caută sesizare"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
        />

        {/* CORELAT: Meniul de filtrare trimite acum valorile corecte către filtru (new, in_progress, resolved) */}
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">Toate</MenuItem>
          <MenuItem value="new">Noi</MenuItem>
          <MenuItem value="in_progress">În lucru</MenuItem>
          <MenuItem value="resolved">Rezolvate</MenuItem>
        </TextField>

        <TextField
          select
          label="Categorie"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #e2e8f0",
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0f172a" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Titlu
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Categorie
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Prioritate
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Adresă
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Poze
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Data
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                Acțiuni
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredComplaints.map((complaint) => (
              <TableRow key={complaint.id} hover>
                <TableCell>{complaint.title}</TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>
                  <Chip
                    label={complaint.priority || "Normală"}
                    color={getPriorityColor(complaint.priority || "Normală")}
                  />
                </TableCell>
                <TableCell>{complaint.address}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(complaint.status)}
                    color={getStatusColor(complaint.status)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip
                      size="small"
                      color="primary"
                      label={`📷 ${complaint.complaint_photos?.length || 0}`}
                    />
                    {(complaint.complaint_photos?.length || 0) > 0 && (
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedPhotos(
                            complaint.complaint_photos!.map(
                              (photo) => photo.photo_url,
                            ),
                          );
                          setPhotosDialog(true);
                        }}
                      >
                        Vezi
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(complaint.created_at).toLocaleDateString("ro-RO")}
                </TableCell>
                <TableCell>
                  {/* CORELAT: Butonul acționează corect în funcție de rol și de statusul din DB */}
                  {(role === "super-admin" ||
                    role === "admin" ||
                    role === "operator") &&
                    complaint.status !== "resolved" && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleStatusChange(complaint.id, complaint.status)
                        }
                      >
                        {complaint.status === "new"
                          ? "Preia în lucru"
                          : "Rezolvă"}
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={photosDialog}
        onClose={() => setPhotosDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Poze Sesizare</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {selectedPhotos.map((url, idx) => (
              <Box
                key={idx}
                component="img"
                src={url}
                alt={`Foto ${idx + 1}`}
                sx={{
                  maxWidth: "100%",
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
