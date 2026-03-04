# YB Token Research Plan — Revised

## Aragon Ownership Token Framework Analysis

**Target:** YB Token (YieldBasis)
**Token Address:** `0x01791F726B4103694969820be083196cC7c045fF`
**Network:** Ethereum Mainnet
**Date:** 2026-02-24
**Revision:** Addresses feedback from Round 1/2 review

---

## Overview

This research plan maps each criterion in the Aragon Ownership Token Framework to specific YieldBasis resources and defines the investigation approach. The framework answers three core questions:

1. **What do I own?** — What does the YB tokenholder unilaterally control?
2. **Why should it have value?** — What gives YB economic value?
3. **What threatens that value?** — Are there conflicts or risks that undermine token value?

**Protocol Description:** Yield Basis is the liquidity protocol designed to eliminate Impermanent Loss (IL) in AMMs using constantly-maintained 2x leveraged liquidity provision.

---

## Key Feedback Items to Address

The following feedback points from Round 1/2 review must be reflected in the research and final deliverables:

### Research Report Updates

| # | Issue | Action Required |
|---|-------|-----------------|
| 1 | veYB owner EOA identity | Note that the EOA has ENS `deployer._yb.eth` |
| 2 | Remove vesting concerns from dashboard | Keep vesting details in research, remove from JSON output |
| 3 | veYB transfer restrictions — reframe | Transfer restriction ≠ censorship. Users remain custodians. Not materially exposed to censorship. |
| 4 | Protocol upgrade authority = ownership | DAO control = ownership. Remove "TBD" qualification. Mark as green check. |
| 5 | Remove access gating for vesting | Drop vesting-related access gating concerns |
| 6 | Fee mechanism — trace admin fee source | Trace `fill_epochs` logic. Clarify where admin fees originate. |
| 7 | FeeDistributor vs Treasury — separate | Programmatic fee flow ≠ discretionary treasury control. Different concepts. |
| 8 | Gauge weight voting = fee control | Frame as: voting for gauge weights gives fees in YB as incentives, controlled by DAO (veYB) |
| 9 | Remove vesting from dashboard JSON | Strip vesting concerns from metrics.json entirely |
| 10 | Protocol upgrade authority = green check | This is ownership. Mark accordingly. |
| 11 | Token censorship — reframe | Deployer can restrict veYB transfers, not YB token. Role Accountability = green check. |
| 12 | Minting rate link is wrong | Find correct code showing % of max YB dependent on ybBTC stake rate |
| 13 | Ecosystem Reserve missing | Research: Is Ecosystem Reserve DAO-controlled? Finding: VestingEscrow controlled by EOA. Add to report. |
| 14 | Vote execution timing | Votes can be executed immediately under preconditions, not "immediately execute" |
| 15 | Remove treasury amount | Remove specific 125M figure (can change, stale is worse than none) |
| 16 | Treasury section restructure | Move fee flow content to Accrual Mechanism Control. Treasury Ownership = discretionary non-automated revenues only. |
| 17 | Protocol revenue ≠ veYB revenue | veYB receives admin_fee (subset), not total protocol revenue. Distinguish clearly. |
| 18 | Protocol description | Use: "Yield Basis is the liquidity protocol designed to eliminate Impermanent Loss (IL) in AMMs using constantly-maintained 2x leveraged liquidity provision" |
| 19 | Attribute fee data source | Credit and link to ValueVerse: https://yb.valueverse.ai |
| 20 | Vesting timeline — correct | 24 months total, 6 month cliff. During cliff: can't sell but CAN lock into veYB (~35M locked). At cliff end (March 2026): 25% unlocks, 75% vests over 18 months. |

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
| ValueVerse Fee Dashboard | https://yb.valueverse.ai | Dashboard | Yes |

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
| LT.vy | `contracts/LT.vy` | Liquidity Token vault with admin fees |
| LiquidityGauge.vy | `contracts/dao/LiquidityGauge.vy` | Staking gauge with adjustment logic |

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
5. **IMPORTANT:** Clarify vote execution timing — votes can be executed immediately when preconditions are met (thresholds achieved, remaining votes cannot change outcome), NOT "immediately execute"

**Evidence Sufficiency:**
- Verified contract addresses showing Aragon OSx deployment
- Plugin configuration with voting parameters
- Transaction history showing executed proposals

**Expected Result:** Positive (✅) — Aragon OSx provides onchain governance with veYB voting

---

#### 1.2 Role Accountability

**Question:** Are all privileged roles governed, revocable, and accountable to tokenholders?

