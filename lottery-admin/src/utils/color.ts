import Color from "color";
import { objectEntries } from "./object";

export type ColorSet = {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

const colorOffsets: Record<keyof ColorSet, number> = {
  main: 0,
  light: 0.5,
  dark: -0.25,
  50: 1.2,
  100: 0.9,
  200: 0.6,
  300: 0.3,
  400: 0,
  500: -0.1,
  600: -0.2,
  700: -0.3,
  800: -0.4,
  900: -0.5,
  contrastText: 0,
};

export const generateColorSet = (mainColor: string) => {
  const baseColor = Color(mainColor);
  const isDark = baseColor.isDark();
  const colorSets = objectEntries(colorOffsets).reduce(
    (colorSet, [name, value]) => {
      colorSet[name] = baseColor.lighten(value).hex();
      return colorSet;
    },
    {} as ColorSet
  );
  return {
    ...colorSets,
    contrastText: isDark ? "#ffffff" : "#000000",
  };
};
