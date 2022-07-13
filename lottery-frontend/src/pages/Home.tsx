import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Column, Expanded } from "components/atoms";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { connectWallet, createUseStyles, initContract } from "utils";

type BottomAction = {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  label: string;
  path: string;
};

const bottomActions: BottomAction[] = [
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
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    connectWallet();
    initContract();
  }, []);

  const styles = useStyles({ innerHeight: window.innerHeight });

  return (
    <Column sx={styles.root}>
      <Expanded sx={styles.body}>
        <Outlet />
      </Expanded>
      <BottomNavigation
        sx={styles.footer}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(bottomActions[newValue].path);
        }}
      >
        {bottomActions.map(({ label, Icon }) => (
          <BottomNavigationAction key={label} color="red" sx={styles.navigation} label={label} icon={<Icon />} />
        ))}
      </BottomNavigation>
    </Column>
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
  footer: {
    flex: "0 0 auto",
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
