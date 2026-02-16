# YB Token Research Plan

## Aragon Ownership Token Framework Analysis

**Target Token:** YieldBasis (YB)
**Network:** Ethereum Mainnet
**Token Address:** `0x01791F726B4103694969820be083196cC7c045fF`
**Prepared:** 2026-02-16

---

## Executive Summary

This research plan maps each criterion in the Aragon Ownership Token Framework to specific YieldBasis resources and defines what evidence is required to evaluate the YB token. The critical distinction: this analysis evaluates what the YB token gives its holder in terms of enforceable, on-chain control and economic value—not whether YieldBasis is a good protocol.

---

## Resource Inventory

### Confirmed Sources (URLs Verified)

#### Official Documentation
| Source | URL | Type |
|--------|-----|------|
| YieldBasis Docs | https://docs.yieldbasis.com | docs |
| Tokenomics | https://docs.yieldbasis.com/user/tokenomics | docs |
| veYB Token | https://docs.yieldbasis.com/user/veyb | docs |
| Contract Addresses | https://docs.yieldbasis.com/user/contract-addresses | docs |
| Technical Overview | https://docs.yieldbasis.com/dev/overview | docs |
| Audits & Bug Bounties | https://docs.yieldbasis.com/user/audits-bug-bounties | docs |
| MiCA Whitepaper | https://docs.yieldbasis.com/pdf/mica-whitepaper.pdf | docs |

#### GitHub Repositories
| Source | URL | Type |
|--------|-----|------|
| yb-core (Vyper contracts) | https://github.com/yield-basis/yb-core | github |
| yb-paper (Whitepaper) | https://github.com/yield-basis/yb-paper | github |
| yb-simulations | https://github.com/yield-basis/yb-simulations | github |

#### On-Chain Contracts (Etherscan-Verified)
| Contract | Address | Type |
|----------|---------|------|
| YB Token | `0x01791F726B4103694969820be083196cC7c045fF` | explorer |
| veYB | `0x8235c179E9e84688FBd8B12295EfC26834dAC211` | explorer |
| GaugeController | `0x1Be14811A3a06F6aF4fA64310a636e1Df04c1c21` | explorer |
| Factory | `0x370a449FeBb9411c95bf897021377fe0B7D100c0` | explorer |
| FeeDistributor | `0xD11b416573EbC59b6B2387DA0D2c0D1b3b1F7A90` | explorer |
| DAO | `0x42F2A41A0D0e65A440813190880c8a65124895Fa` | explorer |
| Plugin | `0x2be6670DE1cCEC715bDBBa2e3A6C1A05E496ec78` | explorer |

#### Market Contracts (cbBTC Example)
| Contract | Address | Type |
|----------|---------|------|
| yb-cbBTC | `0xAC0cfa7742069a8af0c63e14FFD0fe6b3e1Bf8D2` | explorer |
| LEVAMM | `0xDC90F6B111DF0c26e349d3cC8d3C357b191e109a` | explorer |
| Gauge | `0xf3081A2eB8927C0462864EC3FdbE927C842A0893` | explorer |

#### Vesting Contracts
| Contract | Address | Type |
|----------|---------|------|
| Curve Licensing | `0x36e36D5D588D480A15A40C7668Be52D36eb206A8` | explorer |
| Investors | `0x11988547B064CaBF65c431c14Ef1b7435084602e` | explorer |
| Team | `0x93Eb25E380229bFED6AB4bf843E5f670c12785e3` | explorer |
| Protocol Development Reserve | `0x525443603D6D0955142FaC8820b64Ae701F40065` | explorer |
| Ecosystem Reserve | `0x7aC5922776034132D9ff5c7889d612d98e052Cf2` | explorer |

#### Security Audits
| Auditor | Date | URL |
|---------|------|-----|
| Statemind | Feb-May 2025 | https://docs.yieldbasis.com/pdf/audit/statemind.pdf |
| Chainsecurity | July 2025 | https://docs.yieldbasis.com/pdf/audit/chainsecurity.pdf |
| Quantstamp | April 2025 | https://docs.yieldbasis.com/pdf/audit/quantstamp.pdf |
| Mixbytes | August 2025 | https://docs.yieldbasis.com/pdf/audit/mixbytes.pdf |
| Electisec | August 2025 | https://docs.yieldbasis.com/pdf/audit/electisec.pdf |
| Pashov | March-April 2025 | https://docs.yieldbasis.com/pdf/audit/pashov.pdf |

