# ETHFI Token Research Plan

## Aragon Ownership Token Framework Analysis

**Target:** ETHFI (Ether.fi Governance Token)
**Token Address:** `0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB` (Ethereum Mainnet)
**Date:** 2026-02-24
**Plan Version:** 2.0 (Updated based on research cycle feedback)

---

## Executive Summary

This research plan maps the Aragon Ownership Token Framework criteria to specific Ether.fi resources and outlines the investigation approach for each metric. The plan addresses three core questions:

1. **What do I own?** — What does the ETHFI tokenholder have unilateral, unalienable control over?
2. **Why should it have value?** — What gives ETHFI economic value?
3. **What threatens that value?** — What conflicts or risks might undermine token value?

### Status of Prior Research

Previous research cycles have completed initial analysis across all framework metrics. This updated plan focuses on:
- Resolving TBD/UNVERIFIED items from prior research
- Validating critical findings (e.g., upgrade authority bypass)
- Ensuring JSON entries accurately reflect research findings
- Addressing discrepancies between research report and JSON entries

---

## Resource Inventory

### Confirmed Sources (URLs Verified)

#### Smart Contracts (Ethereum Mainnet)

| Contract | Address | Type | Verified |
|----------|---------|------|----------|
| ETHFI Token | `0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB` | ERC-20 (Governance) | Yes |
| Liquidity Pool | `0x308861A430be4cce5502d0A12724771Fc6DaF216` | UUPS Proxy | Yes |
| eETH | `0x35fA164735182de50811E8e2E824cFb9B6118ac2` | Rebasing Token | Yes |
| weETH | `0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee` | Wrapped Token | Yes |
| EtherFiTimelock | `0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761` | Timelock | Yes |
| EtherFiAdmin | `0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705` | Admin | Yes |
| Treasury | `0x6329004E903B7F420245E7aF3f355186f2432466` | Treasury | Yes |
| RoleRegistry | `0x1d3Af47C1607A2EF33033693A9989D1d1013BB50` | Access Control | Yes |
| sETHFI Staking | `0x86B5780b606940Eb59A062aA85a07959518c0161` | Staking | Yes |
| EtherFiOracle | `0x57AaF0004C716388B21795431CD7D5f9D3Bb6a41` | Oracle | Yes |
| WithdrawRequestNFT | `0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c` | Withdrawals | Yes |
| EtherFiRedemptionManager | `0xdadef1ffbfeaab4f68a9fd181395f68b4e4e7ae0` | Redemptions | Yes |
| Protocol Multisig (RoleRegistry Owner) | `0x2aCA71020De61bb532008049e1Bd41E451AE8AdC` | 3-of-5 Safe | Yes |
| Foundation Wallet | `0x2f5301a3D59388c509C65f8698f521377D41Fd0F` | EOA/Multisig | To Verify |

#### L2 Token Contracts (Upgradeable - Requires Investigation)

| Network | Contract | Address | Status |
|---------|----------|---------|--------|
| Arbitrum | ETHFI | `0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27` | UUPS - owner unverified |
| Base | ETHFI | `0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2` | UUPS - owner unverified |

#### GitHub Repositories

| Repository | URL | Purpose | Status |
|------------|-----|---------|--------|
| smart-contracts | https://github.com/etherfi-protocol/smart-contracts | Core protocol contracts | Confirmed |
| smart-contracts/audits | https://github.com/etherfi-protocol/smart-contracts/tree/master/audits | Audit reports | Confirmed |
| Certora fork | https://github.com/Certora/etherfi-smart-contracts-fork | Formal verification | Confirmed |

#### Documentation

| Source | URL | Content | Status |
|--------|-----|---------|--------|
| GitBook Docs | https://etherfi.gitbook.io/etherfi | Protocol documentation | Confirmed |
| Governance GitBook | https://etherfi.gitbook.io/gov | Governance documentation | Confirmed |
| ETHFI Allocations | https://etherfi.gitbook.io/gov/ethfi-allocations | Token distribution | Confirmed |
| Buyback Program | https://etherfi.gitbook.io/gov/ethfi-buyback-program | Value accrual mechanism | Confirmed |
| Governance Roadmap | https://etherfi.gitbook.io/gov/governance-roadmap | Decentralization plan | Confirmed |
| Terms of Use | https://etherfi.gitbook.io/etherfi/ether.fi-legal/terms-of-use | Legal terms | Confirmed |

