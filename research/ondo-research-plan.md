# ONDO Token Research Plan

## Overview

This document outlines the research plan for analyzing the ONDO token against the Aragon Ownership Token Framework. The analysis focuses on what the ONDO token gives its holder in terms of enforceable onchain control and economic value.

**Critical Distinction**: This analysis is about the **ONDO governance token**, not Ondo Finance's RWA products (OUSG, USDY). The key question is whether ONDO tokenholders have meaningful, enforceable control over economically material outcomes.

---

## Resource Inventory

### Primary Sources (Confirmed Accessible)

#### Token & Governance Contracts

| Contract | Address | Network | Purpose |
|----------|---------|---------|---------|
| ONDO Token | `0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3` | Ethereum | Governance token |
| Governor (Ondo DAO) | `0x336505EC1BcC1A020EeDe459f57581725D23465A` | Ethereum | Governor Bravo fork |
| Timelock | `0x2c5898da4DF1d45EAb2B7B192a361C3b9EB18d9c` | Ethereum | Execution delay |

#### Flux Finance Contracts (Governed by Ondo DAO)

| Contract | Address | Network | Purpose |
|----------|---------|---------|---------|
| fUSDC | `0x465a5a630482f3abD6d3b84B39B29b07214d19e5` | Ethereum | Lending market |
| fDAI | `0xe2bA8693cE7474900A045757fe0efCa900F6530b` | Ethereum | Lending market |
| fUSDT | `0x81994b9607e06ab3d5cF3AffF9a67374f05F27d7` | Ethereum | Lending market |
| fFRAX | `0x1C9A2d6b33B4826757273D47ebEe0e2DddcD978B` | Ethereum | Lending market |
| fOUSG | `0x1dD7950c266fB1be96180a8FDb0591F70200E018` | Ethereum | OUSG lending market |
| Comptroller | `0x95Af143a021DF745bc78e845b54591C53a8B3A51` | Ethereum | Accounting/risk |

#### Ondo RWA Products (NOT governed by ONDO DAO)

| Contract | Address | Network | Purpose |
|----------|---------|---------|---------|
| OUSG | `0x1B19C19393e2d034D8Ff31ff34c81252FcBbee92` | Ethereum | Tokenized treasuries |
| rOUSG | `0x54043c656F0FAd0652D9Ae2603cDF347c5578d00` | Ethereum | Rebasing OUSG |
| USDY | `0x96F6eF951840721AdBF46Ac996b59E0235CB985C` | Ethereum | Yield-bearing stablecoin |
| OUSG_InstantManager | `0x93358db73B6cd4b98D89c8F5f230E81a95c2643a` | Ethereum | Mint/redeem |
| OndoIDRegistry | `0xcf6958D69d535FD03BD6Df3F4fe6CDcd127D97df` | Ethereum | KYC registry |

#### Multisig Addresses

| Address | Purpose |
|---------|---------|
| `0x677fd4ed8ae623f2f625deb2d64f2070e46ca1a1` | Ondo Finance Multisig 2 (holds ~6B ONDO) |
| `0xAEd4caF2E535D964165B4392342F71bac77e8367` | Management Multisig |

### Documentation Sources

| Source | URL | Status |
|--------|-----|--------|
| Ondo Foundation Docs | https://docs.ondo.foundation/ | Confirmed |
| Ondo Finance Docs | https://docs.ondo.finance/ | Confirmed |
| Flux Finance Docs | https://docs.fluxfinance.com/ | Confirmed |
| Tally Governance | https://www.tally.xyz/gov/ondo-dao | Confirmed |
| Flux Governance Forum | https://forum.fluxfinance.com/ | To verify |

### GitHub Repositories

| Repository | URL | Contents |
|------------|-----|----------|
| ondoprotocol/usdy | https://github.com/ondoprotocol/usdy | USDY smart contracts |
| ondoprotocol/ondo-v1 | https://github.com/ondoprotocol/ondo-v1 | Legacy contracts (2021) |
| flux-finance/contracts | https://github.com/flux-finance/contracts | Flux Finance (Compound fork) |
| code-423n4/2024-03-ondo-finance | https://github.com/code-423n4/2024-03-ondo-finance | Audit contest code |

### Block Explorers

