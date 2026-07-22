const hre = require("hardhat");

// Base's WETH is a fixed predeploy address — the same on Base mainnet and
// Base Sepolia testnet, since it's part of the OP-stack standard bridge setup.
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Verdi DEX contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // --- 1. Deploy Factory ---
  // feeToSetter = deployer for now. Hand this off to a multisig (e.g. Safe)
  // before mainnet launch — do not leave admin control on a single EOA key.
  const Factory = await hre.ethers.getContractFactory(
    "UniswapV2Factory",
    // Uniswap V2 core is compiled under its own artifact name; if this throws
    // "no artifact found", run `npx hardhat compile` first.
  );
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("VerdiFactory (Uniswap V2 Factory) deployed to:", factoryAddress);

  // --- 2. Deploy Router ---
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factoryAddress, WETH_ADDRESS);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("VerdiRouter (Uniswap V2 Router02) deployed to:", routerAddress);

  // --- 3. Optional: route protocol fees to a treasury/staking address ---
  // Uniswap V2's built-in fee switch sends 1/6 of the 0.3% swap fee to
  // whatever address is set here (0 = disabled, the default). This is how
  // your veVERDI staking contract would eventually receive real fee revenue —
  // see the tokenomics doc for the full design.
  const feeTo = process.env.VERDI_FEE_TO;
  if (feeTo) {
    const tx = await factory.setFeeTo(feeTo);
    await tx.wait();
    console.log("Protocol fee switch enabled, feeTo set to:", feeTo);
  } else {
    console.log("VERDI_FEE_TO not set — protocol fee switch left disabled for now.");
  }

  console.log("\n--- Save these addresses for your frontend .env ---");
  console.log("NEXT_PUBLIC_FACTORY_ADDRESS=", factoryAddress);
  console.log("NEXT_PUBLIC_ROUTER_ADDRESS=", routerAddress);
  console.log("NEXT_PUBLIC_WETH_ADDRESS=", WETH_ADDRESS);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