---

## Metric 1: Onchain Control

### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants YB tokenholders ultimate authority over protocol decisions?

**Investigation Approach:**
1. Examine DAO contract (`0x42F2A41A0D0e65A440813190880c8a65124895Fa`) for governance mechanism
2. Verify veYB contract (`0x8235c179E9e84688FBd8B12295EfC26834dAC211`) grants voting power
3. Trace execution path from vote → proposal → execution
4. Check Plugin contract (`0x2be6670DE1cCEC715bDBBa2e3A6C1A05E496ec78`) for Aragon governance integration
5. Identify if there's a timelock between vote approval and execution

**Sources:**
- DAO contract bytecode on Etherscan
- Plugin contract (likely Aragon TokenVoting or VE governance plugin)
- veYB contract read functions
- yb-core GitHub repository (governance contracts)
- Docs: https://docs.yieldbasis.com/user/veyb

**Evidence Sufficiency:**
- ✅ Sufficient: Verified onchain voting → execution path where veYB holders can pass and execute proposals
- ⚠️ Partial: Governance exists but execution requires external multisig approval
- ❌ Insufficient: No onchain execution capability, governance is advisory only

**Anticipated Difficulty:** Need to verify the DAO uses Aragon OSx stack and trace Plugin → DAO → execution permissions. The governance may be nascent given protocol launched in late 2025.

---

### 1.2 Role Accountability

**Question:** Are all privileged or value-impacting roles governed, revocable, and accountable to veYB holders?

**Investigation Approach:**
1. Map all admin/owner roles across core contracts:
   - Factory owner
   - GaugeController admin
   - FeeDistributor admin
   - Individual market contract owners (LT, LEVAMM, VirtualPool)
2. For each role, trace ownership chain to veYB governance or identify discretionary control
3. Check if roles can be revoked/reassigned by governance
4. Identify any multisig or EOA controls that bypass governance

**Sources:**
- Factory contract (`0x370a449FeBb9411c95bf897021377fe0B7D100c0`) - read owner/admin functions
- GaugeController (`0x1Be14811A3a06F6aF4fA64310a636e1Df04c1c21`)
- yb-core source: contracts/Factory.vy, contracts/LT.vy
- Etherscan transaction history for admin operations

**Evidence Sufficiency:**
- ✅ Sufficient: All privileged roles are either DAO-controlled or explicitly documented as governance-revocable
- ⚠️ Partial: Some roles controlled by multisig that governance can replace
- ❌ Insufficient: Core roles held by team EOA/multisig without governance override path

**Anticipated Difficulty:** Factory contract likely has owner that can set implementations. Need to verify if owner is DAO or team multisig.

---

### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded, and if so, who controls upgrades?

**Investigation Approach:**
1. Check if core contracts use proxy patterns (ERC-1967, UUPS, etc.)
2. Examine Factory contract for `set_implementation` or similar upgrade functions
3. For each core contract type (LT, LEVAMM, VirtualPool, Oracle), verify upgradeability
4. If upgradeable, trace upgrade authority to veYB or discretionary control
5. Check for timelocks on upgrades

**Sources:**
- Factory.vy source on GitHub
- Etherscan contract verification for proxy detection
- Technical docs: https://docs.yieldbasis.com/dev/overview

**Evidence Sufficiency:**
- ✅ Sufficient: Upgrades controlled by veYB governance with timelock, or contracts are immutable
- ⚠️ Partial: Upgrades possible but behind multisig that governance can replace
- ❌ Insufficient: Team can unilaterally upgrade core contracts

**Anticipated Difficulty:** Vyper contracts may use blueprint patterns rather than proxies. Need to understand YieldBasis-specific upgrade mechanism.

---

### 1.4 Token Upgrade Authority

**Question:** Can YB token behavior be modified, and if so, by whom?

**Investigation Approach:**
1. Read YB token contract source on Etherscan
2. Check for proxy pattern (ERC-1967 slot)
3. Identify any admin functions (setX, pause, etc.)
4. If upgradeable, trace upgrade authority

**Sources:**
- YB Token (`0x01791F726B4103694969820be083196cC7c045fF`) on Etherscan
- yb-core source (if token contract included)

