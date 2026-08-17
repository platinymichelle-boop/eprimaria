import { useEffect, useState } from "react";
import type { Citizen } from "../types/citizen";

import { getCurrentUserRole } from "../services/userService";

import {
  createCitizen,
  getCitizens,
  deleteCitizen,
} from "../services/citizensService";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function CitizensPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [showCitizenForm, setShowCitizenForm] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    cnp: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadCitizens();
    loadRole();
  }, []);

  async function loadRole() {
    const currentRole = await getCurrentUserRole();
    setRole(currentRole || "");
  }

  async function loadCitizens() {
    const data = await getCitizens();
    setCitizens(data);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (role !== "super-admin" && role !== "employee") {
      alert("Nu aveți permisiunea de a adăuga cetățeni!");
      return;
    }

    await createCitizen(formData);

    setFormData({
      full_name: "",
      cnp: "",
      email: "",
      phone: "",
      address: "",
    });

    loadCitizens();
  }

  async function handleDelete(id: string) {
    if (role !== "super-admin" && role !== "employee") {
      alert("Nu aveți permisiunea de a șterge!");
      return;
    }
    await deleteCitizen(id);
    loadCitizens();
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{
          color: "#0f172a",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Cetățeni
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Cetățeni</Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {citizens.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <TextField
            fullWidth
            label="Caută cetățean după nume"
            placeholder="Ex: Ion Popescu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Butonul apare doar pentru admini și angajați */}
      {(role === "super-admin" || role === "employee") && (
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowCitizenForm(!showCitizenForm)}
          >
            {showCitizenForm ? "Închide Formular" : "+ Adaugă Cetățean"}
          </Button>
        </Box>
      )}
      {showCitizenForm && (role === "super-admin" || role === "employee") && (
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Nume complet"
                    fullWidth
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        full_name: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="CNP"
                    fullWidth
                    value={formData.cnp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cnp: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Telefon"
                    fullWidth
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Adresă"
                    fullWidth
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button variant="contained" type="submit">
                    Salvează Cetățean
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      <Card
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {role === "super-admin" || role === "employee"
              ? "Registru General Cetățeni"
              : "Director Public Localnici"}
          </Typography>
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fff7ed",
              border: "1px solid #fdba74",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#9a3412",
                fontWeight: 600,
              }}
            >
              ⚠️ MOD DEMO: Toate datele afișate sunt fictive și sunt utilizate
              exclusiv pentru demonstrarea funcționalităților platformei
              ePrimaria. Niciun nume, CNP, adresă, telefon sau adresă de e-mail
              nu aparține unor persoane reale.
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              border: "1px solid #e2e8f0",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#0f172a",
                  }}
                >
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                    Nume
                  </TableCell>

                  {/* Ascundem antetele coloanelor secrete dacă utilizatorul este un cetățean de rând */}
                  {(role === "super-admin" || role === "employee") && (
                    <>
                      <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                        CNP
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                        Telefon
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                        Adresă
                      </TableCell>
                    </>
                  )}

                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                    Acțiuni
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {citizens
                  .filter((citizen) =>
                    citizen.full_name
                      ?.toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .map((citizen) => (
                    <TableRow key={citizen.id} hover>
                      <TableCell>{citizen.full_name}</TableCell>

                      {/* Ascundem datele confidențiale din rânduri pentru utilizatorii de tip cetățean */}
                      {(role === "super-admin" || role === "employee") && (
                        <>
                          <TableCell>{citizen.cnp}</TableCell>
                          <TableCell>{citizen.email}</TableCell>
                          <TableCell>{citizen.phone}</TableCell>
                          <TableCell>{citizen.address}</TableCell>
                        </>
                      )}

                      <TableCell>
                        {role === "super-admin" && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(citizen.id)}
                          >
                            Șterge
                          </Button>
                        )}

                        {role !== "super-admin" && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8", fontStyle: "italic" }}
                          >
                            Fără acțiuni
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
