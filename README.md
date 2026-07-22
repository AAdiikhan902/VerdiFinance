# Verdi DEX — Smart Contracts (Uniswap V2 fork on Base)

This is the **contracts half** of Verdi. It's a thin, unmodified wrapper around
Uniswap V2's original core (Factory/Pair) and periphery (Router02) contracts —
using proven, audited, years-old AMM code rather than reinventing swap math.

The **frontend half** (the Vercel-hosted site people actually use) is a
separate Next.js project — see the build guide doc for how those two connect.

## What's in here

```
contracts/
  VerdiCore.sol        # pulls in Uniswap V2 Factory + Pair (solidity 0.5.16)
  VerdiPeriphery.sol    # pulls in Uniswap V2 Router02 (solidity 0.6.6)
scripts/
  deploy.js             # deploys Factory + Router to Base
hardhat.config.js        # multi-compiler config + Base network settings
.env.example             # copy to .env and fill in
```

We didn't rewrite the AMM logic — `VerdiCore.sol` and `VerdiPeriphery.sol`
just import the original Uniswap V2 contracts so Hardhat compiles them as
part of this project. This is intentional: using unmodified, battle-tested
code is much lower-risk than a custom fork, and it's still enough to launch
a fully functional DEX (swaps, liquidity pools, LP tokens).

## Setup

```bash
npm install
cp .env.example .env
# fill in PRIVATE_KEY (use a dedicated deploy wallet) and BASESCAN_API_KEY
```

## Compile

```bash
npx hardhat compile
```

(Note: this needs to download the Solidity compiler binaries the first time —
requires normal internet access to binaries.soliditylang.org.)

## Test on Base Sepolia first

1. Get free testnet ETH: https://docs.base.org/tools/network-faucets
2. Deploy:
   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```
3. Save the printed Factory/Router addresses — your frontend needs these.
4. Manually test: create a pair, add liquidity, run a few swaps, try removing
   liquidity. Confirm slippage protection actually reverts when it should.

## Before mainnet — do not skip

- [ ] Get the contracts (and this deploy setup) reviewed — even unmodified
      Uniswap V2 code should be checked in context of how you're deploying
      and configuring it (fee routing, ownership, etc.)
- [ ] Move `feeToSetter` / admin control from your deploy wallet to a
      multisig (e.g. Safe) before real funds are involved
- [ ] Have initial liquidity ready to seed immediately after deployment —
      an empty pool invites manipulation
- [ ] Verify contracts on Basescan (`npx hardhat verify --network base <address> <constructor args>`)

## Deploy to Base mainnet

```bash
npx hardhat run scripts/deploy.js --network base
```

## Next pieces (not yet in this repo)

- Frontend (Next.js + wagmi + RainbowKit, deployed on Vercel) — connects to
  the Router address printed above
- veVERDI staking/gauge contract, if you're using the vote-escrow tokenomics
  model from the tokenomics doc
- Subgraph for fast historical pool/volume data once you have real usage