#### Governance Platforms

| Platform | URL | Purpose | Status |
|----------|-----|---------|--------|
| Agora Voting | https://vote.ether.fi | Delegate directory / voting | Confirmed |
| Governance Forum | https://governance.ether.fi | Discussion forum | Confirmed |

#### External Analysis

| Source | URL | Content | Status |
|--------|-----|---------|--------|
| Prisma Risk weETH | https://hackmd.io/@PrismaRisk/weETH | Collateral risk assessment | Confirmed |
| DeFiLlama Unlocks | https://defillama.com/unlocks/ether.fi | Vesting schedules | Confirmed |
| CryptoRank Vesting | https://cryptorank.io/price/ether-fi/vesting | Unlock data | Confirmed |

---

## Priority Actions for Next Research Cycle

### HIGH PRIORITY - Must Resolve

#### 1. Reconcile Protocol Upgrade Authority Findings

**Issue:** The research report states the 3-of-5 multisig can upgrade contracts INSTANTLY without timelock, but the JSON entry states "72-hour Timelock operation."

**Investigation Required:**
1. Re-verify `RoleRegistry.owner()` on-chain
2. Re-verify `_authorizeUpgrade()` logic in protocol contracts
3. Confirm whether the 4-of-7 Timelock multisig or 3-of-5 RoleRegistry multisig controls upgrades
4. Update JSON entry to match verified findings

**On-chain verification commands:**
```
cast call 0x1d3Af47C1607A2EF33033693A9989D1d1013BB50 "owner()(address)" --rpc-url https://eth.llamarpc.com
cast call 0x2aCA71020De61bb532008049e1Bd41E451AE8AdC "getThreshold()(uint256)" --rpc-url https://eth.llamarpc.com
cast call 0x2aCA71020De61bb532008049e1Bd41E451AE8AdC "getOwners()(address[])" --rpc-url https://eth.llamarpc.com
```

**Evidence sufficiency:** Must have on-chain verification + code analysis showing exact upgrade path.

---

#### 2. Verify L2 Token Upgrade Authority

**Status:** Currently TBD in JSON entries

**Investigation Required:**
1. Check Arbitrum ETHFI (`0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27`) proxy admin
2. Check Base ETHFI (`0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2`) proxy admin
3. Trace ownership to understand if L2 tokens can be upgraded and by whom

**On-chain verification commands:**
```
# Arbitrum
cast storage 0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc --rpc-url https://arb1.arbitrum.io/rpc
cast call 0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27 "owner()(address)" --rpc-url https://arb1.arbitrum.io/rpc

# Base
cast storage 0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc --rpc-url https://mainnet.base.org
cast call 0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2 "owner()(address)" --rpc-url https://mainnet.base.org
```

**Evidence sufficiency:** Identify implementation slot, proxy admin, and ownership chain for each L2 token.

---

#### 3. Verify Timelock PROPOSER_ROLE

**Status:** Previously unverified

**Investigation Required:**
1. Query Timelock event logs for RoleGranted events
2. Identify which addresses hold PROPOSER_ROLE, EXECUTOR_ROLE, CANCELLER_ROLE
3. Check the Timelock creation transaction: `0x4400644979dbca4200ec9c64ca78e41c9a870e31ca6ec08b67b2d5e8fb13ad59`

**On-chain verification:**
```
cast logs --address 0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761 --from-block 0 --to-block latest "RoleGranted(bytes32,address,address)" --rpc-url https://eth.llamarpc.com
```

**Evidence sufficiency:** Identify all Timelock role holders with transaction evidence.

---

### MEDIUM PRIORITY - Should Verify

#### 4. Verify sETHFI Contract Ownership

