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
    const currentRole =
      await getCurrentUserRole();

    setRole(currentRole || "");
  }

  async function loadCitizens() {
    const data = await getCitizens();
    setCitizens(data);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

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

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Adaugă Cetățean
          </Typography>

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
                <Button
                  variant="contained"
                  type="submit"
                >
                  Adaugă Cetățean
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Listă Cetățeni
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nume</TableCell>
                  <TableCell>CNP</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Adresă</TableCell>
                  <TableCell>Acțiuni</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {citizens.map((citizen) => (
                  <TableRow key={citizen.id}>
                    <TableCell>
                      {citizen.full_name}
                    </TableCell>

                    <TableCell>
                      {citizen.cnp}
                    </TableCell>

                    <TableCell>
                      {citizen.email}
                    </TableCell>

                    <TableCell>
                      {citizen.phone}
                    </TableCell>

                    <TableCell>
                      {citizen.address}
                    </TableCell>

                    <TableCell>
                      {role ===
                        "super-admin" && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleDelete(
                              citizen.id
                            )
                          }
                        >
                          Șterge
                        </Button>
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