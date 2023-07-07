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

const getTokens = async (req, res) => {
  const tokens = await Token.find();

  res.json({
    tokens: tokens,
  });
};

const addToken = async (req, res) => {
  const { name, symbol, decimals, address } = req.body;

  const newtoken = new Token({ name, symbol, decimals, address });
  await newtoken.save();

  // // This is just a transaction simulation for addStakeToken
  // const txreceipt = await StakeApp.connect(signer).callStatic.addStakeToken(
  //   address
  // );
  // // Saving this transaction into database
  // const newTransaction = new Transaction({
  //   hash: txreceipt.hash,
  //   to: txreceipt.to,
  //   from: txreceipt.from,
  //   nonce: txreceipt.nonce,
  // });
  // await newTransaction.save();

  res.json({
    token: newtoken,
  });
};

module.exports = { addToken, getTokens };
