import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
// import "@nomiclabs/hardhat-waffle";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "dotenv/config";
import "hardhat-deploy";
import "solidity-coverage";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 11155111,
    },
  },
  solidity: {
    compilers: [{ version: "0.8.19" }, { version: "0.6.6" }],
  },
  namedAccounts: {
    deployer: {
      default: 0, // default first account as deployer on all networks
      // 1: 0, // chainId: account index pair
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
  },
};

export default config;
