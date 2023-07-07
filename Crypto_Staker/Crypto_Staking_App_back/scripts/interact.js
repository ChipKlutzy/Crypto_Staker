const { ethers } = require("hardhat");
const Addresses = require("../constants");

async function main() {
  const accounts = await ethers.getSigners();
  const signer = accounts[0]; // Assigning First Account as Signer Object

  const Token01 = await ethers.getContractAt("IERC20", Addresses.token01);
  const Token02 = await ethers.getContractAt("IERC20", Addresses.token02);

  // Check Token01 Bal and Approving StakeApp Contract
  const tok01Bal = await Token01.balanceOf(signer.address);
  await Token01.connect(signer).approve(Addresses.StakeAddr, tok01Bal);
  console.log("Token01 Approval Success");

  // Check Token02 Bal and Approving StakeApp Contract
  const tok02Bal = await Token02.balanceOf(signer.address);
  await Token02.connect(signer).approve(Addresses.StakeAddr, tok02Bal);
  console.log("Token02 Approval Success");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
