import { Column } from "components/atoms";
import { MainLayout } from "components/molecules";
import { LotteryCard } from "components/organisms";
import React, { useEffect } from "react";
import { createStyles, Merge, useAccount, useContract, withContract, withWeb3 } from "utils";

type BaseProps = {};
type OwnProps = {};
export type LotteriesProps = Merge<BaseProps, OwnProps>;

const Lotteries: React.FC<LotteriesProps> = (props) => {
  const contract = useContract();
  const account = useAccount();
  useEffect(() => {
    console.log(contract.methods);
    contract.methods
      .getLotteries()
      .call({ from: account })
      .then((res: any) => {
        console.log(res);
      });
  }, []);
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

export default withWeb3(withContract(Lotteries));
