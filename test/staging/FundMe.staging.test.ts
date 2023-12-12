import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { deployments, ethers, network } from "hardhat";
import { localDevelopmentNetworks } from "../../helper-hardhat-config";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// run only on real test net
localDevelopmentNetworks.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      // setup before each tests
      let fundMe: FundMe;
      let deployer: SignerWithAddress;

      beforeEach(async () => {
        deployer = (await ethers.getSigners())[0];
        fundMe = await ethers.getContract("FundMe", deployer.address);
      });

      describe("fund", () => {
        it("fails if not enough eth send", async () => {
          await expect(fundMe.fund()).to.be.reverted;
        });
      });
    });
