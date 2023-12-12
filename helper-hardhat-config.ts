type networkConfigItem = {
  [key: string]: {
    priceFeed: string;
    confirmationBlocks: number;
  };
};

export const networkConfig: networkConfigItem = {
  sepolia: {
    priceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    confirmationBlocks: 6,
  },
};

export const localDevelopmentNetworks = ["hardhat", "localhost"];
