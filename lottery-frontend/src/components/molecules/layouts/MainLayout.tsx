import React, { useEffect, useRef, useState } from "react";
import { createStyles, Merge, SxProps } from "utils";
import { Column } from "components/atoms";
import { AutoHideAppBar } from "../appbars";

type BaseProps = {};
type OwnProps = {
  title: string;
  children: React.ReactNode;
  sx?: SxProps | undefined;
};
export type MainLayoutProps = Merge<BaseProps, OwnProps>;

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { title, sx, children } = props;
  const containerRef = useRef<Node>();
  const [containerNode, setContainerNode] = useState<Node | undefined>();
  useEffect(() => setContainerNode(containerRef.current), []);

  return (
    <Column sx={{ ...styles.root, ...sx }} ref={containerRef}>
      <AutoHideAppBar target={containerNode} title={title} />
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
