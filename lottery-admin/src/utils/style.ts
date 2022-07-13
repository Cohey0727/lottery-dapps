import {
  SxProps as BaseSxProps,
  SystemStyleObject as BaseSystemStyleObject,
} from "@mui/system";
import { Theme } from "@mui/material/styles";
import { useMemo } from "react";

export type SxProps = BaseSxProps<Theme>;
export type SystemStyleObject = BaseSystemStyleObject<Theme>;

export const createStyles = <S extends Record<string, SxProps>>(styles: S) => {
  return styles;
};

export const createUseStyles = <
  S extends Record<string, SxProps>,
  T extends Object
>(
  styles: (deps: T) => S
) => {
  // eslint-disable-next-line
  return (deps: T) => useMemo(() => styles(deps), Object.values(deps));
};