**Sources:**
- GaugeController owner check
- FeeDistributor owner check
- Factory admin chain via MigrationFactoryOwner
- veYB owner check — note ENS: `deployer._yb.eth`
- Ecosystem Reserve ownership (NEW: must research)

**Investigation Approach:**
1. Call `owner()` on GaugeController — expect DAO address
2. Call `owner()` on FeeDistributor — expect DAO address
3. Trace Factory.admin() → MigrationFactoryOwner → ADMIN immutable → expect DAO
4. Call `owner()` on veYB — identify as EOA with ENS `deployer._yb.eth`
5. **NEW:** Research Ecosystem Reserve — verify it's a VestingEscrow controlled by EOA

**Key Reframe (Feedback #3, #11):**
- veYB transfer restrictions do NOT constitute censorship
- The transfer clearance checker restricts veNFT transfers/infinite lock toggles
- Users remain custodians of their locked YB
- Can always withdraw after lock expiry
- **Conclusion:** YB and veYB are NOT materially exposed to censorship

**Evidence Sufficiency:**
- Each contract's owner() returning expected address
- Clear documentation of which are DAO-controlled vs EOA-controlled
- Explicit framing that transfer restrictions ≠ censorship

**Expected Result:** Positive (✅) — All value-impacting roles are accountable. EOA powers do not constitute censorship.

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

**Key Reframe (Feedback #4, #10):**
- DAO controlling protocol upgrades **definitively counts as ownership**
- Indirection through governance process is irrelevant — this IS how tokenholder control works
- Remove any "TBD" qualification
- **Mark as green check (✅)**

**Evidence Sufficiency:**
- Factory.vy source showing set_implementations requires admin
- MigrationFactoryOwner bytecode showing ADMIN = DAO
- Chain: DAO → MigrationFactoryOwner → Factory

**Expected Result:** Positive (✅) — DAO controls protocol upgrades. This is ownership.

---

#### 1.4 Token Upgrade Authority

**Question:** Can YB token behavior be modified?

**Sources:**
- YB Token: `0x01791F726B4103694969820be083196cC7c045fF`
- YB.vy source

**Investigation Approach:**
1. Check if YB token uses proxy pattern (no proxy = immutable)
2. Call `owner()` — expect 0x0 (renounced)
3. Review YB.vy for any admin functions
4. Verify only GaugeController can call `emit()` for minting

**Evidence Sufficiency:**
- owner() = 0x0 (verified)
- No proxy pattern in bytecode
- snekmate ERC-20 with renounced ownership

**Expected Result:** Positive (✅) — Non-upgradeable with renounced ownership

---

#### 1.5 Supply Control

**Question:** Are supply changes programmatic or tokenholder-controlled?

**Sources:**
- YB.vy source: `emit()` function, emission schedule
- GaugeController: emission caller
- **LiquidityGauge.vy: `get_adjustment()` function (Feedback #12)**
- Tokenomics documentation

**Investigation Approach:**
1. Review emission formula in YB.vy (exponential decay)
2. Verify max supply = 1B YB
3. Check who can call `emit()` — should be only GaugeController
4. Verify GaugeController is DAO-owned
5. Track current minted supply (~720M)
6. **NEW (Feedback #12):** Find the correct code showing minting rate dependent on ybBTC stake rate. The `get_adjustment()` function in LiquidityGauge.vy returns `sqrt(staked / totalSupply)` — higher LP staking = higher emission rate. Link to the correct line number.

**Evidence Sufficiency:**
- YB.vy showing 1B max supply constant
- emit() restricted to minter (GaugeController)
- Exponential decay formula enforced in code
- **Correct link** to adjustment logic in LiquidityGauge.vy

**Expected Result:** Positive (✅) — Programmatic emissions with no discretionary minting

---

#### 1.6 Privileged Access Gating

**Question:** Can any bounded actor block user exits or restrict access?

**Sources:**
- VotingEscrow.vy: `withdraw()` function
- FeeDistributor.vy: `claim()` function
- LT contracts: withdrawal mechanisms

**Investigation Approach:**
1. Review VotingEscrow.withdraw() — should be permissionless after lock expiry
2. Review FeeDistributor.claim() — should be permissionless
3. Check for any pause functions or blocklists
4. Verify no team-controlled emergency pause on user funds

**Note (Feedback #5):** Remove vesting-related access gating concerns. Not relevant for this analysis.

**Evidence Sufficiency:**
- withdraw() has no admin checks (only lock expiry check)
- claim() has no admin checks
- No pause/freeze functions in core contracts

**Expected Result:** Positive (✅) — User exits are permissionless

---

#### 1.7 Token Censorship

**Question:** Can any role freeze, blacklist, or seize token balances?

**Sources:**
- YB.vy source: full contract review
- Standard ERC-20 functions
- VotingEscrow.vy: transfer clearance checker

**Investigation Approach:**
1. Search YB.vy for freeze, blacklist, block, pause functions
2. Verify standard ERC-20 transfer() has no restrictions
3. Check for any admin-controlled transfer restrictions on YB token

**Key Reframe (Feedback #3, #11):**
- **YB token itself has no censorship capability**
- veYB transfer clearance checker can restrict veNFT transfers
- This restricts moving the veNFT or toggling infinite locks
- **User remains custodian of assets** — can always withdraw after lock expiry
- This is a transfer restriction, NOT censorship of the underlying YB token
- **Conclusion:** YB and veYB are not materially exposed to censorship

**Evidence Sufficiency:**
- No censorship functions in YB.vy source
- Standard permissionless transfers for YB token
- Clear distinction between veYB transfer restrictions and actual censorship

**Expected Result:** Positive (✅) — No censorship capability. Transfer restrictions ≠ censorship.

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to tokenholders currently active?

**Sources:**
- FeeDistributor: `0xD11b416573EbC59b6B2387DA0D2c0D1b3b1F7A90`
- FeeDistributor transaction history
- LT.vy: `withdraw_admin_fees()` function
- **ValueVerse Dashboard: https://yb.valueverse.ai (Feedback #19)**

**Investigation Approach:**
1. Check FeeDistributor for recent inbound fee deposits
2. Check for recent claim transactions by veYB holders
3. Verify fee tokens: yb-cbBTC, yb-WBTC, yb-tBTC, yb-WETH

**Fee Flow Tracing (Feedback #6):**
1. LT vaults accrue admin fees from LP operations
2. `LT.withdraw_admin_fees()` mints LT tokens to `fee_receiver` (Factory.fee_receiver = FeeDistributor)
3. `FeeDistributor._fill_epochs()` distributes incoming fees over 4-week epochs
4. veYB holders claim pro-rata based on their veYB balance at each epoch

**Key Distinction (Feedback #17):**
- **Protocol revenue** = LP fees + veYB fees, adjusted for position rebalancing expenses
- **veYB revenue** = `admin_fee` (protocol fee) — a **subset** of protocol revenue
- Do NOT conflate total protocol revenue with veYB distributions

**Data Attribution (Feedback #19):**
- Credit ValueVerse as data source for fee metrics: https://yb.valueverse.ai

**Evidence Sufficiency:**
- Recent transactions showing fee deposits and claims
- Non-zero token balances flowing through distributor
- Clear explanation of admin fee source and flow

**Expected Result:** Positive (✅) — Active distributions occurring

---

#### 2.2 Treasury Ownership

**Question:** Are treasury assets controlled by tokenholder governance?

**CRITICAL RESTRUCTURE (Feedback #7, #13, #15, #16):**

**What Treasury Ownership means:**
- Non-automated revenues requiring **discrete transactions** (multisig or DAO txs) to distribute
- **NOT** programmatic fee flows like FeeDistributor (that's Accrual Mechanism Control)

**Investigation Approach:**
1. Identify any discretionary treasury controlled by DAO
2. Research Ecosystem Reserve control (NEW — Feedback #13)
3. **Remove specific treasury amount** (Feedback #15) — stale figures are worse than none

**Ecosystem Reserve Research (Feedback #13):**
- Address: `0x7aC5922776034132D9ff5c7889d612d98e052Cf2`
- Verify it's a VestingEscrow contract
- Check who controls it — expected to be EOA, not DAO

**Scoring Logic:**
- If discretionary treasury owned by veYB (DAO) → **green check (✅)**
- If no discretionary treasury exists → **neutral**
- If Ecosystem Reserve is EOA-controlled → **TBD** with finding noted

**Evidence Sufficiency:**
- Clear distinction between programmatic fees and discretionary treasury
- Ecosystem Reserve ownership verification
- DAO contract holdings check

**Expected Result:** TBD — Ecosystem Reserve is EOA-controlled, requires finding documentation

---

#### 2.3 Accrual Mechanism Control

**Question:** Can tokenholders modify value capture parameters?

**CONTENT MIGRATION (Feedback #16):**
Move the "Discretionary Control" content from Treasury Ownership here. This section covers:
- Direction of automated value flows (fees, gauge rewards)
- Fee parameter control

**Sources:**
- GaugeController: gauge weight voting
- Factory: fee parameters
- MigrationFactoryOwner: fee_receiver control

**Investigation Approach:**
1. Verify veYB holders can vote on gauge weights
2. Check if fee rates are DAO-controlled via Factory
3. Trace fee parameter modification path
4. Document fee_receiver control chain

**Gauge Voting = Fee Control (Feedback #8):**
- Voting for gauge weights directs YB emissions
- Higher gauge weight = more YB emissions to that pool's stakers
- This incentivizes LP staking which generates admin fees
- **Frame as:** veYB holders control fees to YB holders through gauge voting

**Fee Direction Control:**
- DAO controls Factory.fee_receiver via MigrationFactoryOwner
- MigrationFactoryOwner.set_fee_receiver() → Factory.set_fee_receiver()
- This determines where admin fees are routed

**Evidence Sufficiency:**
- GaugeController.vote_for_gauge_weights() accessible to veYB holders
- Factory fee parameters controlled by admin (DAO via wrapper)
- Complete tracing of fee flow direction control

**Expected Result:** Positive (✅) — veYB holders control emissions and DAO controls fee direction

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

**Expected Result:** TBD — Not verified. No evidence of offchain value accrual mechanisms.

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
- Green checkmark on Etherscan
- Source available on GitHub matching deployment

**Expected Result:** Positive (✅) — Fully verified

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
- All core contracts verified on Etherscan
- 6 independent audits completed

**Expected Result:** Positive (✅) — All contracts verified and audited

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
- Requires holder analysis tools
- Must identify coordinated control blocks

**Expected Result:** Warning (⚠️) — Low participation (~10%) means concentration risk exists

---

#### 4.2 Future Token Unlocks

**Question:** Will vesting events materially affect concentration?

**CORRECT VESTING TIMELINE (Feedback #20):**

- **Total vesting period:** 24 months
- **Cliff:** 6 months (ending ~March 2026)
- **During cliff:** Cannot sell, but **CAN lock into veYB**
  - ~35M YB was locked by team and investors during cliff
  - This means holders chose protocol fees over liquidity
- **At cliff end (March 2026):** 25% unlocks
- **Post-cliff:** Remaining 75% vests linearly over 18 months
- **Key insight:** Vesting tokens cannot be instantly used to influence governance — they release gradually

**Affected Allocations:**
- Team: 250M YB
- Investors: 121M YB
- Total: 371M YB (37% of supply)

**Note (Feedback #2, #9):** Keep vesting details in research report for completeness, but **remove vesting-related concerns from dashboard/metrics.json output**.

**Evidence Sufficiency:**
- Vesting parameters readable onchain
- Correct cliff/unlock/vesting schedule documented

**Expected Result:** Warning (⚠️) — Concentration risk with upcoming unlocks, but gradual vesting mitigates sudden governance shifts

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

**Expected Result:** TBD — Likely owned by YieldBasis AG (team entity)

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
- Domain likely team-controlled
- No DAO control over frontend

**Expected Result:** Warning (⚠️) — Team controls distribution

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
- License headers in source code
- Mixed licensing (AGPL + proprietary)
- Curve dependency via licensing fee

**Expected Result:** Warning (⚠️) — Mixed licensing with external dependency

---

## Dashboard Output Requirements

### Removals (Feedback #2, #9, #15)
- Remove vesting concerns from metrics.json
- Remove specific treasury amount (125M figure)

### Status Changes (Feedback #4, #10, #11)
- Protocol Upgrade Authority → ✅ (ownership via DAO)
- Role Accountability → ✅ (transfer restrictions ≠ censorship)
- Token Censorship → ✅ (YB not exposed to censorship)

### Content Migrations (Feedback #16)
- Move fee flow direction content from Treasury Ownership to Accrual Mechanism Control
- Treasury Ownership = discretionary non-automated revenues only

### Reframes (Feedback #3, #8, #14, #17, #18)
- Transfer restrictions ≠ censorship — users remain custodians
- Gauge voting = fee control by veYB
- Vote execution = "can be executed immediately under preconditions"
- Protocol revenue ≠ veYB revenue — admin_fee is subset
- Protocol description: use exact text from feedback

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
8. [ ] Address specific feedback items noted above

---

## Output Requirements

The research phase should produce:

1. **yb-research.md** — Detailed findings with evidence citations, incorporating all feedback
2. **yb-tokens.json** — Token entry matching schema with updated description
3. **yb-metrics.json** — Full metrics entry with corrected statuses and content per feedback

All claims must have:
- Contract address or GitHub line reference
- View function output or transaction hash
- Documentation URL where applicable
- Attribution to data sources (e.g., ValueVerse for fee data)
