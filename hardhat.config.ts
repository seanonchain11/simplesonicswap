require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sonic: {
      url: "https://rpc.soniclabs.com",
      chainId: 146,
      accounts: [process.env.PRIVATE_KEY || ""]
    }
  },
  etherscan: {
    apiKey: {
      sonic: "H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE"
    },
    customChains: [
      {
        network: "sonic",
        chainId: 146,
        urls: {
          apiURL: "https://sonicscan.io/api",
          browserURL: "https://sonicscan.io"
        }
      }
    ]
  }
}; 