| Chain | Explorer | Token Address |
|-------|----------|---------------|
| Ethereum | Etherscan | `0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3` |

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question**: Does an onchain process exist that grants ONDO tokenholders ultimate authority over protocol decisions?

**Investigation Approach**:
1. Read Governor contract at `0x336505EC1BcC1A020EeDe459f57581725D23465A` on Etherscan
2. Verify it's a Governor Bravo fork with standard propose/vote/execute flow
3. Trace execution path: Governor → Timelock → Protocol contracts
4. Verify Timelock (`0x2c5898da4DF1d45EAb2B7B192a361C3b9EB18d9c`) admin is the Governor
5. Check governance parameters: proposal threshold (100M ONDO), quorum (1M), voting period (3 days), timelock delay (1 day)

**Evidence Required**:
- Governor contract code showing ONDO token as voting token
- Timelock admin() returning Governor address
- Evidence of successful proposal executions from Tally

**Critical Gap to Investigate**: The Ondo DAO governs **Flux Finance only**. Verify what exactly the DAO can control vs. what Ondo Finance (the company) controls directly.

#### 1.2 Role Accountability

**Question**: Are all privileged roles governed, revocable, and accountable to ONDO tokenholders?

**Investigation Approach**:
1. Identify all privileged roles in Flux Finance Comptroller
2. Check if roles are assigned to Timelock or to external addresses
3. Investigate the Management Multisig (`0xAEd4caF2E535D964165B4392342F71bac77e8367`) - who controls it?
4. Check if DAO can revoke/reassign roles

**Evidence Required**:
- Comptroller admin/owner pointing to Timelock
- List of all privileged roles and their current assignees
- Evidence that roles are changeable via governance

**Critical Gap**: Ondo's RWA products (OUSG, USDY) have admin roles controlled by Ondo Finance multisigs, NOT the DAO. This is a major finding.

#### 1.3 Protocol Upgrade Authority

**Question**: Who controls protocol upgrades?

**Investigation Approach**:
1. Check if Flux Finance contracts are upgradeable (proxy patterns)
2. If upgradeable, verify proxy admin is the Timelock
3. Check ONDO token upgradeability
4. Investigate OUSG/USDY upgradeability (likely company-controlled)

**Evidence Required**:
- Proxy implementation details for each core contract
- ProxyAdmin owner for each upgradeable contract
- History of any upgrades

**Critical Gap**: OUSG and USDY are upgradeable proxies controlled by Ondo Finance, not the DAO.

#### 1.4 Token Upgrade Authority

**Question**: Can the ONDO token behavior be modified?

**Investigation Approach**:
1. Read ONDO token contract source on Etherscan
2. Check for proxy pattern (ERC-1967, TransparentProxy, etc.)
3. If upgradeable, identify the ProxyAdmin owner
4. Check for any minter/pauser/admin roles

**Evidence Required**:
- Token contract bytecode analysis
- ProxyAdmin address and owner (if upgradeable)
- Presence of MINTER_ROLE and who holds it

**Key Finding from Research**: ONDO has a mint() function gated by MINTER_ROLE, but capped at 10B total supply. Investigate who holds MINTER_ROLE.

#### 1.5 Supply Control

**Question**: Is ONDO supply fixed or can it be inflated?

**Investigation Approach**:
1. Verify total supply cap of 10B ONDO is enforced in contract
2. Identify MINTER_ROLE holder
3. Check if minting has ever occurred beyond genesis
4. Verify no additional inflation pathways

**Evidence Required**:
- Token contract showing MAX_SUPPLY check in mint()
- Current MINTER_ROLE holder address
- Minting transaction history

#### 1.6 Privileged Access Gating

**Question**: Can any actor block protocol access or exit paths?

**Investigation Approach**:
1. Check if Flux Finance has pausable functions
2. Identify who can pause (DAO vs. multisig)
3. Check if withdrawals can be blocked
4. Investigate emergency guardian roles

**Evidence Required**:
- Pausable function implementations
- Guardian/pauser role assignments
- Evidence of whether exit paths are guaranteed

**Critical Gap**: For OUSG/USDY (outside DAO control), there are KYC gates, blocklists, and sanctions checks that can freeze funds.

#### 1.7 Token Censorship

