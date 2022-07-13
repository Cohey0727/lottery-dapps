import React from "react";
import Slide, { SlideProps } from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Merge } from "utils";

type BaseProps = Omit<SlideProps, "direction" | "appear" | "in">;
type OwnProps = {
  children: React.ReactElement;
  target?: Node | Window;
};
export type HideOnScrollProps = Merge<BaseProps, OwnProps>;

const HideOnScroll: React.FC<HideOnScrollProps> = (props) => {
  const { children, target = window, ...rest } = props;
  const trigger = useScrollTrigger({ target });

  return (
    <Slide appear={false} direction="down" in={!trigger} {...rest}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
