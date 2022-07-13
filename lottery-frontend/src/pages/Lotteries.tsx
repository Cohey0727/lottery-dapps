import { Column } from "components/atoms";
import { MainLayout } from "components/molecules";
import { LotteryCard } from "components/organisms";
import React from "react";
import { Merge } from "utils";
import { createStyles } from "utils";

type BaseProps = {};
type OwnProps = {};
export type LotteriesProps = Merge<BaseProps, OwnProps>;

const Lotteries: React.FC<LotteriesProps> = (props) => {
  return (
    <MainLayout title={"宝くじ一覧"}>
      <Column sx={styles.inner}>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <LotteryCard key={index} sx={styles.card} />
          ))}
      </Column>
    </MainLayout>
  );
};

const styles = createStyles({
  inner: {
    overflowY: "show",
    p: 2,
  },
  card: {
    my: 1,
  },
});

export default Lotteries;
