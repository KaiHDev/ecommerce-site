import { createTheme } from "@mui/material/styles";

// Define Tailwind colors in MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E40AF",
    },
    secondary: {
      main: "#F59E0B",
    },
    warning: {
      main: "#FACC15",
    },
    success: {
      main: "#22C55E",
    },
  },
});

export default theme;
