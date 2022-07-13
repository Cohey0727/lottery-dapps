import React from "react";
import { createStyles, Merge, SxProps } from "utils";
import { Column } from "components/atoms";

type BaseProps = {};
type OwnProps = {
  children: React.ReactNode;
  sx?: SxProps | undefined;
};
export type MainLayoutProps = Merge<BaseProps, OwnProps>;

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { sx, children } = props;

  return (
    <Column sx={{ ...styles.root, ...sx }}>
      {/* <AutoHideAppBar target={containerNode} title={title} /> */}
      {children}
    </Column>
  );
};

const styles = createStyles({
  root: {
    overflowX: "hidden",
    overflowY: "auto",
    height: "100%",
    width: "100%",
  },
});

export default MainLayout;
