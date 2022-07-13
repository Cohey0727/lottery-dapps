import { makeVar, useReactiveVar } from "@apollo/client";
import { lotteryFactoryAbi, lotteryFactoryAddress } from "@constants";
import { Contract, ethers } from "ethers";

const factoryContractVar = makeVar<Contract | null>(null);

export const initContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new Contract(lotteryFactoryAddress, lotteryFactoryAbi, signer);
  factoryContractVar(contract);
};

export const withContract = <P,>(
  Component: React.ComponentType<P>,
  UnConnectedComponent: React.ComponentType<{}> = () => <></>
) => {
  return (props: P) => {
    const contract = useReactiveVar(factoryContractVar);
    if (!contract) return <UnConnectedComponent />;
    return <Component {...props} />;
  };
};

export type GetLotteriesResult = [string[], string[], string[]];

export const useLotteryFactory = () => useReactiveVar(factoryContractVar)!;
