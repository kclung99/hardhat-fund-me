import { ethers, getNamedAccounts } from "hardhat";
import { FundMe } from "../typechain-types";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const contract: FundMe = await ethers.getContract("FundMe", deployer);
  console.log(`get contract at address: ${await contract.getAddress()}`);

  const response = await contract.fund({ value: ethers.parseEther("0.05") });
  const receipt = await response.wait();
  console.log(`contract funded!`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