**Investigation Required:**
1. Check sETHFI (`0x86B5780b606940Eb59A062aA85a07959518c0161`) owner
2. Understand reward distribution mechanism
3. Verify if upgradeable

**On-chain verification:**
```
cast call 0x86B5780b606940Eb59A062aA85a07959518c0161 "owner()(address)" --rpc-url https://eth.llamarpc.com
```

---

#### 5. Verify Foundation Wallet Type

**Investigation Required:**
1. Determine if `0x2f5301a3D59388c509C65f8698f521377D41Fd0F` is EOA or multisig
2. If multisig, document threshold and signers

**On-chain verification:**
```
cast code 0x2f5301a3D59388c509C65f8698f521377D41Fd0F --rpc-url https://eth.llamarpc.com
```
- If returns `0x`, it's an EOA
- If returns bytecode, check if Safe proxy

---

#### 6. Document Treasury Holdings

**Investigation Required:**
1. Check actual balance of Treasury contract
2. Identify if protocol treasury is in other wallets
3. Document composition (ETHFI, eETH, ETH, other)

---

### LOWER PRIORITY - Nice to Have

#### 7. Trademark Research

**Investigation Required:**
1. Search USPTO for "ether.fi" and "ETHFI" trademarks
2. Identify registered owner
3. Determine if tokenholder-controlled entity

#### 8. Domain Ownership

**Investigation Required:**
1. WHOIS lookup for ether.fi domain
2. Document registrant

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants ETHFI holders ultimate authority over protocol decisions?

**Current Status:** ❌ (No onchain Governor deployed)

**Sources:**
- Agora voting platform: https://vote.ether.fi/info
- Governance roadmap: https://etherfi.gitbook.io/gov/governance-roadmap

**Done Criteria:**
- Confirm no onchain Governor contract exists
- Document current governance flow (Snapshot → Multisig)
- Note roadmap for future onchain governance

---

#### 1.2 Role Accountability

**Question:** Are all privileged roles governed, revocable, and accountable to ETHFI holders?

**Current Status:** ⚠️ (Multisig-controlled)

**Investigation Required:**
- Verify RoleRegistry owner (3-of-5 multisig confirmed)
- Document all defined roles
- Trace accountability chain

**Done Criteria:**
- Complete list of roles from RoleRegistry
- Ownership chain documented with on-chain evidence

---

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded, and are upgrades controlled by ETHFI holders?

