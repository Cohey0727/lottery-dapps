import { Typography } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { Column, Row } from "components/atoms";
import { MainLayout } from "components/molecules";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import {
  GetLotteriesResult,
  getLotteryContract,
  Merge,
  useAccount,
  useLotteryFactory,
  withContract,
  withWeb3,
} from "utils";

type BaseProps = Omit<ButtonProps, "variant">;
type OwnProps = {};
export type AssetsProps = Merge<BaseProps, OwnProps>;

type LotteryInfo = {
  address: string;
  name: string;
  imageUrl: string;
};

const Assets: React.FC<AssetsProps> = (props) => {
  const factory = useLotteryFactory();
  const address = useAccount();
  const [ticketsByLottery, setTicketsByLottery] = useState<Record<string, number[]>>({});
  const [deployedLotteries, setDeployedLotteries] = useState<LotteryInfo[]>([]);

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

  useEffect(() => {
    console.log({ deployedLotteries });
    deployedLotteries.forEach(async (lotteryInfo) => {
      const lottery = await getLotteryContract(lotteryInfo.address);
      const res = (await lottery.getTicketsByAddress(address)) as BigNumber[];
      const ticketIds = res.map((ticketId) => ticketId.toNumber());
      setTicketsByLottery((current) => ({ ...current, [lotteryInfo.address as string]: ticketIds }));
    });
  }, [deployedLotteries, address]);

  return (
    <MainLayout title={"購入中の宝くじ"}>
      <Column>
        {Object.entries(ticketsByLottery).map(([lotteryAddress, ticketIds]) => {
          const lottery = deployedLotteries.find((_lottery) => _lottery.address === lotteryAddress)!;
          return (
            <Column p={2}>
              <Typography color="white" variant="h6">
                {lottery.name}
              </Typography>
              <Column>
                {ticketIds.map((ticketId) => {
                  return <Typography color="white">{("000000000000" + ticketId).slice(-8)}</Typography>;
                })}
              </Column>
            </Column>
          );
        })}
      </Column>
    </MainLayout>
  );
};

export default withWeb3(withContract(Assets));
