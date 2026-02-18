# YB Token Research Plan

## Aragon Ownership Token Framework Analysis

**Target:** YB Token (YieldBasis)
**Token Address:** `0x01791F726B4103694969820be083196cC7c045fF`
**Network:** Ethereum Mainnet
**Date:** 2026-02-18

---

## Overview

This research plan maps each criterion in the Aragon Ownership Token Framework to specific YieldBasis resources and defines the investigation approach. The framework answers three core questions:

1. **What do I own?** — What does the YB tokenholder unilaterally control?
2. **Why should it have value?** — What gives YB economic value?
3. **What threatens that value?** — Are there conflicts or risks that undermine token value?

---

## Resource Inventory

### Confirmed Sources

| Resource | URL | Type | Verified |
|----------|-----|------|----------|
| YB Token Contract | https://etherscan.io/address/0x01791F726B4103694969820be083196cC7c045fF | Explorer | Yes |
| veYB (VotingEscrow) | https://etherscan.io/address/0x8235c179E9e84688FBd8B12295EfC26834dAC211 | Explorer | Yes |
| GaugeController | https://etherscan.io/address/0x1Be14811A3a06F6aF4fA64310a636e1Df04c1c21 | Explorer | Yes |
| FeeDistributor | https://etherscan.io/address/0xD11b416573EbC59b6B2387DA0D2c0D1b3b1F7A90 | Explorer | Yes |
| Factory | https://etherscan.io/address/0x370a449FeBb9411c95bf897021377fe0B7D100c0 | Explorer | Yes |
| MigrationFactoryOwner | https://etherscan.io/address/0xa68343ed4d517a277cfa1f2fc2b51f7a6794b6ad | Explorer | Yes |
| DAO Contract (Aragon OSx) | https://etherscan.io/address/0x42F2A41A0D0e65A440813190880c8a65124895Fa | Explorer | Yes |
| TokenVoting Plugin | https://etherscan.io/address/0x2be6670DE1cCEC715bDBBa2e3A6C1A05E496ec78 | Explorer | Yes |
| Team Vesting | https://etherscan.io/address/0x93Eb25E380229bFED6AB4bf843E5f670c12785e3 | Explorer | Yes |
| Investor Vesting | https://etherscan.io/address/0x11988547B064CaBF65c431c14Ef1b7435084602e | Explorer | Yes |
| Curve Licensing Vesting | https://etherscan.io/address/0x36e36D5D588D480A15A40C7668Be52D36eb206A8 | Explorer | Yes |
| Ecosystem Reserve | https://etherscan.io/address/0x7aC5922776034132D9ff5c7889d612d98e052Cf2 | Explorer | Yes |
| yb-core GitHub | https://github.com/yield-basis/yb-core | GitHub | Yes |
| Documentation - Governance | https://docs.yieldbasis.com/user/governance | Docs | Yes |
| Documentation - Tokenomics | https://docs.yieldbasis.com/user/tokenomics | Docs | Yes |
| Documentation - veYB | https://docs.yieldbasis.com/user/veyb | Docs | Yes |
| Documentation - Audits | https://docs.yieldbasis.com/user/audits-bug-bounties | Docs | Yes |
| YieldBasis App | https://app.yieldbasis.com/ | UI | Yes |
| YieldBasis Website | https://yieldbasis.com/ | Website | Yes |

### Key Source Code Files

| Contract | Source Path | Purpose |
|----------|-------------|---------|
| YB.vy | `contracts/dao/YB.vy` | Token contract with emission logic |
| VotingEscrow.vy | `contracts/dao/VotingEscrow.vy` | veYB locking mechanism |
| GaugeController.vy | `contracts/dao/GaugeController.vy` | Gauge weight voting |
| FeeDistributor.vy | `contracts/dao/FeeDistributor.vy` | Fee distribution to veYB holders |
| VestingEscrow.vy | `contracts/dao/VestingEscrow.vy` | Team/investor vesting |
| Factory.vy | `contracts/Factory.vy` | Pool factory with upgradability |
| MigrationFactoryOwner.vy | `contracts/MigrationFactoryOwner.vy` | Factory admin wrapper |

### Security Audits

| Auditor | Date | Status |
|---------|------|--------|
| Statemind | Feb-May 2025 | Completed |
| Chainsecurity | July 2025 | Completed |
| Quantstamp | April 2025 | Completed |
| Mixbytes | August 2025 | Completed |
| Electisec | August 2025 | Completed |
| Pashov | March-April 2025 | Completed |

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants tokenholders ultimate authority over protocol decisions?

**Sources:**
- DAO Contract: `0x42F2A41A0D0e65A440813190880c8a65124895Fa`
- TokenVoting Plugin: `0x2be6670DE1cCEC715bDBBa2e3A6C1A05E496ec78`
- Documentation: https://docs.yieldbasis.com/user/governance

