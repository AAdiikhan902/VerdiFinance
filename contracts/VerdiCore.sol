// SPDX-License-Identifier: MIT
pragma solidity =0.5.16;

// This file exists purely so Hardhat compiles the Uniswap V2 core contracts
// (Factory + Pair) as part of this project. We are NOT modifying the AMM
// math or pair logic itself — using the original, audited, battle-tested
// core contracts as-is is the whole point of forking rather than rewriting.
import "@uniswap/v2-core/contracts/UniswapV2Factory.sol";
