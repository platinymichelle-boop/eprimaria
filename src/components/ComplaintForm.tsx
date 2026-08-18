import { useState } from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { createComplaint } from "../services/complaintsService";
import { supabase } from "../services/supabase";

const categories = [
  "Drumuri",
  "Iluminat Public",
  "Salubritate",
  "Spații Verzi",
  "Parcuri",
  "Trafic",
  "Parcări",
  "Altele",
];

const priorities = ["Mică", "Normală", "Urgentă"];

export default function ComplaintForm() {
  const [photos, setPhotos] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Normală",
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocația nu este suportată de browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        alert("Locație detectată cu succes.");
      },
      () => {
        alert("Nu s-a putut obține locația.");
      },
    );
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert("Completează câmpurile obligatorii.");
      return;
    }

    const { data, error } = await createComplaint(formData);

    if (error) {
      alert(error.message);
      return;
    }

    const complaintId = data?.[0]?.id;

    console.log("CREATE DATA", data);
    console.log("COMPLAINT ID", complaintId);
    console.log("PHOTOS", photos);

    if (complaintId && photos.length > 0) {
      for (const photo of photos) {
        const fileName = `${crypto.randomUUID()}-${photo.name}`;

        const { error: uploadError } = await supabase.storage
          .from("complaints")
          .upload(fileName, photo);

        if (uploadError) {
          console.error(uploadError);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("complaints")
          .getPublicUrl(fileName);

        const { error: photoInsertError } = await supabase
          .from("complaint_photos")
          .insert({
            complaint_id: complaintId,
            photo_url: publicUrlData.publicUrl,
          });

        console.log("PHOTO INSERT ERROR", photoInsertError);
      }
    }

    alert("Sesizarea a fost înregistrată cu succes!");

    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "Normală",
      address: "",
      latitude: null,
      longitude: null,
    });

    setPhotos([]);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Titlu Sesizare *"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            label="Categorie *"
            fullWidth
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            label="Prioritate"
            fullWidth
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value,
              })
            }
          >
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Adresă / Locație"
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
          <Button variant="outlined" onClick={getCurrentLocation}>
            📍 Folosește locația mea
          </Button>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Descriere Sesizare *"
            multiline
            rows={6}
            fullWidth
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button variant="outlined" component="label">
            Selectează Fotografii
            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => setPhotos(Array.from(e.target.files || []))}
            />
          </Button>

          {photos.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Fotografii selectate:
              </Typography>

              {photos.map((photo, index) => (
                <Typography key={index} variant="body2">
                  📷 {photo.name}
                </Typography>
              ))}
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Trimite Sesizarea
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
