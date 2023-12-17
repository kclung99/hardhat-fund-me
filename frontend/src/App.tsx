import { useEffect, useState } from "react";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { contractAddress } from "../contant.js";
import { FundMe__factory } from "../../typechain-types";

function App() {
  const [hasProvider, setHasProvider] = useState(false);
  const [fundAmount, setFundAmout] = useState(0);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    (async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));
    })();
  }, []);

  const connectHandler = () => {
    if (!hasProvider) return;
    window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const enteredAmountHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFundAmout(event.target.valueAsNumber);
  };

  const fundHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    (async (amount: number) => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = FundMe__factory.connect(contractAddress, signer);

      const receipt = await (
        await contract.fund({
          value: ethers.parseEther(amount.toString()),
        })
      ).wait(1);
      console.log(`transaction done!`);
      console.log(receipt);
    })(fundAmount);
  };

  const getBalanceHandler = () => {
    (async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractBalance = await provider.getBalance(contractAddress);
      setBalance(ethers.formatEther(contractBalance));
      console.log(balance);
    })();
  };

  const withdrawHandler = () => {
    (async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = FundMe__factory.connect(contractAddress, signer);

      const receipt = await (await contract.withdraw()).wait(1);
      console.log(`transaction done!`);
      console.log(receipt);
    })();
  };

  return (
    <>
      <h2>fund me</h2>
      <button onClick={connectHandler}>connect</button>
      <form onSubmit={fundHandler}>
        <label htmlFor="fund">fund</label>
        <input id="fund" type="number" onChange={enteredAmountHandler} />
        <button>submit</button>
      </form>
      <button onClick={getBalanceHandler}>{`balance ${balance}`}</button>
      <button onClick={withdrawHandler}>withdraw</button>
    </>
  );
}

export default App;
