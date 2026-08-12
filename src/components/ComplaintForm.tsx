import { useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

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
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 3 }}
      >
        Sesizare nouă
      </Typography>

      <TextField
        label="Titlu sesizare"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Descriere"
        multiline
        rows={5}
        fullWidth
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
      >
        Trimite sesizarea
      </Button>
    </Box>
  );
}
