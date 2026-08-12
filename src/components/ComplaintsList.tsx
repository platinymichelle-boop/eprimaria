import { useEffect, useState } from "react";

import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  getComplaints,
  updateComplaintStatus,
} from "../services/complaintsService";

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    const { data, error } = await getComplaints();

    if (error) {
      console.error(error);
      return;
    }

    setComplaints(data || []);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "success";

      case "in_progress":
        return "warning";

      default:
        return "info";
    }
  };

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

  async function handleStatusChange(
    id: string,
    currentStatus: string
  ) {
    const nextStatus = getNextStatus(currentStatus);

    console.log("ID =", id);
    console.log("Current =", currentStatus);
    console.log("Next =", nextStatus);

    const { data, error } =
      await updateComplaintStatus(
        id,
        nextStatus
      );

    console.log("DATA =", data);
    console.log("ERROR =", error);

    if (error) {
      alert(error.message);
      return;
    }

    await loadComplaints();
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
      >
        Lista sesizări
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titlu</TableCell>
              <TableCell>Descriere</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Acțiuni</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>
                  {complaint.title}
                </TableCell>

                <TableCell>
                  {complaint.description}
                </TableCell>

                <TableCell>
                  <Chip
                    label={getStatusText(
                      complaint.status
                    )}
                    color={getStatusColor(
                      complaint.status
                    )}
                  />
                </TableCell>

                <TableCell>
                  {complaint.status !==
                    "resolved" && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        handleStatusChange(
                          complaint.id,
                          complaint.status
                        )
                      }
                    >
                      Următorul Status
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}