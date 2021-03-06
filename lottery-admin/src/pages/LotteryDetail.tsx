import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Column, ContainedButton, Row } from "components/atoms";
import { MainLayout } from "components/molecules";
import { primaryColor } from "configs/theme";
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
  const [contract, setContract] = useState<Contract>();
  const [lotteryInfo, setLotteryInfo] = useState<LotteryInfo>();
  const [formValues, setFormValues] = useState({ name: "", rate: 0 });
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
      setContract(lottery);
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

  const handleAddWinnerPrize = useCallback(async () => {
    if (contract === undefined) return;
    setSubmitting(true);
    const { name, rate } = formValues;
    await contract.addWinnerPrize(name, rate);
    setSubmitting(false);
  }, [formValues, contract]);

  const handleStart = useCallback(async () => {
    if (contract === undefined) return;
    setSubmitting(true);
    await contract.activation();
    setSubmitting(false);
  }, [contract]);

  const handleFinish = useCallback(async () => {
    if (contract === undefined) return;
    setSubmitting(true);
    await contract.finish();
    setSubmitting(false);
  }, [contract]);

  const handleDistributePrizes = useCallback(async () => {
    if (contract === undefined) return;
    setSubmitting(true);
    await contract.distributePrizes();
    setSubmitting(false);
  }, [contract]);

  const totalRate = lotteryInfo?.winnerPrizes.reduce((acc, cur) => acc + cur.rate.toNumber(), 0) ?? 1;
  return (
    <MainLayout>
      <Row>
        <Column sx={styles.body}>
          <Typography variant="h4" sx={styles.title}>
            ??????????????????
          </Typography>
          <TextField
            label="??????"
            variant="outlined"
            sx={styles.input}
            onChange={(e) => setFormValues((current) => ({ ...current, name: e.target.value }))}
          />
          <TextField
            label="??????"
            variant="outlined"
            sx={styles.input}
            onChange={(e) => setFormValues((current) => ({ ...current, rate: parseInt(e.target.value) }))}
          />
          <ContainedButton
            sx={styles.button}
            onClick={handleAddWinnerPrize}
            disabled={formValues.rate === 0 || !formValues.name || submitting}
          >
            ????????????
          </ContainedButton>
          {lotteryInfo?.status === 0 && (
            <ContainedButton sx={styles.button} onClick={handleStart}>
              ??????
            </ContainedButton>
          )}
          {lotteryInfo?.status === 1 && (
            <ContainedButton sx={styles.button} onClick={handleFinish}>
              ??????
            </ContainedButton>
          )}
          {lotteryInfo?.status === 2 && (
            <ContainedButton sx={styles.button} onClick={handleDistributePrizes}>
              ??????????????????
            </ContainedButton>
          )}
        </Column>
        {lotteryInfo && (
          <Column sx={styles.body}>
            <Typography variant="h4" sx={styles.title}>
              ??????
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              ????????????:{lotteryInfo.address}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              ??????:{lotteryInfo.name}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              ??????:{lotteryInfo.status === 0 ? "?????????" : lotteryInfo.status === 1 ? "????????????" : "??????"}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              ??????URL:{lotteryInfo.imageUrl}
            </Typography>
            <img alt="" src={lotteryInfo.imageUrl} />
            <Typography variant="body1" sx={styles.title}>
              ????????????:{lotteryInfo.ticketHolders.length}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
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
          </Column>
        )}
      </Row>
    </MainLayout>
  );
};

const styles = createStyles({
  body: {
    overflowY: "show",
    p: 2,
    maxWidth: 400,
  },
  title: {
    py: 2,
    color: primaryColor,
    fontWeight: "bold",
  },
  input: {
    my: 1,
  },
  button: {
    my: 1,
  },
  card: {
    my: 10,
  },
});

export default withWeb3(withContract(LotteryDetail));
