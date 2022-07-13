import { generateColorSet } from "utils";
import createTheme from "@mui/material/styles/createTheme";

export const primaryColor = "#e91e63";
export const secondaryColor = "#ffab40";

const theme = createTheme({
  palette: {
    primary: generateColorSet(primaryColor),
    secondary: generateColorSet(secondaryColor),
  },
});

export default theme;
