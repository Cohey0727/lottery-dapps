import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Column, ContainedButton } from "components/atoms";
import { MainLayout } from "components/molecules";
import { BigNumber, Contract } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createStyles, getLotteryContract, Merge, withContract, withWeb3 } from "utils";

type BaseProps = {};
type OwnProps = {};
export type LotteriesProps = Merge<BaseProps, OwnProps>;

type LotteryInfo = {
  address: string;
  name: string;
  imageUrl: string;
  status: number;
  ticketHolders: string[];
  winnerPrizes: { name: string; rate: BigNumber }[];
};

const LotteryDetail: React.FC<LotteriesProps> = (props) => {
  const { lotteryId } = useParams<{ lotteryId: string }>();
  const [lottery, setLottery] = useState<Contract>();
  const [lotteryInfo, setLotteryInfo] = useState<LotteryInfo>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!lotteryId) return;
    getLotteryContract(lotteryId).then(async (lottery) => {
      const [name, imageUrl, status, ticketHolders, winnerPrizeRates] = await Promise.all([
        lottery.name(),
        lottery.imageUrl(),
        lottery.status(),
        lottery.getTicketHolders(),
        lottery.getWinnerPrizeRates(),
      ]);
      console.log({ winnerPrizeRates });
      const [prizeNames, prizeRates] = winnerPrizeRates;
      prizeNames.map((name: string, index: number) => ({ name, rate: prizeRates[index] }));
      setLottery(lottery);
      setLotteryInfo({
        address: lotteryId,
        name,
        imageUrl,
        status,
        ticketHolders,
        winnerPrizes: prizeNames.map((name: string, index: number) => ({ name, rate: prizeRates[index] })),
      });
      console.log({ name, imageUrl, status, ticketHolders, winnerPrizeRates });
    });
  }, [lotteryId]);

  const handleBuyTicket = useCallback(async () => {
    if (!lottery) return;
    setSubmitting(true);
    try {
      const options = { value: 1 };
      await lottery.buyTicket(options);
    } finally {
      setSubmitting(false);
    }
  }, [lottery]);

  if (!lotteryInfo)
    return (
      <MainLayout title="">
        <CircularProgress />
      </MainLayout>
    );
  const totalRate = lotteryInfo.winnerPrizes.reduce((acc, cur) => acc + cur.rate.toNumber(), 0) ?? 1;
  return (
    <MainLayout title={lotteryInfo.name}>
      <Column sx={styles.body}>
        <img style={{ marginBottom: "8px" }} alt="" src={lotteryInfo.imageUrl} />
        <Accordion sx={styles.info}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h6" sx={styles.infoItem}>
              ??????
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={styles.infoItem}>
              ????????????:{lotteryInfo.address}
            </Typography>
            <Typography variant="body1" sx={styles.infoItem}>
              ??????:{lotteryInfo.name}
            </Typography>
            <Typography variant="body1" sx={styles.infoItem}>
              ??????:{lotteryInfo.status === 0 ? "?????????" : lotteryInfo.status === 1 ? "????????????" : "??????"}
            </Typography>
            <Typography variant="body1" sx={styles.infoItem}>
              ??????URL:{lotteryInfo.imageUrl}
            </Typography>
            <Typography variant="body1" sx={styles.infoItem}>
              ????????????:{lotteryInfo.ticketHolders.length}
            </Typography>
            <Typography variant="body1" sx={styles.infoItem}>
              ???????????????
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>??????</TableCell>
                  <TableCell>??????%????????????</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lotteryInfo.winnerPrizes.map((prize) => (
                  <TableRow key={prize.name}>
                    <TableCell>{prize.name}</TableCell>
                    <TableCell>
                      {(prize.rate.toNumber() / totalRate) * 100}%???{prize.rate.toNumber()}???
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
        <ContainedButton disabled={submitting} onClick={handleBuyTicket} sx={styles.button} color="secondary">
          ??????
        </ContainedButton>
      </Column>
    </MainLayout>
  );
};

const styles = createStyles({
  body: {
    overflowY: "show",
    p: 2,
    maxWidth: 400,
  },
  infoItem: {
    py: 2,
    color: ({ palette }) => palette.text.primary,
    fontWeight: "bold",
    overflowWrap: "anywhere",
  },
  info: {
    mt: 2,
  },
  button: {
    my: 2,
  },
});

export default withWeb3(withContract(LotteryDetail));
