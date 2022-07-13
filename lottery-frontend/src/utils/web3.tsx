import { ethers } from "ethers";
import { makeVar, useReactiveVar } from "@apollo/client";

export const accountVar = makeVar<string | null>(null);

export const connectWallet = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
  accountVar(accounts.length > 0 ? accounts[0] : null);
};

export const withWeb3 = <P,>(
  Component: React.ComponentType<P>,
  UnConnectedComponent: React.ComponentType<{}> = () => <></>
) => {
  return (props: P) => {
    const account = useReactiveVar(accountVar);
    if (account === null) return <UnConnectedComponent />;
    return <Component {...props} />;
  };
};
