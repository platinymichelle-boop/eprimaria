import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  getUsers,
  updateUserRole,
} from "../services/adminService";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data, error } = await getUsers();

    if (error) {
      console.error(error);
      return;
    }

    setUsers(data || []);
  }

  async function handleRoleChange(
    id: string,
    role: string
  ) {
    const { error } = await updateUserRole(
      id,
      role
    );

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    loadUsers();
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
        Administrare Sistem
      </Typography>

      <Typography
        sx={{
          color: "#64748b",
          mb: 4,
        }}
      >
        Panou Super Admin ePrimaria
      </Typography>

      <Alert
        severity="success"
        sx={{ mb: 4 }}
      >
        Ești conectat ca Super Admin.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Utilizatori
              </Typography>

              <Typography>
                {users.length} utilizatori în sistem
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Primării
              </Typography>

              <Typography>
                Modul în dezvoltare
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Statistici
              </Typography>

              <Typography>
                Modul în dezvoltare
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Utilizatori
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nume</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Data Creării</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.full_name || "-"}
                        </TableCell>

                        <TableCell>
                          {user.email}
                        </TableCell>

                        <TableCell>
                          <FormControl
                            size="small"
                            sx={{ minWidth: 170 }}
                          >
                            <Select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="super-admin">
                                Super Admin
                              </MenuItem>

                              <MenuItem value="admin">
                                Admin
                              </MenuItem>

                              <MenuItem value="operator">
                                Operator
                              </MenuItem>

                              <MenuItem value="citizen">
                                Cetățean
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>

                        <TableCell>
                          {new Date(
                            user.created_at
                          ).toLocaleString("ro-RO")}
                        </TableCell>
                      </TableRow>
                    ))}
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