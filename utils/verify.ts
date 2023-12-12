import { run } from "hardhat";

const verify = async (address: string, args: any[]) => {
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("contract already verified");
    } else {
      console.log(error);
    }
  }
};

export default verify;
