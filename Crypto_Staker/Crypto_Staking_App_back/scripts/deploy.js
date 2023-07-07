const { ethers } = require("hardhat");
const Addresses = require("../constants");

async function main() {
  const accounts = await ethers.getSigners();

  const rewardToken = "0x7bF84789AECEc1Cd871B29581F342b5Fa98ABa48";

  const StakeApp = await ethers.getContractFactory("StakeApp");
  const stakeApp = await StakeApp.connect(accounts[0]).deploy(
    Addresses.rewardToken
  );

  await stakeApp.waitForDeployment();

  console.log(
    `StakeApp Contract Deployed @Address: ${await stakeApp.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Sepolia Deployment Addresses

// reward token: 0x7bF84789AECEc1Cd871B29581F342b5Fa98ABa48
// Token01: 0x43895b1d1A6915d845AfB0e56B601BF2950fe3B5
// Token02: 0x94c8Ad1060374daC9EC7B78241A9C302257E6aac

// stake Contract Address: 0x5474f4040F9B7f79D71a6be1FfBd1d891129FEff