**Evidence Sufficiency:**
- ✅ Sufficient: Token is immutable OR upgradeable only via veYB governance
- ⚠️ Partial: Token upgradeable by multisig accountable to governance
- ❌ Insufficient: Token has admin upgrade path outside governance

**Anticipated Difficulty:** Low - token contract verification should be straightforward. Contract is Vyper 0.4.3 per Etherscan.

---

### 1.5 Supply Control

**Question:** How is YB token supply controlled?

**Investigation Approach:**
1. Check YB token for mint() function and its access control
2. Verify total supply (1B) and any inflation mechanism
3. Examine emission schedule for liquidity incentives (30% allocation)
4. Check if governance can modify emission parameters

**Sources:**
- YB Token contract bytecode
- Tokenomics docs: https://docs.yieldbasis.com/user/tokenomics
- GaugeController for emission routing
- Vesting contracts for locked supply

**Evidence Sufficiency:**
- ✅ Sufficient: Fixed supply OR minting only via programmatic schedule controlled by governance
- ⚠️ Partial: Minting controlled by multisig with governance oversight
- ❌ Insufficient: Discretionary minting capability exists

**Anticipated Difficulty:** Need to understand how the 30% liquidity incentive allocation is distributed over time.

---

### 1.6 Privileged Access Gating

**Question:** Can any bounded actor set block or restrict protocol actions or exit paths?

**Investigation Approach:**
1. Check for pause/emergency functions in core contracts
2. Examine Factory for killGauge or similar functions
3. Look for whitelist/blacklist mechanisms on markets
4. Verify user exit paths (withdraw from LT tokens) are permissionless

**Sources:**
- Factory.vy, LT.vy source code
- Market contracts on Etherscan
- Security audit reports (may identify emergency mechanisms)

**Evidence Sufficiency:**
- ✅ Sufficient: No gating mechanisms, or gating only via governance with narrow scope
- ⚠️ Partial: Emergency pause exists but is governance-revocable
- ❌ Insufficient: Team/multisig can block user exits or protocol actions

**Anticipated Difficulty:** Need to carefully review for hidden pause mechanisms. Audit reports may be helpful.

---

### 1.7 Token Censorship

**Question:** Can any role freeze, blacklist, seize, or censor YB token balances or transfers?

**Investigation Approach:**
1. Review YB token contract for blacklist/freeze/seize functions
2. Check for Pausable or similar patterns
3. Examine transfer function for any conditional blocking
4. Verify veYB positions (NFT-based) for censorship capability

**Sources:**
- YB Token contract source
- veYB contract source
- Standard ERC-20 analysis

**Evidence Sufficiency:**
- ✅ Sufficient: No censorship capabilities in token contract
- ⚠️ Partial: Pause exists but cannot target specific addresses
- ❌ Insufficient: Blacklist/freeze capability exists

**Anticipated Difficulty:** Low - standard token contract analysis.

---

## Metric 2: Value Accrual

### 2.1 Accrual Active

**Question:** Are value flows to YB tokenholders currently active?

**Investigation Approach:**
1. Verify FeeDistributor (`0xD11b416573EbC59b6B2387DA0D2c0D1b3b1F7A90`) is receiving and distributing fees
2. Check on-chain transaction history for fee distributions
3. Verify veYB holders can claim rewards (weekly Thursday 00:00 UTC per docs)
4. Quantify current fee generation from markets

**Sources:**
- FeeDistributor contract on Etherscan (transaction history)
- Market contracts (admin fee collection)
- veYB docs: https://docs.yieldbasis.com/user/veyb
- DeFi dashboards (DefiLlama, etc.) for TVL/volume

**Evidence Sufficiency:**
- ✅ Sufficient: Observable, recent fee distributions to veYB holders
- ⚠️ Partial: Mechanism exists but distributions are minimal
- ❌ Insufficient: No active distributions, mechanism is theoretical only

**Anticipated Difficulty:** Protocol is relatively new (mainnet Oct 2025). Need to verify fee switch is active and distributions have occurred.

---

### 2.2 Treasury Ownership

**Question:** Are protocol treasury assets programmatically controlled by veYB governance?

**Investigation Approach:**
1. Identify if there's a formal treasury contract
2. Check DAO contract for asset custody
3. Examine vesting contracts for governance control
4. Verify any protocol-owned liquidity

