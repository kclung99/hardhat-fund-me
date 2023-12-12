import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// deployment args
const DECIMAL = "18";
const PRICE = "2000000000000000000000"; // starting price at 2000, add additional 18 digits for decimal

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;

  // deploy only on localhost or hardhat network
  if (chainId === 31337) {
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMAL, PRICE],
    });

    console.log("mock price feed contract deployed to local network");
    console.log("--------------------------------------------------");
  }
};

export default deploy;
deploy.tags = ["all", "mocks"];
