import { Column } from "components/atoms";
import { MainLayout } from "components/molecules";
import { LotteryCard } from "components/organisms";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetLotteriesResult, Merge, useLotteryFactory, withContract } from "utils";
import { createStyles } from "utils";

type BaseProps = {};
type OwnProps = {};
export type LotteriesProps = Merge<BaseProps, OwnProps>;

type Lottery = {
  address: string;
  name: string;
  imageUrl: string;
};

const Lotteries: React.FC<LotteriesProps> = (props) => {
  const factory = useLotteryFactory();
  const navigate = useNavigate();
  const [deployedLotteries, setDeployedLotteries] = useState<Lottery[]>([]);

  useEffect(() => {
    const promise = factory.getLotteries();
    promise.then(([addresses, names, imageUrls]: GetLotteriesResult) => {
      const lotteries = addresses.map((address, index) => ({
        address,
        name: names[index],
        imageUrl: imageUrls[index],
      }));
      setDeployedLotteries(lotteries);
    });
  }, []);
  return (
    <MainLayout title={"宝くじ一覧"}>
      <Column sx={styles.inner}>
        {deployedLotteries.map((lottery) => (
          <LotteryCard
            key={lottery.address}
            {...lottery}
            sx={styles.card}
            onClick={() => navigate(`/lotteries/${lottery.address}`)}
          />
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

export default withContract(Lotteries);
