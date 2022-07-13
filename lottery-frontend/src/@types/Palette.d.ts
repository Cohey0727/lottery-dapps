import { Palette, PaletteColor } from "@mui/material/styles/createPalette";
import { Color } from "@mui/material/index";

declare module "@mui/material/styles" {
  export interface Theme {
    palette: {
      primary: PaletteColor & Color;
      secondary: PaletteColor & Color;
    } & Palette;
  }
}
