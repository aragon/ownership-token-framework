# ENA Token Research Report
## Aragon Ownership Token Framework Analysis

**Date:** 2026-03-16
**Status:** Complete (Revision 5)
**Token:** ENA (Ethena Governance Token)
**Network:** Ethereum Mainnet
**Contract:** [`0x57e114B691Db790C35207b2e685D4A43181e6061`](https://etherscan.io/address/0x57e114B691Db790C35207b2e685D4A43181e6061)

---

## Executive Summary

The ENA token is the governance token of the Ethena protocol, a synthetic dollar (USDe) protocol. This analysis evaluates ENA against the Aragon Ownership Token Framework, examining whether ENA tokenholders have meaningful, enforceable control over the protocol and whether the token captures value.

### Key Findings

| Metric | Rating | Summary |
|--------|--------|---------|
| **Onchain Control** | ⚠️ | Governance is Snapshot signaling only; 5-of-11 multisig executes all decisions |
| **Value Accrual** | ⚠️ | Fee switch pending; sENA receives ecosystem airdrops only (not USDe yield) |
| **Verifiability** | ✅ | All core contracts verified and open source |
| **Token Distribution** | ⚠️ | 70% insider allocation; ongoing vesting through 2028 |
| **Offchain Dependencies** | ⚠️ | IP and trademarks owned by Ethena (BVI) Limited, not tokenholders |

### Critical Distinction

ENA governance is **advisory, not binding**. All protocol changes are executed by the Dev Multisig (5-of-11). ENA holders can signal preferences via Snapshot, but the multisig has discretionary power to execute or ignore those signals. This is fundamentally different from protocols where tokenholder votes trigger automatic onchain execution.

---

## Contract Architecture

### Core Contracts

| Contract | Address | Purpose | Upgradeable |
|----------|---------|---------|-------------|
| **ENA Token** | [`0x57e114B691Db790C35207b2e685D4A43181e6061`](https://etherscan.io/address/0x57e114B691Db790C35207b2e685D4A43181e6061) | Governance token | **No** (EIP-1967 slot empty) |
| **sENA (Staked ENA)** | [`0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9`](https://etherscan.io/address/0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9) | Staked ENA for rewards | **Yes** (TransparentUpgradeableProxy) |
| **rsENA (Restaked ENA)** | [`0xc65433845ecd16688eda196497fa9130d6c47bd8`](https://etherscan.io/address/0xc65433845ecd16688eda196497fa9130d6c47bd8) | Restaked ENA | **Yes** (Proxy) |
| **USDe Token** | [`0x4c9edd5852cd905f086c759e8383e09bff1e68b3`](https://etherscan.io/address/0x4c9edd5852cd905f086c759e8383e09bff1e68b3) | Synthetic dollar stablecoin | No |
| **sUSDe Token** | [`0x9d39a5de30e57443bff2a8307a4256c8797a3497`](https://etherscan.io/address/0x9d39a5de30e57443bff2a8307a4256c8797a3497) | Staked USDe (yield-bearing) | No |
| **EthenaMinting V2** | [`0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3`](https://etherscan.io/address/0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3) | USDe mint/redeem | No |
| **StakingRewardsDistributor** | [`0xf2fa332bd83149c66b09b45670bce64746c6b439`](https://etherscan.io/address/0xf2fa332bd83149c66b09b45670bce64746c6b439) | sUSDe rewards distribution | No |

### Multisig Wallets

| Wallet | Address | Threshold | Role | Members Elected by ENA? |
|--------|---------|-----------|------|-------------------------|
| **Dev Multisig** | [`0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | 5-of-11 | Owner of all core contracts | **No** |
| **Hot Swap** | [`0x4423198f26764a8ce9ac8f1683c476854c885d9d`](https://etherscan.io/address/0x4423198f26764a8ce9ac8f1683c476854c885d9d) | 4-of-9 | Receives protocol revenue; converts to USDe | **No** |
| **sUSDe Payout** | [`0x71e4f98e8f20c88112489de3dded4489802a3a87`](https://etherscan.io/address/0x71e4f98e8f20c88112489de3dded4489802a3a87) | 3-of-11 | Distributes rewards to stakers | **No** |
| **Trading Operations** | [`0x0a0b96A730ED5CDa84bcB63c1Ee2edCb6B7764d6`](https://etherscan.io/address/0x0a0b96A730ED5CDa84bcB63c1Ee2edCb6B7764d6) | 4-of-8 | Team dApp interactions | **No** |
| **Reserve Fund** | [`0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5`](https://etherscan.io/address/0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5) | 4-of-10 | Negative funding backup | **No** |

**Critical Finding:** None of the multisig members are elected by ENA tokenholders. All signers are appointed by Ethena Labs. Documentation claims 4/8 threshold, but onchain verification shows 5/11 for Dev Multisig.

---

## Governance and Ownership Model

### Ownership Topology

```
ENA Token (NOT upgradeable)
    │
    └─► Owner: Dev Multisig (5-of-11)
            │
            ├─► Can: mint() up to 10% per year, after 365-day wait
            ├─► Can: transferOwnership()
            └─► Cannot: renounceOwnership() (blocked in code)
                    │
                    └─► Multisig Signers: 11 EOAs (Ethena Labs controlled)

sENA Token (UPGRADEABLE - TransparentUpgradeableProxy)
    │
    ├─► Implementation: 0x7fd57b46ae1a7b14f6940508381877ee03e1018b
    ├─► ProxyAdmin: 0xf849d7792ff9b30a57656ee10a2776bcb49f4fe4
    │       └─► Owner: Dev Multisig (5-of-11)
    └─► Can upgrade contract logic without tokenholder approval

rsENA Token (UPGRADEABLE - Proxy)
    │
    ├─► Implementation: 0x09bba67c316e59840699124a8dc0bbda6a2a9d59
    ├─► ProxyAdmin: 0xa59b36aca119a30c527eddaa386eb130bcf1939f
    │       └─► Owner: 0x27a907d1f809e8c03d806dc31c8e0c545a3187fc (5-of-8 multisig, DIFFERENT from Dev Multisig)
    └─► Can upgrade contract logic without tokenholder approval

USDe Token (not upgradeable)
    │
    ├─► Owner: Dev Multisig (5-of-11)
    └─► Minter: EthenaMinting V2 contract

sUSDe Token (not upgradeable)
    │
    └─► Owner: Dev Multisig (5-of-11)
            │
            ├─► DEFAULT_ADMIN_ROLE: Dev Multisig
            ├─► REWARDER_ROLE: StakingRewardsDistributor
            ├─► BLACKLIST_MANAGER_ROLE: [holder TBD]
            └─► Can: redistributeLockedAmount() (seize frozen assets)

EthenaMinting V2 (not upgradeable)
    │
    └─► Owner: Dev Multisig (5-of-11)
            │
            ├─► DEFAULT_ADMIN_ROLE: Can set max mint/redeem for USDe
            ├─► GATEKEEPER_ROLE: Can disable USDe mint/redeem globally
            ├─► MINTER_ROLE: 20 EOAs (Ethena-controlled)
            └─► REDEEMER_ROLE: 20 EOAs (Ethena-controlled)

StakingRewardsDistributor
    │
    ├─► Owner: Dev Multisig (5-of-11)
    └─► Operator: 0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e (EOA)
            └─► Can call transferInRewards() to distribute USDe to sUSDe stakers
```

### Role Matrix (Onchain Verified)

| Contract | Role | Current Holder | Holder Type | Verification |
|----------|------|----------------|-------------|--------------|
| ENA | owner() | [`0x3b0aaf6e...`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | Multisig (5/11) | `eth_call owner()` |
| sENA | ProxyAdmin owner | [`0x3b0aaf6e...`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | Multisig (5/11) | `eth_getStorageAt` EIP-1967 admin slot → ProxyAdmin → owner() |
| sENA | DEFAULT_ADMIN_ROLE | [`0x3b0aaf6e...`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | Multisig (5/11) | `eth_call hasRole(0x00,addr)` → true |
| USDe | owner() | [`0x3b0aaf6e...`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | Multisig (5/11) | `eth_call owner()` |
| USDe | minter() | [`0xe3490297...`](https://etherscan.io/address/0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3) | EthenaMinting V2 | `eth_call minter()` |
| sUSDe | owner() | [`0x3b0aaf6e...`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | Multisig (5/11) | `eth_call owner()` |
| EthenaMinting | owner() | [`0x3b0aaf6e...`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | Multisig (5/11) | `eth_call owner()` |
| StakingRewardsDistributor | owner() | [`0x3b0aaf6e...`](https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862) | Multisig (5/11) | `eth_call owner()` |
| StakingRewardsDistributor | operator() | [`0xe3880B79...`](https://etherscan.io/address/0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e) | **EOA** | `eth_call operator()` |
| rsENA | ProxyAdmin owner | [`0x27a907d1...`](https://etherscan.io/address/0x27a907d1f809e8c03d806dc31c8e0c545a3187fc) | Multisig (5/8) | `eth_getStorageAt` EIP-1967 admin slot → ProxyAdmin → owner() |

### Dev Multisig Composition

**Threshold:** 5-of-11
**Verified:** `eth_call getThreshold()` → 5
**Owners:** `eth_call getOwners()` → 11 addresses

```
0x18d32b1ab042b5e9a3430e77fde8b4783a019234
0xb93c042c688f1cf038bab03c4f832f2630bb7d8f
0x66892c66711b2640360c3123e6c23c0cfa50550f
0xe3f95f2e1adec092337fb5d93c1fe87558658b11
0x99682f56f4cccf61bd7e449924f2f62d395e1e45
0x980742edea6b0df3566c19ff4945c57e95449a13
0x690d1e0fac0599874b849ee88aea27f7b348e1f2
0x54d0d64f7326b128959bf37ed7b5f2510656a471
0xfbe49a82cb2bff6fa4c2b1f0d165a5e1175aac83
0xe987e14b2e204fdf5827a3cfca7d476e8df6a99e
0xe5ca87da3a209ad85fdcbb515e1bd92644e9e1a6
```

---

## Metric 1: Onchain Control

### 1.1 Onchain Governance Workflow

**Status:** ⚠️
**Finding:** Governance is offchain Snapshot signaling. No onchain execution.

ENA holders vote via Snapshot at [`ethenagovernance.eth`](https://snapshot.org/#/ethenagovernance.eth). These votes are:
- **Non-binding** - Snapshot votes do not trigger onchain transactions
- **Advisory only** - The Dev Multisig decides whether to execute
- **No timelock** - Multisig can act immediately or ignore votes entirely

**Evidence:**
- Snapshot space: [ethenagovernance.eth](https://snapshot.org/#/ethenagovernance.eth)
- Governance docs: "fully on-chain governance is not a practical or viable option at present" ([source](https://docs.ethena.fi/solution-overview/governance))

### 1.2 Role Accountability

**Status:** ⚠️
**Finding:** All privileged roles are controlled by Ethena Labs multisigs or EOAs, NOT by ENA tokenholders.

**Multisig Control Analysis:**

| Multisig | What It Controls | ENA Holder Authority |
|----------|------------------|---------------------|
| **Dev Multisig** (5/11) | All contract ownership, upgrades, minting, parameter changes | **None** - signers not elected |
| **Hot Swap** (4/9) | Protocol revenue flow, USDe conversion | **None** - signers not elected |
| **sUSDe Payout** (3/11) | Staker reward distribution timing/amounts | **None** - signers not elected |
| **Trading Operations** (4/8) | Onchain operational activities | **None** - signers not elected |
| **Reserve Fund** (4/10) | Emergency reserve deployment | **None** - signers not elected |

**EOA Control Points:**

| Role | Address | Powers |
|------|---------|--------|
| StakingRewardsDistributor Operator | [`0xe3880B79...`](https://etherscan.io/address/0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e) (EOA) | Can trigger `transferInRewards()` to distribute USDe to sUSDe stakers |
| Minters | 20 EOAs | Can mint USDe via EthenaMinting |
| Redeemers | 20 EOAs | Can redeem USDe via EthenaMinting |
| Gatekeepers | 3+ EOAs | Can disable USDe mint/redeem globally |

**Risk Committee:** ENA holders vote bi-annually for Risk Committee members via Snapshot. However, the Committee has no onchain authority - it only advises the multisig. **No mechanism exists for ENA holders to remove or replace multisig signers.**

**Source:** [Multisig Matrix](https://docs.ethena.fi/solution-design/key-trust-assumptions/matrix-of-multisig-and-timelocks)

### 1.3 Protocol Upgrade Authority

**Status:** ⚠️
**Finding:** sENA is upgradeable via TransparentUpgradeableProxy. The Dev Multisig controls upgrades without tokenholder approval.

**sENA Upgrade Path (Verified Onchain):**

```
sENA Proxy: 0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9
    │
    ├─► Implementation: 0x7fd57b46ae1a7b14f6940508381877ee03e1018b
    │   (EIP-1967 slot: 0x360894...bbc)
    │
    └─► ProxyAdmin: 0xf849d7792ff9b30a57656ee10a2776bcb49f4fe4
            │
            └─► Owner: 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 (Dev Multisig)
```

**Verification:**
```bash
# sENA implementation slot
eth_getStorageAt(0x8bE3...b9, 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc)
# Result: 0x7fd57b46ae1a7b14f6940508381877ee03e1018b

# sENA admin slot
eth_getStorageAt(0x8bE3...b9, 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103)
# Result: 0xf849d7792ff9b30a57656ee10a2776bcb49f4fe4

# ProxyAdmin owner
eth_call owner() on 0xf849d7792ff9b30a57656ee10a2776bcb49f4fe4
# Result: 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 (Dev Multisig)
```

**rsENA Upgrade Path (Verified Onchain):**

```
rsENA Proxy: 0xc65433845ecd16688eda196497fa9130d6c47bd8
    │
    ├─► Implementation: 0x09bba67c316e59840699124a8dc0bbda6a2a9d59
    │   (EIP-1967 slot: 0x360894...bbc)
    │
    └─► ProxyAdmin: 0xa59b36aca119a30c527eddaa386eb130bcf1939f
            │
            └─► Owner: 0x27a907d1f809e8c03d806dc31c8e0c545a3187fc (5-of-8 multisig)
```

**Verification:**
```bash
# rsENA admin slot
eth_getStorageAt(0xc654...d8, 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103)
# Result: 0xa59b36aca119a30c527eddaa386eb130bcf1939f

# rsENA ProxyAdmin owner
eth_call owner() on 0xa59b36aca119a30c527eddaa386eb130bcf1939f
# Result: 0x27a907d1f809e8c03d806dc31c8e0c545a3187fc

# rsENA ProxyAdmin owner threshold
eth_call getThreshold() on 0x27a907d1f809e8c03d806dc31c8e0c545a3187fc
# Result: 5

# rsENA ProxyAdmin owner owners count
eth_call getOwners() on 0x27a907d1f809e8c03d806dc31c8e0c545a3187fc
# Result: 8 addresses
```

**Note:** The rsENA ProxyAdmin owner (`0x27a907d1...`) is a **different multisig** from the Dev Multisig. This is a 5-of-8 Safe with signers not publicly identified.

**Non-upgradeable contracts:** ENA, USDe, sUSDe, EthenaMinting V2

### 1.4 Token Upgrade Authority

**Status:** ⚠️
**Finding:** The ENA token itself is NOT upgradeable. It uses `Ownable2Step`, not a proxy pattern.

**Verification that ENA is NOT a proxy:**
```bash
# Check EIP-1967 implementation slot (empty = not a proxy)
eth_getStorageAt(0x57e114B691Db790C35207b2e685D4A43181e6061, 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc)
# Result: 0x0000000000000000000000000000000000000000000000000000000000000000
```

The ENA token behavior is **immutable**. No upgrade mechanism exists.

**Source:** [ENA.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/ENA.sol) - inherits `Ownable2Step`, `ERC20Burnable`, `ERC20Permit`

### 1.5 Supply Control

**Status:** ⚠️
**Finding:** Rate-limited but discretionary ENA minting controlled by multisig.

**Mint Function ([ENA.sol lines 42-49](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/ENA.sol#L42-L49)):**
```solidity
function mint(address to, uint256 amount) external onlyOwner {
  if (block.timestamp - lastMintTimestamp < MINT_WAIT_PERIOD) revert MintWaitPeriodInProgress();
  uint256 _maxInflationAmount = totalSupply() * MAX_INFLATION / 100;
  if (amount > _maxInflationAmount) revert MaxInflationExceeded();
  lastMintTimestamp = uint40(block.timestamp);
  _mint(to, amount);
}
```

**Constraints:**
- `MAX_INFLATION = 10` (10% of total supply per mint)
- `MINT_WAIT_PERIOD = 365 days` (minimum time between mints)
- Owner (Dev Multisig) can invoke without tokenholder approval

**Current state:**
- **Total supply:** 15,000,000,000 ENA (verified: `eth_call totalSupply()`)
- **Burn:** Anyone can burn their own tokens (`ERC20Burnable`)

### 1.6 Privileged Access Gating

**Status:** ⚠️
**Finding:** Multiple privileged roles can restrict or control economically meaningful protocol actions.

**Per [Multisig Matrix Documentation](https://docs.ethena.fi/solution-design/key-trust-assumptions/matrix-of-multisig-and-timelocks):**

| Role | Holder | Powers | Impact |
|------|--------|--------|--------|
| **Owner (EthenaMinting)** | Dev Multisig | Transfer ownership, add/remove collateral assets, add/remove custodians, set max mint/redeem limits for USDe | Can change protocol parameters |
| **Admin (EthenaMinting)** | Dev Multisig | Grant/revoke Minter, Redeemer, Gatekeeper roles | Controls who can mint/redeem USDe |
| **Gatekeeper** | 3+ EOAs (Ethena + external) | `disableMintRedeem()`, `removeMinterRole()`, `removeRedeemerRole()` | Can halt USDe mint/redeem globally |
| **Minter** | 20 EOAs | Execute `mint()` and `transferToCustody()` on EthenaMinting | Can mint USDe |
| **Redeemer** | 20 EOAs | Execute `redeem()` on EthenaMinting | Can redeem USDe |
| **Operator (StakingRewardsDistributor)** | 1 EOA | `transferInRewards()` to distribute USDe to sUSDe stakers | Controls reward distribution timing |

**GATEKEEPER_ROLE powers ([EthenaMinting.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/EthenaMinting.sol)):**
- [`disableMintRedeem()`](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/EthenaMinting.sol#L278) - Sets maxMintPerBlock and maxRedeemPerBlock to 0
- [`removeMinterRole()`](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/EthenaMinting.sol#L339) - Revokes minter authorization
- [`removeRedeemerRole()`](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/EthenaMinting.sol#L345) - Revokes redeemer authorization

**Key asymmetry:** Gatekeepers can halt, but **only the Owner (multisig) can re-enable** functionality.

### 1.7 Token Censorship

**Status:** ⚠️
**Finding:** ENA base token has no blacklist. sENA and sUSDe have blacklist/freeze capability.

**ENA Token:** No freeze/blacklist functions. Standard ERC20 with burn capability.

**sENA/sUSDe Blacklist ([StakedUSDe.sol lines 26-32](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakedUSDe.sol#L26-L32)):**
```solidity
bytes32 private constant BLACKLIST_MANAGER_ROLE = keccak256("BLACKLIST_MANAGER_ROLE");
bytes32 private constant SOFT_RESTRICTED_STAKER_ROLE = keccak256("SOFT_RESTRICTED_STAKER_ROLE");
bytes32 private constant FULL_RESTRICTED_STAKER_ROLE = keccak256("FULL_RESTRICTED_STAKER_ROLE");
```

- **SOFT_RESTRICTED:** Cannot stake/unstake
- **FULL_RESTRICTED:** Cannot transfer at all (frozen)
- [`redistributeLockedAmount()`](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakedUSDe.sol#L106-L127): Admin can seize and redistribute frozen assets

---

## Metric 2: Value Accrual

### 2.1 Accrual Active

**Status:** ⚠️
**Finding:** ENA/sENA holders do NOT currently receive USDe protocol yield. sENA receives only ecosystem airdrops. Fee switch (which would share protocol revenue with sENA) is pending activation.

**Current sENA Value Sources:**

1. **Ethena Network Airdrops:** Protocols in the Ethena Network commit portions of their token supply to sENA holders
   - Example: Ethereal committed 15% of tokens to sENA holders
   - Source: [Ethena Network docs](https://docs.ethena.fi/ethena-network)

2. **Fee Switch (Pending Activation):** Forum posts received positive signals, but Snapshot vote and onchain execution still pending
   - USDe supply: ~5.98B (verified: `eth_call totalSupply()` on USDe)
   - Cumulative revenue: **$500M+** as of Sept 2025 per Ethena announcement; $665M annual fees per [DefiLlama](https://defillama.com/protocol/ethena)
   - Status: Requires Risk Committee sign-off + Snapshot vote + multisig execution

**rsENA (Restaked ENA):**
- Contract: [`0xc65433845ecd16688eda196497fa9130d6c47bd8`](https://etherscan.io/address/0xc65433845ecd16688eda196497fa9130d6c47bd8)
- Total supply: ~5,240,606 rsENA (verified: `eth_call totalSupply()`)
- Purpose: Generalized restaking via Symbiotic partnership to provide economic security for USDe cross-chain transfers using LayerZero's DVN messaging system
- **Mellow Finance Vault:** rsENA is available via [Mellow Finance vault](https://app.mellow.finance/vaults/ethereum-rsena)
- **Rewards:** rsENA holders receive additional rewards in both ENA and USDe for providing economic security. Per [ENA docs](https://docs.ethena.fi/ena), restaked ENA serves as the first infrastructure layer for the Ethena Network

**Evidence:**
- sENA total supply: 911,543,344 (verified: `eth_call totalSupply()`)
- Fee switch forum: [ENA Fee Switch Parameters](https://gov.ethenafoundation.com/t/ena-fee-switch-parameters/396)

### 2.2 Treasury Ownership

**Status:** ⚠️
**Finding:** Protocol revenue flows through multisig-controlled wallets. Treasury is NOT tokenholder-controlled.

**Revenue Flow ([Key Addresses docs](https://docs.ethena.fi/solution-design/key-addresses)):**

```
Protocol Operations (delta-neutral strategies)
    │
    └─► Hot Swap Multisig (4/9): 0x4423198f26764a8ce9ac8f1683c476854c885d9d
            │ (receives protocol revenue, converts to USDe)
            │
            └─► sUSDe Payout Multisig (3/11): 0x71e4f98e8f20c88112489de3dded4489802a3a87
                    │ (distributes to stakers via StakingRewardsDistributor)
                    │
                    └─► StakingRewardsDistributor → sUSDe Stakers
```

**Treasury Addresses:**
- **Hot Swap** (revenue receiver): [`0x4423198f26764a8ce9ac8f1683c476854c885d9d`](https://etherscan.io/address/0x4423198f26764a8ce9ac8f1683c476854c885d9d)
- **sUSDe Payout** (staker rewards): [`0x71e4f98e8f20c88112489de3dded4489802a3a87`](https://etherscan.io/address/0x71e4f98e8f20c88112489de3dded4489802a3a87)
- **Reserve Fund** (negative funding backup): [`0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5`](https://etherscan.io/address/0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5)
- **Trading Operations**: [`0x0a0b96A730ED5CDa84bcB63c1Ee2edCb6B7764d6`](https://etherscan.io/address/0x0a0b96A730ED5CDa84bcB63c1Ee2edCb6B7764d6)

**Key Finding:** Revenue ($500M+ cumulative as of Sept 2025) flows through Hot Swap → sUSDe Payout → sUSDe stakers. **ENA tokenholders do NOT directly control these treasury flows.** Distribution decisions are discretionary by multisig signers.

**Vesting Contracts:** Aragon has not been able to verify onchain vesting contract addresses for Foundation and Ecosystem Development ENA allocations. These allocations appear to be held in multisig wallets rather than programmatic vesting contracts.

### 2.3 Accrual Mechanism Control (ENA-Specific)

**Status:** ⚠️
**Finding:** All ENA value accrual mechanisms are controlled by multisigs or EOAs, not by ENA tokenholders.

**ENA Value Accrual Controls:**

| Mechanism | Controller | Control Type | Tokenholder Input |
|-----------|------------|--------------|-------------------|
| **Fee Switch Activation** | Dev Multisig (5/11) + Risk Committee | Discretionary | Snapshot vote (advisory only) |
| **Ethena Network Airdrops** | Ethena Foundation | Discretionary allocation | None |
| **sENA Upgrade** | Dev Multisig via ProxyAdmin | Unilateral | None |
| **rsENA Upgrade** | 5-of-8 multisig | Unilateral | None |
| **rsENA Restaking Rewards** | Symbiotic integration | Protocol-determined | None |

**Fee Switch Control:**
- The fee switch, which would direct protocol revenue to sENA holders, requires:
  1. Risk Committee approval (members elected via Snapshot, but Committee is advisory)
  2. Governance Snapshot vote (non-binding)
  3. Dev Multisig execution (discretionary)
- ENA tokenholders cannot force fee switch activation even with majority support

**Ecosystem Airdrop Control:**
- Protocols joining Ethena Network commit token allocations to sENA holders
- These commitments are negotiated by Ethena Foundation, not governed by ENA holders
- Distribution parameters set by each protocol, not by ENA governance

**sENA/rsENA Upgrade Control:**
- sENA can be upgraded by Dev Multisig without tokenholder vote
- rsENA can be upgraded by a separate 5-of-8 multisig without tokenholder vote
- No timelock on upgrades: changes can be immediate
- **Upgrade Risk:** Contract upgrades could modify or eliminate value accrual mechanisms for sENA/rsENA holders without prior notice or tokenholder approval

### 2.4 Offchain Value Accrual

**Status:** ⚠️
**Finding:** USDe yield is generated offchain from multiple sources, but ENA/sENA holders do NOT currently receive this yield. Only sUSDe holders receive yield.

**USDe Yield Sources (per [Coin Metrics analysis](https://coinmetrics.substack.com/p/state-of-the-network-issue-335)):**

| Source | Mechanism | Estimated Yield | Verifiable Onchain? |
|--------|-----------|-----------------|---------------------|
| **CEX Funding Rates** | Delta-neutral hedging (long spot, short perps) | 5-20%+ variable | No (CEX positions) |
| **ETH Staking** | stETH/wBETH collateral earns validator rewards | ~3-4% | Partially (collateral visible) |
| **Treasury/BUIDL** | USDtb backed by BlackRock BUIDL fund | ~4-5% | Partially (USDtb holdings) |

**Yield Distribution Flow:**
1. Yield generated offchain (CEX funding) and onchain (staking, treasury)
2. Revenue settles through Copper ClearLoop custody (offchain)
3. Hot Swap multisig receives and converts to USDe
4. sUSDe Payout multisig transfers to StakingRewardsDistributor
5. Operator EOA calls `transferInRewards()` to distribute to **sUSDe stakers only**

**Code Reference:** [StakingRewardsDistributor.sol lines 88-94](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakingRewardsDistributor.sol#L88-L94)

**Critical Distinction for ENA Holders:**
- **sUSDe holders** receive USDe yield (currently ~3.5-29% APY depending on market conditions)
- **sENA holders** do NOT receive USDe yield. They receive only:
  1. Ethena Network ecosystem airdrops (discretionary)
  2. Potential fee switch revenue (pending activation)
- **ENA holders** (unstaked) receive nothing

**Unverifiable Onchain:** Actual CEX hedge positions, custody balances, real-time collateralization ratios, and reserve adequacy cannot be verified onchain. Users must trust Ethena's offchain operations and third-party custodians (Copper, Ceffu, Cobo).

---

## Metric 3: Verifiability

### 3.1 Token Contract Source Verification

**Status:** ✅
**Finding:** ENA token is verified on Etherscan and matches GitHub source.

| Contract | Etherscan | GitHub | Verified |
|----------|-----------|--------|----------|
| ENA | [`0x57e114B691Db790C35207b2e685D4A43181e6061`](https://etherscan.io/address/0x57e114B691Db790C35207b2e685D4A43181e6061#code) | [ENA.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/ENA.sol) | ✅ |

### 3.2 Protocol Component Source Verification

**Status:** ✅
**Finding:** All core protocol contracts are verified and open source.

| Contract | Etherscan | GitHub | Verified |
|----------|-----------|--------|----------|
| ENA | [`0x57e114B6...`](https://etherscan.io/address/0x57e114B691Db790C35207b2e685D4A43181e6061#code) | [ENA.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/ENA.sol) | ✅ |
| sENA | [`0x8bE3460A...`](https://etherscan.io/address/0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9#code) | Verified on Etherscan; no public GitHub repo identified | ✅ |
| USDe | [`0x4c9edd58...`](https://etherscan.io/address/0x4c9edd5852cd905f086c759e8383e09bff1e68b3#code) | [USDe.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/USDe.sol) | ✅ |
| sUSDe | [`0x9d39a5de...`](https://etherscan.io/address/0x9d39a5de30e57443bff2a8307a4256c8797a3497#code) | [StakedUSDeV2.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakedUSDeV2.sol) | ✅ |
| EthenaMinting | [`0xe3490297...`](https://etherscan.io/address/0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3#code) | [EthenaMinting.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/EthenaMinting.sol) | ✅ |
| StakingRewardsDistributor | [`0xf2fa332b...`](https://etherscan.io/address/0xf2fa332bd83149c66b09b45670bce64746c6b439#code) | [StakingRewardsDistributor.sol](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakingRewardsDistributor.sol) | ✅ |

**Audits:**
- Quantstamp (October 2023): [Report](https://596495599-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsBsPyff5ft3inFy9jyjt%2Fuploads%2F17Ucep7IYMBZ6mAHGLyw%2FEthena%20Final%20Report%20(1).pdf)
- Code4rena (October 2023): [Audit Repo](https://github.com/code-423n4/2023-10-ethena)
- Code4rena (November 2024): [Audit Repo](https://github.com/code-423n4/2024-11-ethena-labs)

---

## Metric 4: Token Distribution

### 4.1 Ownership Concentration

**Status:** ⚠️
**Finding:** 70% insider allocation; significant concentration.

**Initial Allocation:**
| Category | Percentage | Amount |
|----------|------------|--------|
| Core Contributors | 30% | 4,500,000,000 ENA |
| Ecosystem Development | 28% | 4,200,000,000 ENA |
| Investors | 25% | 3,750,000,000 ENA |
| Foundation | 15% | 2,250,000,000 ENA |
| Binance Launchpool | 2% | 300,000,000 ENA |

**Insider Bloc:** Contributors (30%) + Investors (25%) + Foundation (15%) = **70%**

**Current State (as of 2026-02-24):**
- Total Supply: 15,000,000,000 ENA
- Circulating: ~8,225,000,000 ENA (54.83%)
- Locked: ~6,775,000,000 ENA (45.17%)

**Source:** [Tokenomist.ai](https://tokenomist.ai/ethena)

### 4.2 Future Token Unlocks

**Status:** ⚠️
**Finding:** Material unlocks ongoing for ALL vesting categories through 2028.

**Vesting Schedules (per [Tokenomics docs](https://docs.ethena.fi/ena/tokenomics)):**

| Category | Cliff | Vesting | TGE | Full Unlock |
|----------|-------|---------|-----|-------------|
| **Core Contributors** (30%) | 1 year, 25% unlock | 3-year linear monthly | March 5, 2024 | ~April 2028 |
| **Investors** (25%) | 1 year, 25% unlock | 3-year linear monthly | March 5, 2024 | ~April 2028 |
| **Ecosystem Development** (28%) | None specified | Linear over 4 years | March 5, 2024 | ~April 2028 |
| **Foundation** (15%) | No vesting disclosed | Discretionary | — | — |

**Upcoming Unlocks (per [Tokenomist.ai](https://tokenomist.ai/ethena)):**
- **March 2, 2026:** Core Contributors unlock (~40.6M ENA)
- Monthly unlocks continue through 2028 for Contributors, Investors, and Ecosystem

**Impact:** Ongoing unlocks increase circulating supply monthly, potentially diluting existing holders.

---

## Metric 5: Offchain Dependencies

### 5.1 Trademark

**Status:** ⚠️
**Finding:** Trademarks owned by Ethena (BVI) Limited, not tokenholders.

Per [Terms of Service](https://docs.ethena.fi/resources/terms-of-service): "The Company's name, trademarks and logos and all related names, logos, product and service names, designs and slogans are trademarks of the Company or its affiliates or licensors."

The Company is **Ethena (BVI) Limited** (Registration number 2127704), a British Virgin Islands entity not controlled by ENA tokenholders.

### 5.2 Distribution

**Status:** ⚠️
**Finding:** Primary interfaces controlled by Ethena (BVI) Limited.

- **Domain:** ethena.fi (not tokenholder-controlled)
- **Terms of Service contracting party:** Ethena (BVI) Limited
- **Governing law:** British Virgin Islands

### 5.3 Licensing

**Status:** ⚠️
**Finding:** Code is open source (GPL-3.0), but IP owned by company.

The smart contract code is licensed under GPL-3.0. However:
- Copyright belongs to Ethena Labs
- "the Company and/or its licensors own all right, title and interest in and to the Services"

---

## Summary: What Do ENA Holders Actually Own?

### They DO Own:
1. ✅ A verified, non-upgradeable ERC20 governance token
2. ✅ Advisory voting power via Snapshot
3. ✅ The ability to stake as sENA for ecosystem airdrops
4. ✅ Potential future fee switch revenue (pending activation)

### They DO NOT Own:
1. ❌ Binding onchain governance power
2. ❌ Authority over multisig signer composition
3. ❌ Direct control over treasury or revenue distribution
4. ❌ Veto power over sENA/rsENA upgrades
5. ❌ IP, trademarks, or legal entity control

### Conclusion

**ENA is a signaling token with economic upside potential, not an ownership token.**

The token provides:
- Voice (Snapshot voting)
- Potential value (fee switch pending, ecosystem airdrops)
- Participation (sENA/rsENA staking)

But lacks:
- Control (multisig decides everything)
- Certainty (fee switch activation discretionary)
- Protection (no timelock, sENA upgradeable, blacklist exists)

---

## Appendix: Onchain Verification Commands

```bash
# ENA owner
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x57e114B691Db790C35207b2e685D4A43181e6061","data":"0x8da5cb5b"},"latest"],"id":1}'
# Result: 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862

# ENA EIP-1967 implementation slot (empty = not a proxy)
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_getStorageAt","params":["0x57e114B691Db790C35207b2e685D4A43181e6061","0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc","latest"],"id":1}'
# Result: 0x0000000000000000000000000000000000000000000000000000000000000000

# sENA implementation slot (HAS implementation = IS a proxy)
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_getStorageAt","params":["0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9","0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc","latest"],"id":1}'
# Result: 0x0000000000000000000000007fd57b46ae1a7b14f6940508381877ee03e1018b

# sENA admin slot
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_getStorageAt","params":["0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9","0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103","latest"],"id":1}'
# Result: 0x000000000000000000000000f849d7792ff9b30a57656ee10a2776bcb49f4fe4

# ProxyAdmin owner
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0xf849d7792ff9b30a57656ee10a2776bcb49f4fe4","data":"0x8da5cb5b"},"latest"],"id":1}'
# Result: 0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 (Dev Multisig)

# Dev Multisig threshold
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862","data":"0xe75235b8"},"latest"],"id":1}'
# Result: 5

# StakingRewardsDistributor operator
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0xf2fa332bd83149c66b09b45670bce64746c6b439","data":"0x570ca735"},"latest"],"id":1}'
# Result: 0xe3880B792F6F0f8795CbAACd92E7Ca78F5d3646e (EOA)

# rsENA admin slot
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_getStorageAt","params":["0xc65433845ecd16688eda196497fa9130d6c47bd8","0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103","latest"],"id":1}'
# Result: 0xa59b36aca119a30c527eddaa386eb130bcf1939f

# rsENA ProxyAdmin owner
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0xa59b36aca119a30c527eddaa386eb130bcf1939f","data":"0x8da5cb5b"},"latest"],"id":1}'
# Result: 0x27a907d1f809e8c03d806dc31c8e0c545a3187fc (5-of-8 multisig)

# rsENA ProxyAdmin owner threshold
curl -X POST https://1rpc.io/eth -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x27a907d1f809e8c03d806dc31c8e0c545a3187fc","data":"0xe75235b8"},"latest"],"id":1}'
# Result: 5
```

---

## Sources

- [ENA Token - Etherscan](https://etherscan.io/address/0x57e114B691Db790C35207b2e685D4A43181e6061)
- [sENA Token - Etherscan](https://etherscan.io/address/0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9)
- [Ethena GitHub - bbp-public-assets](https://github.com/ethena-labs/bbp-public-assets)
- [Code4rena 2023 Audit](https://github.com/code-423n4/2023-10-ethena)
- [Code4rena 2024 Audit](https://github.com/code-423n4/2024-11-ethena-labs)
- [Ethena Governance Docs](https://docs.ethena.fi/solution-overview/governance)
- [Ethena Key Addresses](https://docs.ethena.fi/solution-design/key-addresses)
- [Multisig Matrix](https://docs.ethena.fi/solution-design/key-trust-assumptions/matrix-of-multisig-and-timelocks)
- [Ethena Network](https://docs.ethena.fi/ethena-network)
- [ENA Tokenomics](https://docs.ethena.fi/ena/tokenomics)
- [Snapshot: ethenagovernance.eth](https://snapshot.org/#/ethenagovernance.eth)
- [Fee Switch Proposal](https://gov.ethenafoundation.com/t/ena-fee-switch-parameters/396)
- [Tokenomist.ai - ENA](https://tokenomist.ai/ethena)
- [Ethena Terms of Service](https://docs.ethena.fi/resources/terms-of-service)
- [Mellow Finance rsENA Vault](https://app.mellow.finance/vaults/ethereum-rsena)
- [DefiLlama - Ethena](https://defillama.com/protocol/ethena)
- [Coin Metrics - Ethena and the Mechanics of USDe](https://coinmetrics.substack.com/p/state-of-the-network-issue-335)
