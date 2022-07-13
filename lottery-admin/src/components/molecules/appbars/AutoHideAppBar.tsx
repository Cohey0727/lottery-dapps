import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Merge } from "utils";
import { HideOnScroll, HideOnScrollProps } from "../animations";

type BaseProps = Omit<HideOnScrollProps, "children">;
type OwnProps = {
  title: string;
};
export type AutoHideAppBarProps = Merge<BaseProps, OwnProps>;

const AutoHideAppBar: React.FC<AutoHideAppBarProps> = (props) => {
  const { title, ...rest } = props;
  return (
    <>
      <HideOnScroll {...rest}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};

export default AutoHideAppBar;
