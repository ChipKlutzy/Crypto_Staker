require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const Alchemy_API = process.env.ALCHEMY_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${Alchemy_API}`,
      accounts: [process.env.PRIVATE_KEY_01],
    },
  },
};