**Question**: Can ONDO token transfers be frozen, blacklisted, or seized?

**Investigation Approach**:
1. Read ONDO token transfer function
2. Check for blocklist/allowlist checks
3. Check for pause functionality
4. Check for force transfer or seize functions

**Evidence Required**:
- Token contract transfer() implementation
- Absence or presence of blocklist mapping
- Absence or presence of pause state variable

**Key Finding**: ONDO token transfer restrictions were lifted in January 2024. Verify current state onchain.

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question**: Do value flows to ONDO tokenholders currently exist?

**Investigation Approach**:
1. Check Flux Finance fee structure (reserve factor, interest rates)
2. Trace where fees flow (treasury address)
3. Verify if DAO treasury holds assets
4. Check for any direct distribution to tokenholders (staking, buybacks, etc.)

**Evidence Required**:
- Reserve factor settings in Comptroller
- Treasury address and balance
- Evidence of any distributions to tokenholders

**Critical Finding**: Research suggests ONDO has **no direct value accrual to tokenholders**. Revenue funds the DAO treasury and operational expenses, not token buybacks or distributions.

#### 2.2 Treasury Ownership

**Question**: Is the DAO treasury controlled by ONDO tokenholders?

**Investigation Approach**:
1. Identify treasury addresses
2. Verify treasury is controlled by Timelock (i.e., DAO governance)
3. Check treasury balances and asset composition
4. Verify no other entity can access treasury

**Evidence Required**:
- Treasury contract owner = Timelock
- Treasury balance and transaction history
- Governance proposals that moved treasury funds

#### 2.3 Accrual Mechanism Control

**Question**: Can ONDO holders modify fee parameters?

**Investigation Approach**:
1. Identify fee-setting functions in Flux Finance
2. Verify these are gated by admin role pointing to Timelock
3. Check history of fee changes via governance

**Evidence Required**:
- Comptroller functions for setting reserve factor
- Access control pointing to Timelock
- Governance proposal history for parameter changes

#### 2.4 Offchain Value Accrual

**Question**: Are there offchain value flows benefiting tokenholders?

**Investigation Approach**:
1. Research legal structure of Ondo Foundation
2. Check if any IP, licensing, or brand rights flow to DAO
3. Investigate relationship between Ondo Finance Inc. and Ondo DAO

**Evidence Required**:
- Legal entity documentation
- IP ownership evidence
- Any formal agreements between entities

**Key Finding**: Ondo Foundation is a Cayman Islands Foundation Company with "no beneficial owners." No evidence of offchain value accrual to tokenholders.

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question**: Is the ONDO token contract verified and auditable?

**Investigation Approach**:
1. Check Etherscan verification status
2. Match deployed bytecode to source code
3. Review audits of token contract

**Evidence Required**:
- Etherscan verification checkmark
- Link to source code
- Audit reports

#### 3.2 Protocol Component Source Verification

**Question**: Are Flux Finance contracts verified and auditable?

**Investigation Approach**:
1. Verify all Flux Finance contracts on Etherscan
2. Match to GitHub source (flux-finance/contracts)
3. Review audits

**Evidence Required**:
- All contract verification statuses
- GitHub repository with matching code
- Audit reports

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question**: Does any single actor control majority voting power?

**Investigation Approach**:
1. Analyze ONDO token holder distribution on Etherscan
2. Identify largest holders and their known identities
3. Calculate concentration (top 10 holders %)
4. Check for coordinated control (team, investors, foundation)

**Evidence Required**:
- Token holder distribution data
- Identification of major holders
- Concentration metrics

**Key Finding**: Multisig `0x677fd4ed...` holds ~6B ONDO (60% of supply). This is likely team/foundation controlled. If true, governance is effectively centralized.

#### 4.2 Future Token Unlocks

**Question**: Are there upcoming unlock events that will change concentration?

**Investigation Approach**:
1. Review vesting schedule documentation
2. Identify cliff dates and unlock amounts
3. Assess impact on voting power distribution

**Evidence Required**:
- Official vesting schedule
- Upcoming unlock dates and amounts
- Analysis of impact

**Key Finding**: Major unlocks (17.1% each) scheduled for January 2026, 2027, and 2028. Currently ~48.7% unlocked.

---

### Metric 5: Offchain Dependencies