**Investigation Approach:**
1. Read DAO contract to verify it uses Aragon OSx framework
2. Read TokenVoting plugin to confirm veYB voting
3. Verify thresholds: 30% participation, 55% support, 7-day minimum
4. Check if proposal creation requires minimum 1 veYB
5. Verify execution is automatic on threshold met

**Evidence Sufficiency:**
- ✅ Verified contract addresses showing Aragon OSx deployment
- ✅ Plugin configuration with voting parameters
- ✅ Transaction history showing executed proposals

**Expected Result:** Positive (✅) - Aragon OSx provides onchain governance with veYB voting

---

#### 1.2 Role Accountability

**Question:** Are all privileged roles governed, revocable, and accountable to tokenholders?

**Sources:**
- GaugeController owner check
- FeeDistributor owner check
- Factory admin chain via MigrationFactoryOwner
- veYB owner check
- Vesting contract owner checks

**Investigation Approach:**
1. Call `owner()` on GaugeController - expect DAO address
2. Call `owner()` on FeeDistributor - expect DAO address
3. Trace Factory.admin() → MigrationFactoryOwner → ADMIN immutable → expect DAO
4. Call `owner()` on veYB - check if EOA or DAO
5. Identify owner of vesting contracts (Team, Investor, Curve)

**Evidence Sufficiency:**
- ✅ Each contract's owner() returning DAO address
- ⚠️ Any EOA ownership requires flag

**Expected Result:** Warning (⚠️) - veYB owner and vesting owners appear to be EOAs

**Gaps/Concerns:**
- veYB owner is EOA `0xa39e...` - can potentially modify veYB behavior
- Vesting owner is EOA `0xc167...` - can disable recipients via `toggle_disable()`
- Must verify what powers veYB owner retains

---

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded and is this controlled by tokenholders?

**Sources:**
- Factory contract: `0x370a449FeBb9411c95bf897021377fe0B7D100c0`
- Factory.vy source: `set_implementations()` function
- MigrationFactoryOwner.vy source

**Investigation Approach:**
1. Check if Factory is upgradeable proxy or plain contract
2. Identify `set_implementations()` access control
3. Trace: Factory.admin() → MigrationFactoryOwner → ADMIN immutable
4. Verify ADMIN is DAO address by reading bytecode immutable

**Evidence Sufficiency:**
- ✅ Factory.vy source showing set_implementations requires admin
- ✅ MigrationFactoryOwner bytecode showing ADMIN = DAO
- ✅ Chain: DAO → MigrationFactoryOwner → Factory

**Expected Result:** Warning (⚠️) - Indirect DAO control via wrapper contract

---

#### 1.4 Token Upgrade Authority

**Question:** Can YB token behavior be modified?

**Sources:**
- YB Token: `0x01791F726B4103694969820be083196cC7c045fF`
- YB.vy source

**Investigation Approach:**
1. Check if YB token uses proxy pattern (no proxy = immutable)
2. Call `owner()` - expect 0x0 (renounced)
3. Review YB.vy for any admin functions
4. Verify only GaugeController can call `emit()` for minting

**Evidence Sufficiency:**
- ✅ owner() = 0x0 (verified)
- ✅ No proxy pattern in bytecode
- ✅ snekmate ERC-20 with renounced ownership

**Expected Result:** Positive (✅) - Non-upgradeable with renounced ownership

---

#### 1.5 Supply Control

**Question:** Are supply changes programmatic or tokenholder-controlled?

**Sources:**
- YB.vy source: `emit()` function, emission schedule
- GaugeController: emission caller
- Tokenomics documentation

**Investigation Approach:**
1. Review emission formula in YB.vy (exponential decay)
2. Verify max supply = 1B YB
3. Check who can call `emit()` - should be only GaugeController
4. Verify GaugeController is DAO-owned
5. Track current minted supply (~720M)

**Evidence Sufficiency:**
- ✅ YB.vy showing 1B max supply constant
- ✅ emit() restricted to minter (GaugeController)
- ✅ Exponential decay formula enforced in code

**Expected Result:** Positive (✅) - Programmatic emissions with no discretionary minting

---

#### 1.6 Privileged Access Gating

**Question:** Can any bounded actor block user exits or restrict access?

**Sources:**
- VotingEscrow.vy: `withdraw()` function
- FeeDistributor.vy: `claim()` function
- LT contracts: withdrawal mechanisms

**Investigation Approach:**
1. Review VotingEscrow.withdraw() - should be permissionless after lock expiry
2. Review FeeDistributor.claim() - should be permissionless
3. Check for any pause functions or blocklists
4. Verify no team-controlled emergency pause on user funds

