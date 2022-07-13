import React from "react";
import Card, { CardProps } from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { createStyles, Merge } from "utils";
import { Column, Row } from "components/atoms";

type BaseProps = Omit<CardProps, "variant">;
type OwnProps = {
  address: string;
  imageUrl: string;
  name: string;
};
export type LotteryCardProps = Merge<BaseProps, OwnProps>;

const LotteryCard: React.FC<LotteryCardProps> = (props) => {
  const { address, imageUrl, name, sx, ...cardProps } = props;

  return (
    <Card elevation={8} component={Row} sx={{ ...styles.root, ...sx }} {...cardProps}>
      <CardMedia component="img" sx={styles.image} image={imageUrl} alt={name} />
      <Column sx={styles.iconContainer}>
        <PlayArrowIcon sx={styles.icon} />
      </Column>
    </Card>
  );
};

const styles = createStyles({
  root: {
    backgroundColor: ({ palette }) => palette.secondary.main,
  },
  image: {
    width: "80%",
  },
  iconContainer: {
    flex: "1 1 auto",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: "3rem",
  },
});

export default LotteryCard;
