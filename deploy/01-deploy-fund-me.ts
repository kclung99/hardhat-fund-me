import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import {
  networkConfig,
  localDevelopmentNetworks,
} from "../helper-hardhat-config";
import "dotenv/config";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // extract variables
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // assign price feed (eth/usd) contract address
  let priceFeedAddress: string;
  if (!localDevelopmentNetworks.includes(network.name)) {
    priceFeedAddress = networkConfig[network.name].priceFeed;
  } else {
    // get price feed contract from local network
    priceFeedAddress = (await deployments.get("MockV3Aggregator")).address!;
  }

  // deploy contract
  const confirmationBlocks = networkConfig[network.name]
    ? networkConfig[network.name].confirmationBlocks
    : 0;
  const fundMe = await deploy("FundMe", {
    contract: "FundMe",
    from: deployer,
    args: [priceFeedAddress],
    log: true,
    waitConfirmations: confirmationBlocks,
  });
  console.log("deployed fund me contract and waiting for confirmation...");

  // verify contract
  if (
    !localDevelopmentNetworks.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [priceFeedAddress]);
  }
};

export default deploy;
deploy.tags = ["all", "fund-me"];
