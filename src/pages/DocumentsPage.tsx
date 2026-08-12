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
  createDocument,
  getDocuments,
  updateDocumentStatus,
} from "../services/documentsService";

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState<any[]>([]);

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    const { data, error } =
      await getDocuments();

    if (error) {
      console.error(error);
      return;
    }

    setDocuments(data || []);
  }

  function getStatusText(
    status: string
  ) {
    switch (status) {
      case "registered":
        return "Înregistrat";

      case "in_progress":
        return "În lucru";

      case "completed":
        return "Finalizat";

      default:
        return status;
    }
  }

  function getNextStatus(
    status: string
  ) {
    switch (status) {
      case "registered":
        return "in_progress";

      case "in_progress":
        return "completed";

      default:
        return "completed";
    }
  }

  async function handleStatusChange(
    id: string,
    currentStatus: string
  ) {
    const nextStatus =
      getNextStatus(currentStatus);

    const { error } =
      await updateDocumentStatus(
        id,
        nextStatus
      );

    if (error) {
      alert(error.message);
      return;
    }

    loadDocuments();
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const { error } =
      await createDocument(
        title,
        category
      );

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setCategory("");

    loadDocuments();
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Documente / Registratură
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Înregistrare Document
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  label="Titlu"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Categorie"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                >
                  Înregistrează
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
            Registru Documente
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Număr
                  </TableCell>

                  <TableCell>
                    Titlu
                  </TableCell>

                  <TableCell>
                    Categorie
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                  <TableCell>
                    Acțiuni
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {documents.map(
                  (document) => (
                    <TableRow
                      key={document.id}
                    >
                      <TableCell>
                        {document.number}
                      </TableCell>

                      <TableCell>
                        {document.title}
                      </TableCell>

                      <TableCell>
                        {document.category}
                      </TableCell>

                      <TableCell>
                        {getStatusText(
                          document.status
                        )}
                      </TableCell>

                      <TableCell>
                        {document.status !==
                          "completed" && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleStatusChange(
                                document.id,
                                document.status
                              )
                            }
                          >
                            Următorul Status
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}