const { ethers } = require("hardhat");
const Token = require("../models/token");
const Transaction = require("../models/transaction");
const Addresses = require("../constants");

let signer;
ethers.getSigners().then((accounts) => {
  signer = accounts[0];
});

let StakeApp;
ethers.getContractAt("StakeApp", Addresses.StakeAddr).then((ContractObj) => {
  StakeApp = ContractObj;
});

const stake = async (req, res) => {
  const { tokenAddr, amount } = req.body;

  const txreceipt = await StakeApp.connect(signer).callStatic.stake(
    tokenAddr,
    amount
  );

  const txObj = {
    hash: txreceipt.hash,
    to: txreceipt.to,
    from: txreceipt.from,
    nonce: txreceipt.nonce,
  };

  // Saving this transaction into database
  const newTransaction = new Transaction(txObj);
  await newTransaction.save();

  res.json(txObj);
};

const unstake = async (req, res) => {
  const { tokenAddr, amount } = req.body;

  const txreceipt = await StakeApp.connect(signer).callStatic.unstake(
    tokenAddr,
    amount
  );

  const txObj = {
    hash: txreceipt.hash,
    to: txreceipt.to,
    from: txreceipt.from,
    nonce: txreceipt.nonce,
  };

  // Saving this transaction into database
  const newTransaction = new Transaction(txObj);
  await newTransaction.save();

  res.json(txObj);
};

const getUserBalance = async (req, res) => {
  const { tokenAddr } = req.body;

  const stakeBal = await StakeApp.getUserBalance(tokenAddr);

  res.json({
    UserBal: String(stakeBal),
  });
};

const getUserRewards = async (req, res) => {
  const rewardBal = await StakeApp.getUserBalance(Addresses.rewardToken);

  res.json({
    RewardBal: String(rewardBal),
  });
};

module.exports = { stake, unstake, getUserBalance, getUserRewards };
