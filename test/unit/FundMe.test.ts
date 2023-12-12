import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { deployments, ethers, network } from "hardhat";
import { localDevelopmentNetworks } from "../../helper-hardhat-config";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// run only on local test net
!localDevelopmentNetworks.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      // setup before each tests
      let fundMe: FundMe;
      let mockV3Aggregator: MockV3Aggregator;
      let deployer: SignerWithAddress;

      beforeEach(async () => {
        if (!localDevelopmentNetworks.includes(network.name)) {
          throw "you need to be on a development chain for testing";
        }

        deployer = (await ethers.getSigners())[0];
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe");
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator");
      });

      // test constructor
      describe("constructor", () => {
        it("sets the aggregator address", async () => {
          const actual = (await fundMe.getPriceFeed()).toString();
          assert.equal(actual, await mockV3Aggregator.getAddress());
        });
      });

      // test fund
      describe("fund", () => {
        it("fails if not enough eth send", async () => {
          await expect(fundMe.fund()).to.be.reverted;
        });

        it("udpates the amount funded mapping", async () => {
          await fundMe.fund({ value: ethers.parseEther("1") });
          const actual = (
            await fundMe.s_addressToAmountFunded(deployer.address)
          ).toString();

          assert.equal(actual, ethers.parseEther("1").toString());
        });
      });

      // test withdraw
      describe("withdraw", () => {
        // fund contract beforehand via 5 different addresses
        beforeEach(async () => {
          const accounts = await ethers.getSigners();
          for (let i = 0; i < 5; i++) {
            await fundMe
              .connect(accounts[i])
              .fund({ value: ethers.parseEther("1") });
          }
        });

        it("withdraw the funds", async () => {
          // arrage
          const startingContractBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer.address
          );

          // act
          const resposne = await fundMe.withdraw();
          const receipt = await resposne.wait();
          const { gasUsed, gasPrice } = receipt!;
          const gasCost = gasUsed * gasPrice;
          console.log(`gas cost is: ${gasCost}`);

          // assert
          const endingContractBalance = await ethers.provider.getBalance(
            await fundMe.getAddress()
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer.address
          );
          assert.equal(endingContractBalance.toString(), "0");
          assert.equal(
            (startingContractBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );
        });
      });
    });
