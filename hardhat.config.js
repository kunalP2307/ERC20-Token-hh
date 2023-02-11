require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.6",

  gasReporter : {
    enabled: true,
    currency: "INR",
    noColors: true,
    outputFile: "gasReport.txt", 
    coinmarketcap: "b5f19517-7f81-4519-97c0-be60dd9f9541",
    
  }
};