**Sources:**
- DAO contract (`0x42F2A41A0D0e65A440813190880c8a65124895Fa`)
- Ecosystem Reserve (`0x7aC5922776034132D9ff5c7889d612d98e052Cf2`)
- Protocol Development Reserve (`0x525443603D6D0955142FaC8820b64Ae701F40065`)

**Evidence Sufficiency:**
- ✅ Sufficient: Treasury controlled by DAO with veYB voting
- ⚠️ Partial: Treasury exists but controlled by multisig accountable to governance
- ❌ Insufficient: Treasury controlled by team without governance oversight

**Anticipated Difficulty:** Need to distinguish between vesting contracts (locked for specific purposes) vs. discretionary treasury.

---

### 2.3 Accrual Mechanism Control

**Question:** Can veYB holders modify parameters governing value capture?

**Investigation Approach:**
1. Identify fee parameters (admin fee formula: f_a = 1 - (1 - f_min) * √(1 - s/T))
2. Check who can modify f_min and other fee parameters
3. Examine gauge weight voting mechanism
4. Verify veYB controls emission routing via GaugeController

**Sources:**
- GaugeController contract
- Factory contract (fee parameters)
- Advanced economics docs: https://docs.yieldbasis.com/user/advanced-concepts-economics
- LT.vy source code

**Evidence Sufficiency:**
- ✅ Sufficient: veYB holders control fee parameters and emission routing
- ⚠️ Partial: Gauge voting works but fee parameters set by team
- ❌ Insufficient: No tokenholder control over value capture parameters

**Anticipated Difficulty:** Docs mention "Curve/YB governance can tune borrow APR" - need to verify this is veYB governance vs. Curve governance.

---

### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value accrual flows benefiting YB tokenholders?

**Investigation Approach:**
1. Research YieldBasis AG (Swiss company) relationship to token
2. Check for any legal agreements giving tokenholders claims on offchain revenue
3. Examine MiCA whitepaper for legal structure

**Sources:**
- MiCA Whitepaper: https://docs.yieldbasis.com/pdf/mica-whitepaper.pdf
- Company registry for YieldBasis AG

**Evidence Sufficiency:**
- ✅ Sufficient: Legal structure explicitly ties offchain value to tokenholders
- TBD: Cannot verify offchain arrangements
- ❌ N/A: No offchain value accrual mechanism claimed

**Anticipated Difficulty:** High - offchain legal arrangements typically not publicly verifiable.

---

## Metric 3: Verifiability

### 3.1 Token Contract Source Verification

**Question:** Is YB token source code publicly available and verified on Etherscan?

**Investigation Approach:**
1. Check Etherscan verification status for YB token
2. Match deployed bytecode to GitHub source
3. Verify compilation settings (Vyper 0.4.3)

**Sources:**
- Etherscan: `0x01791F726B4103694969820be083196cC7c045fF`
- GitHub: https://github.com/yield-basis/yb-core

**Evidence Sufficiency:**
- ✅ Sufficient: Source verified on Etherscan, matches GitHub
- ⚠️ Partial: Verified but minor discrepancies
- ❌ Insufficient: Not verified or significant mismatch

**Anticipated Difficulty:** Low - standard verification check.

---

### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly accessible and verifiable?

**Investigation Approach:**
1. Check Etherscan verification for all core contracts (Factory, veYB, GaugeController, FeeDistributor)
2. Check verification for market contracts (LT, LEVAMM, VirtualPool, Oracle, Gauge)
3. Cross-reference with GitHub yb-core repository
4. Verify audit reports match deployed code

**Sources:**
- All contract addresses from https://docs.yieldbasis.com/user/contract-addresses
- GitHub: https://github.com/yield-basis/yb-core
- Audit reports

**Evidence Sufficiency:**
- ✅ Sufficient: All economically material contracts verified and match source
- ⚠️ Partial: Most contracts verified, minor components unverified
- ❌ Insufficient: Core contracts unverified or significant mismatches

**Anticipated Difficulty:** Medium - many contracts to verify across multiple markets.

---

## Metric 4: Token Distribution

### 4.1 Ownership Concentration

**Question:** Does any single actor or coordinated group control a majority of voting power?

**Investigation Approach:**
1. Query veYB contract for top holders and their voting power
2. Analyze YB token distribution (top holders)
3. Identify team/investor vesting schedules and current unlocked amounts
4. Calculate effective voting power concentration
5. Check for delegation patterns in veYB

