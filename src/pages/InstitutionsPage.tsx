import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  getMunicipalities,
  createMunicipality,
  deleteMunicipality,
} from "../services/municipalitiesService";

export default function InstitutionsPage() {
  const [municipalities, setMunicipalities] =
    useState<any[]>([]);

  const [name, setName] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    loadMunicipalities();
  }, []);

  async function loadMunicipalities() {
    const { data, error } =
      await getMunicipalities();

    if (error) {
      console.error(error);
      return;
    }

    setMunicipalities(data || []);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const { error } =
      await createMunicipality(
        name,
        county,
        city
      );

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setCounty("");
    setCity("");

    loadMunicipalities();
  }

  async function handleDelete(id: string) {
    const { error } =
      await deleteMunicipality(id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMunicipalities();
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        Instituții
      </Typography>

      <Typography
        sx={{
          color: "#64748b",
          mb: 4,
        }}
      >
        Administrarea primăriilor din platformă.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Primării
              </Typography>

              <Typography>
                {municipalities.length} instituții
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Adaugă Instituție
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Denumire"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Județ"
                      value={county}
                      onChange={(e) =>
                        setCounty(e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Localitate"
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                    >
                      Adaugă Instituție
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
                Lista Instituțiilor
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Denumire
                      </TableCell>

                      <TableCell>
                        Județ
                      </TableCell>

                      <TableCell>
                        Localitate
                      </TableCell>

                      <TableCell>
                        Acțiuni
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {municipalities.map(
                      (municipality) => (
                        <TableRow
                          key={municipality.id}
                        >
                          <TableCell>
                            {municipality.name}
                          </TableCell>

                          <TableCell>
                            {municipality.county}
                          </TableCell>

                          <TableCell>
                            {municipality.city}
                          </TableCell>

                          <TableCell>
                            <Button
                              color="error"
                              variant="contained"
                              size="small"
                              onClick={() =>
                                handleDelete(
                                  municipality.id
                                )
                              }
                            >
                              Șterge
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}