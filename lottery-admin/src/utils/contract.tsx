import { makeVar, useReactiveVar } from "@apollo/client";
import { lotteryAbi, lotteryFactoryAbi, lotteryFactoryAddress } from "@constants";
import { Contract, ethers } from "ethers";

const lotteryFactoryVar = makeVar<Contract | null>(null);

export const initContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new Contract(lotteryFactoryAddress, lotteryFactoryAbi, signer);
  lotteryFactoryVar(contract);
};

export const withContract = <P,>(
  Component: React.ComponentType<P>,
  UnConnectedComponent: React.ComponentType<{}> = () => <></>
) => {
  return (props: P) => {
    const contract = useReactiveVar(lotteryFactoryVar);
    if (!contract) return <UnConnectedComponent />;
    return <Component {...props} />;
  };
};

export const getLotteryContract = async (lotteryAddress: string) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return new Contract(lotteryAddress, lotteryAbi, signer);
};

export type GetLotteriesResult = [string[], string[], string[]];

export const useLotteryFactory = () => useReactiveVar(lotteryFactoryVar)!;