**Evidence Sufficiency:**
- ✅ withdraw() has no admin checks (only lock expiry check)
- ✅ claim() has no admin checks
- ✅ No pause/freeze functions in core contracts

**Expected Result:** Positive (✅) - User exits are permissionless

---

#### 1.7 Token Censorship

**Question:** Can any role freeze, blacklist, or seize token balances?

**Sources:**
- YB.vy source: full contract review
- Standard ERC-20 functions

**Investigation Approach:**
1. Search YB.vy for freeze, blacklist, block, pause functions
2. Verify standard ERC-20 transfer() has no restrictions
3. Check for any admin-controlled transfer restrictions

**Evidence Sufficiency:**
- ✅ No censorship functions in source
- ✅ Standard permissionless transfers

**Expected Result:** Positive (✅) - No censorship capability

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to tokenholders currently active?

**Sources:**
- FeeDistributor: `0xD11b416573EbC59b6B2387DA0D2c0D1b3b1F7A90`
- FeeDistributor transaction history
- veYB documentation

**Investigation Approach:**
1. Check FeeDistributor for recent inbound fee deposits
2. Check for recent claim transactions by veYB holders
3. Verify fee tokens: yb-cbBTC, yb-WBTC, yb-tBTC, yb-WETH
4. Calculate approximate APY from recent distributions

**Evidence Sufficiency:**
- ✅ Recent transactions showing fee deposits and claims
- ✅ Non-zero token balances flowing through distributor

**Expected Result:** Positive (✅) - Active distributions occurring

---

#### 2.2 Treasury Ownership

**Question:** Are treasury assets controlled by tokenholder governance?

**Sources:**
- FeeDistributor owner
- Ecosystem Reserve: `0x7aC5922776034132D9ff5c7889d612d98e052Cf2`
- Protocol Development Reserve

**Investigation Approach:**
1. Verify FeeDistributor.owner() = DAO
2. Check Ecosystem Reserve ownership/control
3. Map all treasury addresses and their control

**Evidence Sufficiency:**
- ✅ FeeDistributor owner = DAO
- ⚠️ Reserve contracts may have different control structures

**Expected Result:** Positive (✅) - DAO controls primary fee distribution

---

#### 2.3 Accrual Mechanism Control

**Question:** Can tokenholders modify value capture parameters?

**Sources:**
- GaugeController: gauge weight voting
- Factory: fee parameters
- Documentation on fee rates

**Investigation Approach:**
1. Verify veYB holders can vote on gauge weights
2. Check if fee rates are DAO-controlled via Factory
3. Trace fee parameter modification path

**Evidence Sufficiency:**
- ✅ GaugeController.vote_for_gauge_weights() accessible to veYB holders
- ✅ Factory fee parameters controlled by admin (DAO via wrapper)

**Expected Result:** Positive (✅) - veYB holders control emissions and DAO controls fees

---

#### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value flows?

**Sources:**
- YieldBasis AG entity information
- Terms of service
- Any revenue sharing agreements

**Investigation Approach:**
1. Research YieldBasis AG corporate structure
2. Check for any offchain revenue commitment to holders
3. Look for legal agreements tying equity to token

**Evidence Sufficiency:**
- Requires offchain legal document verification
- May need entity filings research

**Expected Result:** TBD - Not verified

**Gaps/Concerns:**
- No evidence of offchain value accrual mechanisms
- YieldBasis AG is team-controlled entity

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is YB token source verified and matching deployed bytecode?

**Sources:**
- Etherscan verification status
- yb-core GitHub repository

**Investigation Approach:**
1. Confirm Etherscan shows "Contract Source Code Verified"
2. Match GitHub source to deployed bytecode
3. Note compiler version (Vyper 0.4.3)

**Evidence Sufficiency:**
- ✅ Green checkmark on Etherscan
- ✅ Source available on GitHub matching deployment

**Expected Result:** Positive (✅) - Fully verified

---

#### 3.2 Protocol Component Source Verification

**Question:** Are all core protocol contracts verified?

**Sources:**
- All contract addresses on Etherscan
- yb-core repository
- Audit reports

**Investigation Approach:**
1. Check verification status for each core contract
2. Verify audit coverage of all economically material contracts
3. Note any unverified or closed-source components

**Evidence Sufficiency:**
- ✅ All core contracts verified on Etherscan
- ✅ 6 independent audits completed

**Expected Result:** Positive (✅) - All contracts verified and audited

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does any single actor control majority voting power?

**Sources:**
- veYB supply(): current locked amount
- Top veYB holders analysis
- Token distribution data