**Sources:**
- veYB contract read functions
- Etherscan token holders page
- Vesting contracts (Team, Investors, etc.)
- Tokenomics docs for allocation breakdown

**Token Allocation (per docs):**
| Category | Allocation | Vesting |
|----------|-----------|---------|
| Liquidity Incentives | 30% | Dynamic emission |
| Team | 25% | 6-month cliff, 24-month vesting |
| Ecosystem Reserve | 12.5% | 2-year vesting, 5% initial |
| Investors | 12.1% | 6-month cliff, 24-month vesting |
| Protocol Development | 7.4% | 1-year cliff, 1-year vesting |
| Curve Licensing | 7.5% | Dynamic emission |
| Other | 5.5% | Various |

**Evidence Sufficiency:**
- ✅ Sufficient: No single party controls >50% of voting power; distribution is meaningful
- ⚠️ Partial: Concentration exists but documented and time-limited (vesting)
- ❌ Insufficient: Single party or coordinated group controls majority

**Anticipated Difficulty:** High - need to analyze actual veYB holdings, not just YB distribution. Protocol is new so distribution may be concentrated.

---

### 4.2 Future Token Unlocks

**Question:** Are there known future events that will materially affect token concentration?

**Investigation Approach:**
1. Map all vesting schedules from vesting contracts
2. Calculate unlock timeline (6-month cliff from Sept 15, 2025 = March 15, 2026)
3. Identify any large cliff events

**Sources:**
- Vesting contract read functions
- Tokenomics docs
- CliffEscrow contract (`0x60043a545E22424E73A2dEbb98f8cd4361fE3DA0`)

**Evidence Sufficiency:**
- ✅ Sufficient: Vesting schedules documented, no outsized cliff events
- ⚠️ Partial: Significant cliffs exist but are disclosed
- ❌ Insufficient: Undocumented or sudden large unlocks possible

**Anticipated Difficulty:** Medium - cliff for Team/Investors is ~March 2026, which is imminent.

---

## Offchain Dependencies

### 5.1 Trademark

**Question:** Are core trademarks owned by a tokenholder-controlled legal entity?

**Investigation Approach:**
1. Search USPTO/EUIPO for "YieldBasis" or "Yield Basis" trademarks
2. Identify registrant entity
3. Determine if registrant is DAO-controlled or team-controlled

**Sources:**
- USPTO TESS database
- EUIPO search
- MiCA whitepaper (may identify legal entity structure)

**Evidence Sufficiency:**
- ✅ Sufficient: Trademark held by DAO-controlled entity
- ⚠️ Partial: Trademark held by team entity (YieldBasis AG) with no formal DAO control
- ❌ Insufficient: Unknown trademark ownership

**Anticipated Difficulty:** High - likely registered to YieldBasis AG, which is team-controlled.

---

### 5.2 Distribution

**Question:** Are primary domains and interfaces owned by tokenholder-controlled entity?

**Investigation Approach:**
1. Check WHOIS for yieldbasis.com domain ownership
2. Identify who controls app.yieldbasis.com frontend
3. Review Terms of Service for contracting party

**Sources:**
- WHOIS lookup
- Terms of Service on website
- MiCA whitepaper

**Evidence Sufficiency:**
- ✅ Sufficient: Domain/interfaces controlled by DAO or DAO-controlled entity
- ⚠️ Partial: Controlled by team entity without formal DAO oversight
- ❌ Insufficient: Unknown or clearly team-only control

**Anticipated Difficulty:** High - likely team-controlled (YieldBasis AG).

---

### 5.3 Licensing

**Question:** Is core protocol software/IP controlled by tokenholder-controlled entity?

**Investigation Approach:**
1. Check GitHub repository license
2. Examine Curve licensing arrangement (7.5% allocation)
3. Identify any proprietary components

**Sources:**
- yb-core LICENSE file
- Curve Licensing vesting contract
- MiCA whitepaper

**Evidence Sufficiency:**
- ✅ Sufficient: Open source with permissive license, no restrictive IP
- ⚠️ Partial: Open source but with business source license or Curve licensing dependency
- ❌ Insufficient: Proprietary or controlled by team entity

**Anticipated Difficulty:** Medium - need to understand Curve licensing relationship.

---

## Gaps and Concerns

### High-Priority Gaps