**Current Status:** ⚠️ or ❌ (REQUIRES RESOLUTION - see Priority Action #1)

**Critical Issue:** Discrepancy between research report (multisig direct, no timelock) and JSON entry (72-hour timelock)

**Investigation Required:**
1. Re-verify upgrade authorization path
2. Confirm whether upgrades go through Timelock or direct to multisig
3. Update JSON to match verified findings

**Done Criteria:**
- Definitive answer on whether upgrades are timelocked
- On-chain verification evidence
- Code analysis showing upgrade path

---

#### 1.4 Token Upgrade Authority

**Question:** Can ETHFI token behavior be modified, and are changes controlled by tokenholders?

**Current Status:** TBD (L2 tokens unverified)

**Investigation Required:**
- L1: Confirmed non-upgradeable
- L2 (Arbitrum, Base): Verify proxy owners

**Done Criteria:**
- L2 proxy admin addresses documented
- Ownership chain traced for each L2 token

---

#### 1.5 Supply Control

**Question:** Are ETHFI supply changes programmatic or subject to tokenholder approval?

**Current Status:** ✅ (Fixed 1B supply, no mint function)

**Evidence Already Gathered:**
- Contract has no mint() function
- All 1B minted at deployment
- ERC20Burnable allows holder burning only

**Done Criteria:**
- Verify current totalSupply on-chain
- Confirm no mint pathway in bytecode

---

#### 1.6 Privileged Access Gating

**Question:** Can any actor block or restrict protocol actions or exit paths?

**Current Status:** ⚠️ (Protocol pause exists, token unaffected)

**Evidence Already Gathered:**
- PROTOCOL_PAUSER role can pause operations
- ETHFI token has no pause function

**Done Criteria:**
- List all pausable contracts
- Document pause/unpause authority chain

---

#### 1.7 Token Censorship

**Question:** Can any role freeze, blacklist, seize, or censor ETHFI balances or transfers?

**Current Status:** ⚠️ (L1 clean, L2 upgradeable creates risk)

**Evidence Already Gathered:**
- L1 token: No blacklist/freeze functions
- L2 tokens: Upgradeable - could introduce censorship

**Done Criteria:**
- Confirm L1 has no censorship functions
- Note L2 upgrade risk in evidence

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to ETHFI holders currently active?

**Current Status:** ✅ (Buyback program operational)

**Evidence Already Gathered:**
- Weekly buybacks from withdrawal fees
- Distribution to sETHFI stakers
- Foundation-discretionary execution

**Done Criteria:**
- Verify recent buyback transactions from Foundation wallet
- Document sETHFI distribution mechanism

---

#### 2.2 Treasury Ownership

**Question:** Is the protocol treasury programmatically controlled by ETHFI governance?

**Current Status:** ⚠️ (Timelock-controlled, multisig proposes)

**Investigation Required:**
- Verify Treasury owner is Timelock
- Verify Timelock PROPOSER_ROLE (Priority Action #3)

**Done Criteria:**
- Treasury ownership chain documented
- Timelock role holders identified

---

#### 2.3 Accrual Mechanism Control

**Question:** Can only ETHFI holders modify value capture parameters?

**Current Status:** ⚠️ (Admin-controlled, not tokenholder-controlled)

**Evidence Already Gathered:**
- Fee parameters set by LIQUIDITY_POOL_ADMIN_ROLE
- Buyback percentages not enforced on-chain

**Done Criteria:**
- Document fee setter functions and access control

---

#### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value flows benefiting ETHFI holders?

**Current Status:** TBD (None identified)

**Investigation Required:**
- Check for legally binding revenue sharing
- Review Foundation legal structure

**Done Criteria:**
- Document any offchain value accrual or mark as "None identified"

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is ETHFI source code publicly available and verified?

**Current Status:** ⚠️ (Verified on Etherscan, not on GitHub)

**Evidence Already Gathered:**
- Etherscan verification: Yes
- GitHub publication: No (token contract not in repo)

**Done Criteria:**
- Confirm Etherscan verification
- Note absence from GitHub

---

#### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly verifiable?

**Current Status:** ✅ (All verified)

**Evidence Already Gathered:**
- GitHub repo public with MIT license
- Etherscan verification for all contracts
- Multiple audits available

**Done Criteria:**
- Verify key contracts match GitHub

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does any single actor control majority voting power?

**Current Status:** ⚠️ (55% to insiders, vesting mitigates)

**Evidence Already Gathered:**
- Investors: 33.74% (2-year vest, 1-year cliff)
- Core Contributors: 21.47% (3-year vest, 1-year cliff)
- Treasury: 21.62%
- User Airdrops: 19.27%

**Done Criteria:**
- Verify allocation percentages against documentation
- Check current unlock status

---

#### 4.2 Future Token Unlocks

**Question:** Will future vesting materially affect concentration?

**Current Status:** ⚠️ (Ongoing unlocks)

**Evidence Already Gathered:**
- Daily unlocks ~1.2M ETHFI
- Full vesting by end of 2027/2030

**Done Criteria:**
- Document upcoming cliffs
- Note concentration risk

---

### Offchain Dependencies

#### 5.1 Trademark

**Question:** Are trademarks owned by tokenholder-controlled entity?

**Current Status:** ⚠️ (Company-controlled)

**Evidence Already Gathered:**
- Trademarks owned by Ether.Fi SEZC (Cayman)

**Done Criteria:**
- Document trademark ownership
- Note lack of tokenholder control

---

#### 5.2 Distribution

**Question:** Are primary domains and distribution assets tokenholder-controlled?

**Current Status:** ⚠️ (Company-controlled)

**Evidence Already Gathered:**
- ether.fi domain operated by Ether.Fi SEZC
- No documented relationship to DAO

**Done Criteria:**
- Document domain control
- Note company vs DAO relationship

---

#### 5.3 Licensing

**Question:** Is core protocol IP tokenholder-controlled?

**Current Status:** ⚠️ (Mixed - contracts MIT, other IP restricted)

**Evidence Already Gathered:**
- Smart contracts: MIT license
- Non-contract IP: Company-restricted

**Done Criteria:**
- Document license terms
- Note any restrictions

---

## JSON Entry Reconciliation

The following items require reconciliation between the research report and JSON entries:

### Protocol Upgrade Authority (onchain-ctrl__protocol-upgrade)

| Item | Research Report | JSON Entry | Action |
|------|-----------------|------------|--------|
| Upgrade path | 3-of-5 multisig INSTANT | 72-hour Timelock | MUST VERIFY - critical discrepancy |
| RoleRegistry owner | 3-of-5 multisig | 4-of-7 multisig (Timelock proposer) | Clarify relationship |

### Token Upgrade Authority (onchain-ctrl__token-upgrade)

| Item | Research Report | JSON Entry | Action |
|------|-----------------|------------|--------|
| L2 tokens | Upgradeable, owners unverified | TBD | MUST VERIFY |

### Role Accountability (onchain-ctrl__role-accountability)

| Item | Research Report | JSON Entry | Action |
|------|-----------------|------------|--------|
| Multisig | 3-of-5 at 0x2aCA... | 4-of-7 at 0xcdd5... | Clarify - different multisigs? |

---

## Research Execution Checklist

### Critical (Must Complete)

- [ ] Verify RoleRegistry.owner() on-chain
- [ ] Verify upgrade authorization path (Timelock vs direct multisig)
- [ ] Resolve 3-of-5 vs 4-of-7 multisig discrepancy
- [ ] Verify L2 token (Arbitrum) proxy owner
- [ ] Verify L2 token (Base) proxy owner
- [ ] Verify Timelock PROPOSER_ROLE via event logs

### Important (Should Complete)

- [ ] Verify sETHFI contract owner
- [ ] Determine Foundation wallet type (EOA vs multisig)
- [ ] Document Treasury actual holdings
- [ ] Verify recent buyback transactions

### Optional (Nice to Have)

- [ ] USPTO trademark search
- [ ] WHOIS domain lookup
- [ ] Cross-reference DeFiLlama unlock data

---

## Output Format

The final research report must:

1. **Per-criteria findings** with status (✅/⚠️/❌/TBD)
2. **Evidence bundles** with verified URLs (Etherscan, GitHub, docs)
3. **On-chain verification** with exact commands and outputs
4. **Clear distinction** between confirmed evidence and speculation
5. **Reconciled JSON entries** matching research findings exactly

JSON outputs must match exact schema of `tokens.json` and `metrics.json` with traceable evidence links.

---

## Appendix: On-Chain Verification Commands

```bash
# RoleRegistry owner
cast call 0x1d3Af47C1607A2EF33033693A9989D1d1013BB50 "owner()(address)" --rpc-url https://eth.llamarpc.com

# Timelock min delay
cast call 0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761 "getMinDelay()(uint256)" --rpc-url https://eth.llamarpc.com

# ETHFI total supply
cast call 0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB "totalSupply()(uint256)" --rpc-url https://eth.llamarpc.com

# Safe threshold and owners
cast call 0x2aCA71020De61bb532008049e1Bd41E451AE8AdC "getThreshold()(uint256)" --rpc-url https://eth.llamarpc.com
cast call 0x2aCA71020De61bb532008049e1Bd41E451AE8AdC "getOwners()(address[])" --rpc-url https://eth.llamarpc.com

# Arbitrum ETHFI proxy implementation
cast storage 0x7189fb5B6504bbfF6a852B13B7B82a3c118fDc27 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc --rpc-url https://arb1.arbitrum.io/rpc

# Base ETHFI proxy implementation
cast storage 0x6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc --rpc-url https://mainnet.base.org
```
