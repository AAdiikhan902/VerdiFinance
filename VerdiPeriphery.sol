// SPDX-License-Identifier: MIT
pragma solidity =0.6.6;

// Same idea as VerdiCore.sol: pulls in the original, unmodified
// Uniswap V2 Router02 so Hardhat compiles it. This is the contract
// the Verdi frontend will actually call for swaps/add/remove liquidity.
import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
