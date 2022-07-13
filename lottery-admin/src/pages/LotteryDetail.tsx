import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Column, ContainedButton, Row } from "components/atoms";
import { MainLayout } from "components/molecules";
import { LotteryCard } from "components/organisms";
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

  const totalRate = lotteryInfo?.winnerPrizes.reduce((acc, cur) => acc + cur.rate.toNumber(), 0) ?? 1;
  return (
    <MainLayout>
      <Row>
        <Column sx={styles.body}>
          <Typography variant="h4" sx={styles.title}>
            当選金の作成
          </Typography>
          <TextField
            label="賞名"
            variant="outlined"
            sx={styles.input}
            onChange={(e) => setFormValues((current) => ({ ...current, name: e.target.value }))}
          />
          <TextField
            label="比率"
            variant="outlined"
            sx={styles.input}
            onChange={(e) => setFormValues((current) => ({ ...current, rate: parseInt(e.target.value) }))}
          />
          <ContainedButton
            sx={styles.button}
            onClick={handleAddWinnerPrize}
            disabled={formValues.rate === 0 || !formValues.name || submitting}
          >
            賞の追加
          </ContainedButton>
          <ContainedButton sx={styles.button} onClick={handleStart}>
            開始
          </ContainedButton>
        </Column>
        {lotteryInfo && (
          <Column sx={styles.body}>
            <Typography variant="h4" sx={styles.title}>
              情報
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              アドレス:{lotteryInfo.address}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              名前:{lotteryInfo.name}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              状態:{lotteryInfo.status === 0 ? "開始前" : lotteryInfo.status === 1 ? "開始済み" : "終了"}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              画像URL:{lotteryInfo.imageUrl}
            </Typography>
            <img alt="" src={lotteryInfo.imageUrl} />
            <Typography variant="body1" sx={styles.title}>
              購入件数:{lotteryInfo.ticketHolders.length}
            </Typography>
            <Typography variant="body1" sx={styles.title}>
              当選金割合
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>名前</TableCell>
                  <TableCell>割合%（比率）</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lotteryInfo.winnerPrizes.map((prize) => (
                  <TableRow key={prize.name}>
                    <TableCell>{prize.name}</TableCell>
                    <TableCell>
                      {(prize.rate.toNumber() / totalRate) * 100}%（{prize.rate.toNumber()}）
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
    my: 1,
  },
});

export default withWeb3(withContract(LotteryDetail));
