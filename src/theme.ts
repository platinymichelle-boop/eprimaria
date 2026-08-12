import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563eb",
    },

    background: {
      default: "#83a186",
      paper: "#f7f0f017",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
});

export default theme;