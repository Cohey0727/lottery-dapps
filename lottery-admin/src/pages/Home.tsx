import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Column, Expanded, Row } from "components/atoms";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { connectWallet, createUseStyles, initContract } from "utils";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

type SidebarMenu = {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  label: string;
  path: string;
};

const sidebarMenus: SidebarMenu[] = [
  {
    Icon: ReceiptIcon,
    label: "Lottery",
    path: "/lotteries",
  },
  {
    Icon: FavoriteIcon,
    label: "Assets",
    path: "/assets",
  },
  {
    Icon: RestoreIcon,
    label: "History",
    path: "/histories",
  },
  {
    Icon: AccountBalanceWalletIcon,
    label: "My Page",
    path: "/mypage",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    connectWallet();
    initContract();
  }, []);

  const styles = useStyles({ innerHeight: window.innerHeight });

  return (
    <Row sx={styles.root}>
      <List sx={styles.sidebar}>
        {sidebarMenus.map(({ path, Icon }) => (
          <ListItem key={path} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => navigate(path)}
              sx={{
                minHeight: 48,
                justifyContent: "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: "auto",
                  justifyContent: "center",
                }}
              >
                <Icon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Expanded sx={styles.body}>
        <Outlet />
      </Expanded>
    </Row>
  );
};

type StyleProps = {
  innerHeight: number;
};

const useStyles = createUseStyles(({ innerHeight }: StyleProps) => ({
  root: {
    height: innerHeight,
    overflow: "hidden",
    backgroundColor: ({ palette }) => palette.primary.main,
  },
  body: {
    overflow: "hidden",
  },
  sidebar: {
    flex: "0 0 auto",
    boxShadow: "0px 8px 16px -2px rgba(10,10,10,0.1), 0px 0px 0px 1px rgba(10,10,10,0.02)",
  },
  navigation: {
    backgroundColor: ({ palette }) => palette.primary.main,
    color: "white",
    "& .Mui-selected": {
      color: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
}));

export default Home;
