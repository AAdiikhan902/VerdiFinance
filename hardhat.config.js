require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "11".repeat(32); // placeholder — never commit a real key

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  // Multiple compiler versions are required because Uniswap V2's core (0.5.16)
  // and periphery (0.6.6) contracts predate modern Solidity. Hardhat picks the
  // right compiler automatically based on each file's pragma.
  solidity: {
    compilers: [
      { version: "0.5.16", settings: { optimizer: { enabled: true, runs: 999999 } } },
      { version: "0.6.6", settings: { optimizer: { enabled: true, runs: 999999 } } },
      { version: "0.8.20", settings: { optimizer: { enabled: true, runs: 200 } } },
    ],
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84532,
    },
    base: {
      url: process.env.BASE_MAINNET_RPC || "https://mainnet.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 8453,
    },
  },
  etherscan: {
    // Basescan uses the same verification API shape as Etherscan
    apiKey: {
      base: process.env.BASESCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};