#### 5.1 Trademark

**Question**: Who owns the Ondo trademark?

**Investigation Approach**:
1. Search USPTO for "Ondo" trademark filings
2. Identify registrant entity
3. Determine if entity is DAO-controlled

**Evidence Required**:
- USPTO filing showing owner
- Relationship of owner to DAO

#### 5.2 Distribution

**Question**: Who controls primary domains and interfaces?

**Investigation Approach**:
1. Check ondo.finance and fluxfinance.com ownership
2. Review Terms of Service for contracting party
3. Assess DAO control over frontend

**Evidence Required**:
- WHOIS data (if available)
- Terms of Service identifying operator
- Frontend contract addresses (if any)

**Key Finding**: Ondo Finance Inc. is identified as the contracting party in Terms of Service, not the DAO.

#### 5.3 Licensing

**Question**: Who controls protocol IP and licensing?

**Investigation Approach**:
1. Review GitHub repository licenses
2. Check if IP is assigned to DAO-controlled entity
3. Investigate any commercial licensing arrangements

**Evidence Required**:
- License files in repositories
- IP assignment documentation
- Commercial license terms (if any)

---

## Anticipated Gaps and Concerns

### 1. Governance Scope Limitation (CRITICAL)

The Ondo DAO governs **Flux Finance only**. It does NOT govern:
- OUSG (tokenized treasuries)
- USDY (yield-bearing stablecoin)
- Ondo Global Markets
- Ondo Bridge
- Any future Ondo Chain products

This is the most significant finding: **ONDO tokenholders have no onchain control over Ondo's core RWA products**.

### 2. Token Concentration (HIGH RISK)

~60% of ONDO supply appears to be held in team/foundation-controlled multisigs. This means:
- Governance proposals pass or fail based on insider decisions
- "Tokenholder governance" is effectively team governance

### 3. No Direct Value Accrual (MODERATE)

There is no programmatic mechanism directing value to ONDO holders:
- No fee distribution
- No buybacks
- No staking rewards
- Treasury funds "operational expenses" without clear tokenholder benefit

### 4. Regulatory/RWA Constraints

Even if governance were expanded to OUSG/USDY:
- These products have KYC requirements
- Transfers are gated by allowlists/blocklists
- Ondo Finance (company) must maintain regulatory compliance
- Onchain governance may be legally limited

### 5. Private Repository Development

Core development happens in private repositories. Public repos are:
- ondo-v1: 3+ years old snapshot
- usdy: Limited to audit snapshots
- flux-finance/contracts: Compound V2 fork, minimal customization

This limits independent verification of current deployed code.

---

## Evidence Sufficiency Criteria

For each metric, the following evidence standards apply:

| Rating | Evidence Standard |
|--------|-------------------|
| ✅ Positive | Onchain verification with contract code, deployed bytecode match, and observable behavior |
| ⚠️ At Risk | Evidence shows discretionary control outside tokenholder governance, or potential centralization |
| TBD | Insufficient evidence to make a determination; requires further investigation or access |

---

## Next Steps for Research Phase

1. **Contract Analysis**: Deep-dive into all contract addresses above. Verify ownership chains, admin roles, and upgrade paths.

2. **Governance History**: Review all Tally proposals to understand what the DAO has actually controlled.

3. **Token Distribution**: Pull holder data and identify concentration metrics.

4. **Vesting Verification**: Confirm vesting contract addresses and unlock mechanics.

5. **Legal Entity Research**: Investigate Ondo Foundation structure and relationship to Ondo Finance Inc.

6. **Source Code Matching**: For each verified contract, confirm source matches deployed bytecode.

---

## Summary

The ONDO token analysis will likely reveal a governance token with **limited scope and effectiveness**:

- **Positive**: Standard Governor Bravo governance with timelock, verified contracts
- **Negative**: Only governs Flux Finance (small DeFi protocol), not core RWA products
- **At Risk**: High token concentration, no value accrual mechanism, company controls core products

The key distinction highlighted in the task is critical: Ondo Finance may be a successful RWA protocol, but that doesn't mean the ONDO token gives holders meaningful ownership or control. The evidence suggests ONDO is primarily a governance token for a single lending protocol (Flux Finance), with most of Ondo's economic activity occurring outside tokenholder control.