**Investigation Approach:**
1. Call veYB.supply() for total locked
2. Analyze top holder addresses
3. Check if any address > 50% of veYB
4. Identify related addresses (team, VC coordination)

**Evidence Sufficiency:**
- Requires holder analysis tools (Dune, Nansen)
- Must identify coordinated control blocks

**Expected Result:** Warning (⚠️) - Concentration risk exists

**Gaps/Concerns:**
- ~70M veYB from ~720M minted (10%)
- Post-cliff, team + investors = 37% of supply
- Coordination between team/investor blocks not independently verified

---

#### 4.2 Future Token Unlocks

**Question:** Will vesting events materially affect concentration?

**Sources:**
- Vesting contract parameters
- VestingEscrow.vy source
- Tokenomics documentation

**Investigation Approach:**
1. Read vesting contract cliff dates (Sept 15, 2025 + 6 months = March 15, 2026)
2. Calculate unlock amounts: Team 250M, Investors 121M
3. Review VestingEscrow owner powers: toggle_disable(), rug_disabled()
4. Assess concentration impact

**Evidence Sufficiency:**
- ✅ Vesting parameters readable onchain
- ⚠️ EOA owner with disable capability is concerning

**Expected Result:** Warning (⚠️) - Imminent cliff with concentration risk

**Gaps/Concerns:**
- 6-month cliff ends ~March 15, 2026 (imminent)
- 37% of supply (371M) begins unlocking
- Vesting owner EOA can disable recipients - trust-based system

---

### Offchain Dependencies

#### Trademark

**Question:** Are trademarks controlled by tokenholder entity?

**Sources:**
- USPTO trademark search
- Swiss trademark registry
- YieldBasis AG corporate records

**Investigation Approach:**
1. Search USPTO for "YieldBasis" trademark
2. Search Swiss IP registry
3. Identify registrant entity

**Evidence Sufficiency:**
- Requires trademark database searches
- Must link to tokenholder-controlled entity

**Expected Result:** TBD - Not verified

**Gaps/Concerns:**
- Likely owned by YieldBasis AG (team entity)
- No evidence of DAO trademark control

---

#### Distribution

**Question:** Are domains and interfaces controlled by tokenholder entity?

**Sources:**
- yieldbasis.com WHOIS
- app.yieldbasis.com hosting
- Terms of service

**Investigation Approach:**
1. Check domain registration details
2. Review terms of service contracting party
3. Identify hosting/infrastructure control

**Evidence Sufficiency:**
- ⚠️ Domain likely team-controlled
- No DAO control over frontend

**Expected Result:** Warning (⚠️) - Team controls distribution

---

#### Licensing

**Question:** Is core IP controlled by tokenholder entity?

**Sources:**
- yb-core license headers
- Factory.vy license
- Curve licensing agreement

**Investigation Approach:**
1. Review license headers in all contracts
2. Note AGPL vs proprietary split
3. Analyze Curve licensing relationship (7.5% of supply)

**Evidence Sufficiency:**
- ✅ License headers in source code
- ⚠️ Mixed licensing (AGPL + proprietary)
- ⚠️ Curve dependency via licensing fee

**Expected Result:** Warning (⚠️) - Mixed licensing with external dependency

---

## Summary of Anticipated Findings

### Positive Areas (✅)
- Onchain governance via Aragon OSx
- Non-upgradeable YB token with renounced ownership
- Programmatic emissions with fixed max supply
- Permissionless user exits
- No censorship capability
- Active fee distributions to veYB holders
- Fully verified and audited contracts

### Areas of Concern (⚠️)
- veYB owner is EOA (not DAO)
- Vesting contract owner is EOA with disable powers
- Imminent vesting cliff (March 2026) with 37% unlock
- Indirect protocol upgrade path via wrapper contract
- Team controls domain and likely trademark
- Mixed licensing with proprietary Factory code
- Curve technology dependency (7.5% licensing fee)

### Unknown/TBD
- Offchain value accrual mechanisms
- Trademark ownership verification
- Current veYB holder concentration analysis
- Coordination between team/investor voting blocks

---

## Execution Checklist

For each criterion, the research agent should:

1. [ ] Read all specified contract addresses
2. [ ] Extract relevant function return values
3. [ ] Trace ownership/admin chains to ultimate authority
4. [ ] Match source code to documented behavior
5. [ ] Record transaction evidence where applicable
6. [ ] Flag any discrepancies from expected results
7. [ ] Note confidence level for each finding

---

## Output Requirements

The research phase should produce:

1. **yb-research.md** — Detailed findings with evidence citations
2. **yb-tokens.json** — Token entry matching schema
3. **yb-metrics.json** — Full metrics entry with all criteria scored

All claims must have:
- Contract address or GitHub line reference
- View function output or transaction hash
- Documentation URL where applicable