1. **Governance Maturity:** YieldBasis launched October 2025. The DAO and governance mechanisms may be nascent. Need to verify if onchain governance is active or if team retains operational control.

2. **Factory Owner:** The Factory contract sets implementations for all markets. Its owner controls protocol upgrades. Critical to verify if owner is DAO or team multisig.

3. **Team/Investor Unlock:** 6-month cliff ends ~March 2026. 25% (Team) + 12.1% (Investors) = 37.1% unlocking soon. Need to verify if these tokens can immediately vote as veYB.

4. **veYB Concentration:** Even if governance mechanisms exist, if team/investors hold majority of veYB, governance is de facto team-controlled.

### Medium-Priority Gaps

5. **Curve Integration Dependency:** Protocol relies on Curve pools and crvUSD lending. Curve governance decisions could materially affect YieldBasis. This is an external dependency.

6. **YieldBasis AG Role:** Swiss company appears to be operational entity. Unclear what formal relationship exists between company and DAO.

7. **Emergency Powers:** Need to verify if any emergency pause or kill mechanisms exist and who controls them.

### Information Quality Notes

- **Confirmed Sources:** All URLs in Resource Inventory have been verified accessible
- **Contract Verification:** Need to check Etherscan verification status for all contracts
- **Audit Reports:** 6 audits completed, but findings not publicly detailed - need to review PDFs

---

## Research Execution Checklist

### Phase 1: Contract Analysis
- [ ] Read YB token contract - verify upgradeability, mint/burn, censorship
- [ ] Read veYB contract - verify voting power calculation, lock mechanics
- [ ] Read Factory contract - identify owner, upgrade authority
- [ ] Read GaugeController - verify veYB controls gauges
- [ ] Read FeeDistributor - verify distribution mechanism
- [ ] Read DAO/Plugin contracts - verify governance execution path

### Phase 2: Governance Verification
- [ ] Trace Factory owner to DAO or team
- [ ] Verify onchain governance proposals exist and can execute
- [ ] Map all privileged roles and their accountability
- [ ] Check for timelocks on critical functions

### Phase 3: Value Accrual Verification
- [ ] Verify fee distributions have occurred (FeeDistributor txn history)
- [ ] Quantify current value flows to veYB holders
- [ ] Verify gauge voting is active

### Phase 4: Distribution Analysis
- [ ] Query veYB top holders
- [ ] Calculate team/investor veYB holdings
- [ ] Map vesting unlock timeline

### Phase 5: Offchain Dependencies
- [ ] USPTO trademark search
- [ ] WHOIS domain lookup
- [ ] Review yb-core LICENSE

### Phase 6: Documentation
- [ ] Compile findings into yb-research.md
- [ ] Create yb-tokens.json entry
- [ ] Create yb-metrics.json entry

---

## Expected Output Format

Following the existing token entries (AAVE, AERO, etc.), the final deliverables will include:

**yb-tokens.json entry:**
```json
{
  "id": "yb",
  "name": "YB",
  "symbol": "YB",
  "address": "0x01791F726B4103694969820be083196cC7c045fF",
  "icon": "[CoinGecko icon URL]",
  "description": "[1-2 sentence summary]",
  "network": "ethereum",
  "evidenceEntries": [count],
  "positive": [count],
  "neutral": [count],
  "atRisk": [count],
  "lastUpdated": [timestamp],
  "links": {
    "website": "https://yieldbasis.com/",
    "twitter": "https://x.com/yieldbasis",
    "scan": "https://etherscan.io/token/0x01791F726B4103694969820be083196cC7c045fF"
  }
}
```

**yb-metrics.json:** Following the exact schema of existing entries, with:
- 5 metric categories (onchain-ctrl, val-accrual, verifiability, distribution, offchain)
- Status per criterion (✅, ⚠️, TBD)
- Notes explaining findings
- Evidence arrays with URLs (name, url, type)

---

## Critical Distinction Reminder

This analysis evaluates **the YB token**, not the YieldBasis protocol:

- Governance power only counts if it's **enforced on-chain** and cannot be circumvented by the team
- Revenue only counts if there's a **binding mechanism** directing it to token holders
- Claims about future plans, roadmap items, or "intended" governance are **not evidence** of current token value
- If the team retains effective control (via Factory ownership, veYB majority, or operational discretion), this must be documented regardless of governance aspirations
