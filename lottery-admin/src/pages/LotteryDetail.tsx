import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Column, ContainedButton, Row } from "components/atoms";
import { MainLayout } from "components/molecules";
import { LotteryCard } from "components/organisms";
import { primaryColor } from "configs/theme";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createStyles, GetLotteriesResult, Merge, useLotteryFactory, withContract, withWeb3 } from "utils";

type BaseProps = {};
type OwnProps = {};
export type LotteriesProps = Merge<BaseProps, OwnProps>;
type Lottery = {
  address: string;
  name: string;
  imageUrl: string;
};

const LotteryDetail: React.FC<LotteriesProps> = (props) => {
  const { lotteryId } = useParams<{ lotteryId: string }>();
  const contract = useLotteryFactory();
  const [formValues, setFormValues] = useState({ name: "", imageUrl: "" });
  const [submitting, setSubmitting] = useState(false);
  const [deployedLotteries, setDeployedLotteries] = useState<Lottery[]>([]);

  useEffect(() => {
    const promise = contract.getLotteries();
    promise.then(([addresses, names, imageUrls]: GetLotteriesResult) => {
      const lotteries = addresses.map((address, index) => ({
        address,
        name: names[index],
        imageUrl: imageUrls[index],
      }));
      setDeployedLotteries(lotteries);
    });
  }, []);

  const handleDeploy = useCallback(async () => {
    const { name, imageUrl } = formValues;
    setSubmitting(true);
    await contract.createLottery(name, imageUrl, 1);
    setSubmitting(false);
  }, [contract, formValues]);

  return (
    <MainLayout>
      <Row>
        <Column sx={styles.body}>
          <Typography variant="h4" sx={styles.title}>
            新規作成
          </Typography>
          <TextField
            label="宝くじ名称"
            variant="outlined"
            sx={styles.input}
            onChange={(e) => setFormValues((current) => ({ ...current, name: e.target.value }))}
          />
          <TextField
            label="画像URL"
            variant="outlined"
            sx={styles.input}
            onChange={(e) => setFormValues((current) => ({ ...current, imageUrl: e.target.value }))}
          />
          <ContainedButton
            sx={styles.button}
            onClick={handleDeploy}
            disabled={!formValues.imageUrl || !formValues.name || submitting}
          >
            作成
          </ContainedButton>
        </Column>
        <Column sx={styles.body}>
          <Typography variant="h4" sx={styles.title}>
            作成済み一覧
          </Typography>
          {deployedLotteries.map((lottery) => (
            <LotteryCard {...lottery} sx={styles.card} />
          ))}
        </Column>
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
