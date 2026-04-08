# ENA Token Research Plan
## Aragon Ownership Token Framework Analysis

**Version:** 1.1
**Date:** 2026-02-24
**Status:** Ready for Execution

**Revision History:**
- v1.1 (2026-02-24): Added explicit audit URLs, holder distribution methodology, legal entity verification limitations
- v1.0 (2026-02-24): Initial research plan

---

## Executive Summary

This research plan provides a structured approach to analyzing the ENA token against the Aragon Ownership Token Framework. The framework evaluates tokens across five metrics:

1. **Onchain Control** - Who has ultimate authority over protocol operations?
2. **Value Accrual** - Are there active, programmatic value flows to tokenholders?
3. **Verifiability** - Can claims be independently verified from primary evidence?
4. **Token Distribution** - Is voting power meaningfully distributed?
5. **Offchain Dependencies** - Who controls brand, IP, and distribution assets?

The critical distinction: This analysis is about the **ENA token**, not the Ethena protocol. The question is whether ENA gives holders meaningful, enforceable control and economic value—not whether Ethena is a good protocol.

---

## Resource Inventory

### Core Token Contracts (Ethereum Mainnet) - CONFIRMED

| Contract | Address | Status |
|----------|---------|--------|
| **ENA Token** | `0x57e114B691Db790C35207b2e685D4A43181e6061` | Verified |
| **sENA (Staked ENA)** | `0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9` | Verified |
| **rsENA (Restaked ENA)** | `0xc65433845ecd16688eda196497fa9130d6c47bd8` | Verified |
| **USDe Token** | `0x4c9edd5852cd905f086c759e8383e09bff1e68b3` | Verified |
| **sUSDe Token** | `0x9d39a5de30e57443bff2a8307a4256c8797a3497` | Verified |

### Protocol Contracts - CONFIRMED

| Contract | Address | Purpose |
|----------|---------|---------|
| **Mint/Redeem V1** | `0x2cc440b721d2cafd6d64908d6d8c4acc57f8afc3` | Legacy minting |
| **Mint/Redeem V2** | `0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3` | Current minting |
| **Rewards Distributor** | `0xf2fa332bd83149c66b09b45670bce64746c6b439` | sUSDe rewards |

### Multisig Wallets (4/8 signers) - CONFIRMED

| Wallet | Address | Role |
|--------|---------|------|
| **Dev Multisig** | `0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862` | Contract ownership |
| **Hot Swap** | `0x4423198f26764a8ce9ac8f1683c476854c885d9d` | Revenue → USDe conversion |
| **sUSDe Payout** | `0x71e4f98e8f20c88112489de3dded4489802a3a87` | Staker rewards |
| **Trading Ops** | `0x0a0b96A730ED5CDa84bcB63c1Ee2edCb6B7764d6` | Onchain ops |
| **Reserve Fund** | `0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5` | Emergency fund |

### Documentation - CONFIRMED ACCESSIBLE

| Resource | URL |
|----------|-----|
| Ethena Docs | https://docs.ethena.fi |
| Governance Docs | https://docs.ethena.fi/solution-overview/governance |
| ENA Token Docs | https://docs.ethena.fi/ena |
| Tokenomics | https://docs.ethena.fi/ena/tokenomics |
| Key Addresses | https://docs.ethena.fi/solution-design/key-addresses |
| Trust Assumptions | https://docs.ethena.fi/solution-design/key-trust-assumptions |
| Multisig Matrix | https://docs.ethena.fi/solution-design/key-trust-assumptions/matrix-of-multisig-and-timelocks |
| GitHub Overview | https://docs.ethena.fi/solution-design/overview/github-overview |

### Governance - CONFIRMED ACCESSIBLE

| Resource | URL |
|----------|-----|
| Governance Forum | https://gov.ethenafoundation.com |
| Snapshot Voting | https://snapshot.org/#/ethenagovernance.eth |

### GitHub Repositories - CONFIRMED

| Repository | URL |
|------------|-----|
| Ethena Labs Org | https://github.com/ethena-labs |
| BBP Public Assets | https://github.com/ethena-labs/bbp-public-assets |
| Code4rena 2023 Audit | https://github.com/code-423n4/2023-10-ethena |
| Code4rena 2024 Audit | https://github.com/code-423n4/2024-11-ethena-labs |

### Etherscan / Block Explorers - CONFIRMED

| Resource | URL |
|----------|-----|
| ENA Token | https://etherscan.io/token/0x57e114B691Db790C35207b2e685D4A43181e6061 |
| sENA Token | https://etherscan.io/token/0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9 |
| USDe Token | https://etherscan.io/address/0x4c9edd5852cd905f086c759e8383e09bff1e68b3 |
| sUSDe Token | https://etherscan.io/address/0x9d39a5de30e57443bff2a8307a4256c8797a3497 |
| Dev Multisig | https://etherscan.io/address/0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862 |

### Audits - CONFIRMED

| Auditor | Date | Report |
|---------|------|--------|
| Quantstamp | Oct 2023 | [Ethena Final Report (PDF)](https://596495599-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsBsPyff5ft3inFy9jyjt%2Fuploads%2F17Ucep7IYMBZ6mAHGLyw%2FEthena%20Final%20Report%20(1).pdf?alt=media&token=51a6a101-516e-4984-8360-14daf860a961) |
| Quantstamp | Oct 2024 | [UStb Audit (GitHub)](https://github.com/code-423n4/2024-11-ethena-labs/blob/main/audits/Ethena_final_report_Quantstamp.pdf) |
| Cyfrin | Oct 2024 | [Ethena x Cyfrin - USTB (PDF)](https://596495599-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsBsPyff5ft3inFy9jyjt%2Fuploads%2Fd7jvu5NZ9eh8thYYRBmP%2FEthena%20x%20Cyfrin%20-%20USTB.pdf?alt=media&token=9d693945-8baf-4373-bb4c-12cdee038db2) |
| Pashov | Oct 2024 | [Ethena x Pashov - USTB (PDF)](https://596495599-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsBsPyff5ft3inFy9jyjt%2Fuploads%2Fvjn1dqCWVE3YWhLFTFFU%2FEthena%20x%20Pashov%20-%20USTB.pdf?alt=media&token=b0e93bf7-e95d-44df-8c25-270e21ec2582) |

### Legal / Corporate - DOCUMENTATION-BASED (see limitations below)

| Entity | Jurisdiction | Role | Source |
|--------|--------------|------|--------|
| Ethena Labs | Portugal | Protocol development | SEC memo, Crunchbase |
| Ethena Foundation | Cayman Islands | Protocol operations, smart contracts | Terms of Service, SEC memo |
| Ethena OpCo Ltd | Unknown | Operations | Referenced in documentation |

**Verification Approach & Limitations:**

Corporate entity verification faces inherent limitations for this analysis:

1. **Cayman Islands Registry (CIMA):** The Cayman Islands Monetary Authority maintains a registry, but company searches typically require paid subscriptions or in-person access. Agent cannot independently verify Ethena Foundation's registration status.

2. **Portugal Commercial Registry:** Portuguese company information is available through RACIUS or Portal da Justiça, but may require Portuguese language navigation and/or payment. Agent cannot reliably access.

3. **Fallback Approach:** This analysis will rely on:
   - Official documentation claims (Terms of Service, SEC meeting memos)
   - Third-party databases (Crunchbase, PitchBook, Bloomberg)
   - Cross-referencing multiple sources for consistency

4. **Explicit Limitation:** Legal entity structure **cannot be independently verified by agent** from primary registry sources. All corporate entity claims are based on documentation and third-party sources. This is noted as a limitation in Offchain Dependencies findings.

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants ENA tokenholders ultimate authority over protocol decisions?

**Investigation Approach:**
1. Review Snapshot voting at `ethenagovernance.eth` - examine past votes, quorum requirements, binding nature
2. Analyze governance documentation at https://docs.ethena.fi/solution-overview/governance
3. Determine if votes execute onchain or are merely signaling
4. Identify the link (if any) between ENA voting and multisig execution

**Sources:**
- Snapshot voting history (confirmed: https://snapshot.org/#/ethenagovernance.eth)
- Governance forum (confirmed: https://gov.ethenafoundation.com)
- Governance docs (confirmed: https://docs.ethena.fi/solution-overview/governance)

**Evidence Sufficiency:**
- ✅ If: ENA votes trigger onchain execution via timelock/executor, OR sENA votes directly control critical parameters
- ⚠️ If: Votes are signaling-only, multisig has final discretion
- ❌ If: No functional governance link exists between ENA holdings and protocol control

**Anticipated Finding:** Governance is **offchain/signaling only**. Documentation states "fully on-chain governance is not a practical or viable option at present." Snapshot votes are non-binding; execution depends on Ethena Labs multisig.

---

#### 1.2 Role Accountability

**Question:** Are all privileged or value-impacting roles governed, revocable, and accountable to ENA tokenholders?

**Investigation Approach:**
1. Map all privileged roles from multisig matrix documentation
2. Identify who can grant/revoke each role
3. Determine if ENA holders can remove/replace the Dev Multisig or Risk Committee
4. Check if there are timelocks on role changes

**Sources:**
- Multisig matrix (confirmed: https://docs.ethena.fi/solution-design/key-trust-assumptions/matrix-of-multisig-and-timelocks)
- Dev Multisig (confirmed: `0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862`)
- EthenaMinting contract code

**Evidence Sufficiency:**
- ✅ If: ENA holders can vote to replace committee members AND those votes execute binding changes
- ⚠️ If: ENA holders elect committees but cannot enforce removal
- ❌ If: Privileged roles are not accountable to ENA holders

**Anticipated Finding:** Risk Committee is elected bi-annually by ENA holders via Snapshot, but enforcement depends on Foundation compliance. Multisig signers are NOT elected by ENA holders.

---

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded, and if so, is it controlled by ENA tokenholders?

**Investigation Approach:**
1. Check if ENA token contract is upgradeable (proxy pattern analysis)
2. Check if USDe/sUSDe contracts are upgradeable
3. Identify who controls upgrade authority (admin keys)
4. Trace ownership chain: Contract → Admin → Multisig → ?

**Sources:**
- ENA contract bytecode analysis on Etherscan
- USDe contract (Ownable2Step pattern)
- sUSDe contract (ERC4626 variant)
- Dev Multisig transaction history

**Evidence Sufficiency:**
- ✅ If: Upgrades require ENA holder approval via onchain governance
- ⚠️ If: Upgrades are multisig-controlled but have timelocks
- ❌ If: Multisig can upgrade without tokenholder input and without timelock

**Anticipated Finding:** Contracts use `Ownable2Step` with Dev Multisig (4/8) as owner. **No timelocks documented.** Upgrades are discretionary.

---

#### 1.4 Token Upgrade Authority

**Question:** Can ENA token behavior be modified, and if so, by whom?

**Investigation Approach:**
1. Analyze ENA token contract for proxy patterns
2. Check for admin functions that modify token behavior
3. Verify owner address and its capabilities
4. Review mint function constraints

**Sources:**
- ENA contract: `0x57e114B691Db790C35207b2e685D4A43181e6061`
- GitHub source code at ethena-labs/bbp-public-assets (if ENA.sol is available)
- Etherscan verified source

**Evidence Sufficiency:**
- ✅ If: Token is immutable OR upgrade authority is ENA-holder-controlled
- ⚠️ If: Token is upgradeable but controlled by multisig with timelock
- ❌ If: Token can be modified by multisig without constraints

**Anticipated Finding:** ENA uses `Ownable2Step` (not a proxy). The owner can call `mint()` with constraints: max 10% inflation per year, callable only once per 365 days. This is **discretionary** multisig control with programmatic limits.

---

#### 1.5 Supply Control

**Question:** Are token supply changes programmatic or subject exclusively to ENA-holder-approved processes?

**Investigation Approach:**
1. Analyze mint function in ENA contract
2. Check mint constraints (rate limits, timelock, approval requirements)
3. Review historical minting transactions
4. Verify burn functionality

**Sources:**
- ENA contract mint function
- Etherscan transaction history for ENA contract
- Tokenomics documentation

**Evidence Sufficiency:**
- ✅ If: Minting is impossible OR requires ENA holder approval
- ⚠️ If: Minting has programmatic constraints but is multisig-controlled
- ❌ If: Unlimited minting by multisig

**Anticipated Finding:** ENA has a `mint()` function callable by owner (4/8 multisig). **Constraints:**
- Max 10% of total supply per invocation
- Minimum 365 days between mint calls
- First mint (TGE) counts as first invocation

This is rate-limited discretionary minting, not programmatic or governance-controlled.

---

#### 1.6 Privileged Access Gating

**Question:** Can any bounded actor set block or selectively restrict economically meaningful protocol actions?

**Investigation Approach:**
1. Identify Gatekeeper role and its powers
2. Review mint/redeem disabling capabilities
3. Check if withdrawals from sUSDe can be blocked
4. Analyze cooldown mechanisms

**Sources:**
- EthenaMinting contract analysis
- StakedUSDeV2 contract analysis
- Gatekeeper role documentation

**Evidence Sufficiency:**
- ✅ If: No privileged actors can block user actions
- ⚠️ If: Emergency pause exists but is time-limited or reversible by governance
- ❌ If: Gatekeepers can indefinitely block mint/redeem without governance override

**Anticipated Finding:** Gatekeepers (minimum 3 entities) can:
- Disable mint/redeem functionality globally
- Remove Minter/Redeemer roles from addresses
- **Cannot** re-enable—only Owner can re-enable

This is an emergency power that could block all USDe minting/redemption.

---

#### 1.7 Token Censorship

**Question:** Can any role freeze, blacklist, seize, or censor ENA token balances or transfers?

**Investigation Approach:**
1. Analyze ENA contract for blacklist/freeze functions
2. Check sENA contract for FULL_RESTRICTED_STAKER_ROLE
3. Determine who can assign restriction roles
4. Review if restricted users can exit

**Sources:**
- ENA contract source code
- sENA contract source code
- StakedUSDeV2 audit findings (Code4rena)

**Evidence Sufficiency:**
- ✅ If: No blacklist or freeze capability exists
- ⚠️ If: Blacklist exists but is limited (e.g., OFAC compliance only)
- ❌ If: Broad blacklist capability exists without constraints

**Anticipated Finding:**
- **ENA token:** Likely no blacklist (standard ERC20 with Ownable2Step)
- **sENA/sUSDe:** Has SOFT_RESTRICTED and FULL_RESTRICTED roles
  - SOFT_RESTRICTED: Cannot stake/unstake
  - FULL_RESTRICTED: Cannot transfer
- Blacklister role can apply these restrictions

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to ENA tokenholders currently active, or merely proposed/theoretical?

**Investigation Approach:**
1. Check if "fee switch" is active (was proposed September 2025)
2. Analyze sENA reward mechanism - what rewards flow to sENA holders?
3. Trace actual value flows from protocol revenue to ENA/sENA holders
4. Distinguish between ecosystem airdrops and protocol revenue

**Sources:**
- Governance forum fee switch proposals
- sENA contract reward distributions
- Ethena Network member commitments (e.g., Ethereal 15%)

**Evidence Sufficiency:**
- ✅ If: Protocol revenue programmatically flows to ENA/sENA holders
- ⚠️ If: Ecosystem airdrops exist but no direct protocol revenue share
- ❌ If: No active value flows exist; all are proposed/future

**Anticipated Finding:** As of late 2025, the "fee switch" was approved in principle but **awaiting Risk Committee approval and governance vote for activation**. Current sENA value comes from:
1. Ecosystem airdrops from partners (e.g., Ethereal 15% commitment)
2. Potential future fee switch activation

**No direct protocol revenue currently flows to ENA holders.**

---

#### 2.2 Treasury Ownership

**Question:** Are protocol treasury assets programmatically controlled by ENA tokenholder governance?

**Investigation Approach:**
1. Identify all treasury/reserve fund addresses
2. Determine who controls these addresses
3. Check if ENA governance can direct treasury spending
4. Review reserve fund governance

**Sources:**
- Reserve Fund address: `0x2b5ab59163a6e93b4486f6055d33ca4a115dd4d5`
- Reserve Fund Subcommittee updates on governance forum
- Treasury flow documentation

**Evidence Sufficiency:**
- ✅ If: Treasury is controlled by ENA governance with onchain execution
- ⚠️ If: Treasury is committee-managed but committee is elected by ENA holders
- ❌ If: Treasury is fully discretionary by Ethena Labs/Foundation

**Anticipated Finding:** Reserve Fund (~$42M in USDtb) is managed by a Risk Committee subcommittee. ENA holders elect Risk Committee bi-annually, but **do not have direct control over treasury spending decisions**.

---

#### 2.3 Accrual Mechanism Control

**Question:** Can only ENA tokenholders modify parameters governing value capture (fees, revenue routing)?

**Investigation Approach:**
1. Identify who can modify fee parameters in protocol
2. Check sUSDe reward rate setting
3. Analyze fee switch activation requirements
4. Review any hardcoded vs. configurable parameters

**Sources:**
- EthenaMinting contract fee parameters
- StakedUSDeV2 reward distribution
- Fee switch governance proposals

**Evidence Sufficiency:**
- ✅ If: Fee parameters require ENA holder approval to change
- ⚠️ If: Parameters are multisig-controlled but governance can override
- ❌ If: Ethena Labs can unilaterally change fee/revenue parameters

**Anticipated Finding:** Fee parameters and reward distributions are controlled by Ethena Labs multisigs (OWNER/OPERATOR roles). ENA holders **cannot directly modify** accrual mechanisms. Fee switch activation requires governance vote but execution depends on Foundation.

---

#### 2.4 Offchain Value Accrual

**Question:** Are there additional offchain value accrual flows that benefit ENA tokenholders?

**Investigation Approach:**
1. Research any legal entity structures that provide ENA holder rights
2. Check for dividend-like structures
3. Investigate Ethena Foundation's relationship to ENA holders
4. Review any documented offchain revenue sharing

**Sources:**
- Ethena Foundation documentation
- Terms of Service
- Legal entity structure research

**Evidence Sufficiency:**
- ✅ If: Documented, legally binding offchain value flows exist
- TBD If: No verified offchain accrual mechanisms

**Anticipated Finding:** No documented offchain value accrual to ENA holders. Ethena Foundation is a Cayman exempted foundation company—**not tokenholder-controlled**.

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is ENA token source code publicly available and verifiably matching deployed bytecode?

**Investigation Approach:**
1. Check Etherscan verification status for ENA contract
2. Locate source code in GitHub repository
3. Compare GitHub source to Etherscan verified source
4. Verify constructor arguments and deployment

**Sources:**
- ENA on Etherscan: `0x57e114B691Db790C35207b2e685D4A43181e6061`
- GitHub: ethena-labs/bbp-public-assets

**Evidence Sufficiency:**
- ✅ If: Source is verified on Etherscan AND matches public GitHub repository
- ⚠️ If: Verified on Etherscan but no public GitHub repository
- ❌ If: Not verified or source unavailable

**Anticipated Finding:** ENA contract should be verified on Etherscan. Need to confirm GitHub source availability.

---

#### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly accessible and verifiable against onchain deployments?

**Investigation Approach:**
1. Check verification status for USDe, sUSDe, EthenaMinting, StakingRewardsDistributor
2. Locate all contracts in GitHub
3. Verify consistency between GitHub and Etherscan

**Sources:**
- All contract addresses from Key Addresses documentation
- GitHub: ethena-labs/bbp-public-assets
- Code4rena audit repositories

**Evidence Sufficiency:**
- ✅ If: All economically material contracts are verified and open source
- ⚠️ If: Some contracts are verified, others are not
- ❌ If: Core contracts are unverified or closed source

**Anticipated Finding:** Core contracts (USDe, sUSDe, EthenaMinting) are verified on Etherscan and open source in GitHub/Code4rena repos.

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does a single actor or coordinated group control a majority of ENA voting supply?

**Investigation Approach:**
1. Analyze ENA holder distribution on Etherscan
2. Identify known wallets (team, investors, foundation, exchanges)
3. Calculate voting power concentration
4. Consider sENA/rsENA as governance power

**Sources:**
- Etherscan token holder page
- Known address labeling
- Tokenomics documentation

**Evidence Sufficiency:**
- ✅ If: No single entity or coordinated group controls >50% of voting supply
- ⚠️ If: Team/investors hold significant but not majority stake
- ❌ If: Ethena Labs or coordinated insiders control majority voting power

**Anticipated Finding:** Initial allocation: Core Contributors 30%, Investors 25%, Foundation 15% = 70% to insiders. Current circulating ~8.2B of 15B total supply. **Need to verify if insider tokens are locked or able to vote.**

**Methodology Note — Holder Distribution Analysis:**

This analysis is inherently **point-in-time** and will be documented as "as of [research date]". The following methodology applies:

1. **Data Sources:**
   - Primary: Etherscan token holders page for ENA (`0x57e114B691Db790C35207b2e685D4A43181e6061`)
   - Secondary: Arkham Intelligence / Nansen labeling if accessible; otherwise manual contract labeling
   - Cross-reference: Snapshot voting power data at `ethenagovernance.eth`

2. **Address Classification:**
   - **Exchanges/Custodians:** CEX deposit addresses (Binance, Coinbase, etc.) — exclude from voting supply
   - **Staking Contracts:** sENA, rsENA contract addresses — count if they represent voting power
   - **Team/Investor Wallets:** Match against known vesting contracts or labeled addresses
   - **Foundation:** Match against documented Foundation addresses
   - **Unknown Large Holders:** Flag addresses with >1% holdings that cannot be attributed

3. **Effective Voting Supply Calculation:**
   - Total Supply minus: Exchange custody, locked vesting contracts (if non-voting), burned tokens
   - Include: Circulating tokens, staked tokens (if they vote), unlocked insider tokens

4. **Concentration Metrics:**
   - Top 10 holders % of total supply
   - Top 10 holders % of effective voting supply
   - Insider bloc (Contributors + Investors + Foundation) % of voting supply
   - Herfindahl-Hirschman Index (HHI) if granular data permits

5. **Limitations:**
   - Point-in-time snapshot; distribution changes with trading/vesting
   - Some addresses may be mislabeled or unlabeled
   - Cannot verify beneficial ownership behind custodial addresses

---

#### 4.2 Future Token Unlocks

**Question:** Are there known future events that will materially affect token concentration?

**Investigation Approach:**
1. Map vesting schedule from tokenomics documentation
2. Calculate upcoming cliff events
3. Assess impact on voting power distribution
4. Note any inflation from mint function

**Sources:**
- Tokenomics docs: https://docs.ethena.fi/ena/tokenomics
- Vesting trackers (tokenomist.ai, cryptorank.io)

**Evidence Sufficiency:**
- ✅ If: No material cliffs expected OR schedule is fully disclosed
- ⚠️ If: Significant unlocks expected but disclosed
- ❌ If: Opaque or undisclosed unlock schedule

**Anticipated Finding:**
- TGE: March 5, 2024
- 1-year cliff (25%): March 2025 - **already passed**
- 3-year linear vesting: Through March 2028
- Full unlock: April 2027

Material unlocks are ongoing. Core Contributors + Investors = 55% subject to vesting.

---

### Metric 5: Offchain Dependencies

#### 5.1 Trademark

**Question:** Are core trademarks owned or controlled by a tokenholder-controlled legal entity?

**Investigation Approach:**
1. Search USPTO for Ethena, ENA, USDe trademarks (TSDR database)
2. Search WIPO Global Brand Database for international filings
3. Identify registrant/owner entity
4. Cross-reference owner against known Ethena entities
5. Determine relationship between trademark holder and ENA governance

**Sources:**
- USPTO TSDR: https://tsdr.uspto.gov/ (search "Ethena", "USDe")
- WIPO Global Brand Database: https://branddb.wipo.int/
- Documentation claims about IP ownership

**Methodology Notes:**
- USPTO/WIPO searches are publicly accessible but may be blocked by CAPTCHA
- If CAPTCHA blocks access, fallback to documentation claims with explicit limitation noted
- Trademark searches provide registrant name but not necessarily beneficial ownership

**Evidence Sufficiency:**
- ✅ If: Trademarks held by DAO-controlled entity with ENA governance authority
- ⚠️ If: Trademarks held by Foundation that is partially ENA-controlled
- ❌ If: Trademarks held by Ethena Labs or unrelated entity

**Anticipated Finding:** Trademarks likely held by Ethena Labs (Portugal) or Ethena Foundation (Cayman Islands). **Neither is tokenholder-controlled.** If trademark search fails due to access issues, this will be noted as a limitation.

---

#### 5.2 Distribution

**Question:** Are primary domains and distribution assets owned by a tokenholder-controlled legal entity?

**Investigation Approach:**
1. Check domain ownership for ethena.fi, app.ethena.fi
2. Review Terms of Service for contracting party
3. Identify who controls primary frontend/interface

**Sources:**
- WHOIS lookups
- Terms of Service: https://docs.ethena.fi/resources/terms-of-service
- Interface deployment investigation

**Evidence Sufficiency:**
- ✅ If: Domains/interfaces controlled by DAO or tokenholder-governed entity
- ⚠️ If: Foundation controls but has some tokenholder oversight
- ❌ If: Ethena Labs controls with no tokenholder authority

**Anticipated Finding:** Per Terms of Service, Ethena Foundation is the contracting party. Foundation is **not tokenholder-controlled** (it's a Cayman exempted foundation company).

---

#### 5.3 Licensing

**Question:** Is core protocol software/IP owned or controlled by a tokenholder-controlled legal entity?

**Investigation Approach:**
1. Check GitHub license files
2. Review any IP assignment documentation
3. Identify software copyright holder

**Sources:**
- GitHub repository licenses
- Legal documentation
- Foundation/Labs relationship

**Evidence Sufficiency:**
- ✅ If: IP is open source (permissive license) OR owned by DAO
- ⚠️ If: IP owned by Foundation with partial tokenholder oversight
- ❌ If: IP owned by Ethena Labs with no tokenholder control

**Anticipated Finding:** Contracts are open source (likely MIT or similar based on Code4rena disclosure). Copyright holder is likely Ethena Labs. Need to verify license terms.

---

## Gaps and Concerns

### High-Priority Gaps

1. **Governance is not onchain**: All governance is Snapshot signaling → multisig execution. ENA holders have no binding onchain authority.

2. **No active value accrual to ENA**: Fee switch was proposed but not yet activated as of late 2025. sENA rewards are from ecosystem airdrops, not protocol revenue.

3. **Concentrated insider holdings**: 70% initial allocation to Contributors, Investors, Foundation. Vesting is ongoing but significant insider power remains.

4. **Multisig control without timelock**: Dev Multisig (4/8) controls all upgrades and protocol parameters. No timelock documented.

5. **Blacklist capability in staking contracts**: FULL_RESTRICTED_STAKER_ROLE can block transfers for sENA/sUSDe holders.

### Medium-Priority Gaps

6. **Foundation is not tokenholder-controlled**: Ethena Foundation (Cayman) operates protocol but is not governed by ENA holders.

7. **Fee switch activation uncertainty**: Risk Committee approval + governance vote required, but execution is discretionary.

8. **ENA mint function is discretionary**: 10% max inflation per year, but multisig can invoke without governance approval.

### Areas Requiring On-Chain Verification

- ENA contract: Confirm no proxy pattern, verify mint constraints in bytecode
- sENA contract: Verify BLACKLISTER role permissions
- Multisig configurations: Confirm 4/8 threshold and signer identities
- Governance execution: Trace any Snapshot votes to multisig actions

---

## Evidence Standards

For each criteria, evidence must be:

1. **Primary**: Direct contract code, onchain transactions, or official documentation
2. **Verifiable**: Reproducible by independent researcher
3. **Current**: Reflects active deployments, not historical or planned states
4. **Specific**: Exact function names, line numbers, transaction hashes

### Evidence Types

| Type | Example | Weight |
|------|---------|--------|
| Contract code | `function mint() onlyOwner` at line 45 | Primary |
| Etherscan verification | Contract verified with matching source | Primary |
| Onchain transaction | Multisig execution TX hash | Primary |
| Official documentation | docs.ethena.fi statements | Secondary |
| Forum posts | gov.ethenafoundation.com proposals | Secondary |
| Third-party analysis | Audit reports, research | Supporting |

---

## Execution Checklist

### Phase 1: Contract Analysis
- [ ] Read ENA contract source on Etherscan
- [ ] Read sENA contract source on Etherscan
- [ ] Read USDe contract source on Etherscan
- [ ] Read sUSDe contract source on Etherscan
- [ ] Read EthenaMinting contract source
- [ ] Map all admin functions and owners
- [ ] Verify proxy/upgrade patterns

### Phase 2: Governance Analysis
- [ ] Review Snapshot voting history
- [ ] Analyze binding vs. signaling votes
- [ ] Trace vote → execution examples
- [ ] Map committee structure and election process
- [ ] Document Risk Committee powers

### Phase 3: Value Flow Analysis
- [ ] Map protocol revenue sources
- [ ] Trace revenue → sUSDe rewards path
- [ ] Assess fee switch status and requirements
- [ ] Analyze sENA reward mechanism
- [ ] Document treasury control

### Phase 4: Distribution Analysis
- [ ] Analyze ENA holder distribution
- [ ] Identify insider wallets
- [ ] Calculate voting power concentration
- [ ] Map vesting schedule status

### Phase 5: Offchain Analysis
- [ ] Search trademark registrations
- [ ] Review Terms of Service
- [ ] Identify legal entity structure
- [ ] Check software licenses

---

## Expected Findings Summary

Based on preliminary research, the ENA token is likely to show:

| Metric | Expected Status | Key Issue |
|--------|-----------------|-----------|
| Onchain Governance | ⚠️ | Snapshot signaling only, multisig execution |
| Role Accountability | ⚠️ | Committees elected but not enforceable |
| Protocol Upgrade | ⚠️ | Multisig-controlled, no timelock |
| Token Upgrade | ⚠️ | Owner can mint up to 10%/year |
| Supply Control | ⚠️ | Rate-limited but discretionary |
| Access Gating | ⚠️ | Gatekeepers can disable mint/redeem |
| Token Censorship | ⚠️ | Blacklist roles in staking contracts |
| Accrual Active | ⚠️/❌ | Fee switch pending, airdrops only |
| Treasury Ownership | ⚠️ | Committee-managed, not DAO-controlled |
| Mechanism Control | ❌ | Multisig controls all parameters |
| Offchain Accrual | TBD | No verified flows |
| Token Source | ✅ | Expected verified |
| Protocol Source | ✅ | Expected verified |
| Concentration | ⚠️ | 70% insider allocation initially |
| Supply Schedule | ⚠️ | Ongoing unlocks through 2028 |
| Trademark | ⚠️ | Likely Labs/Foundation owned |
| Distribution | ⚠️ | Foundation-controlled interface |
| Licensing | TBD | Need to verify |

---

## Appendix: Quick Reference

### Key Contracts to Analyze
```
ENA:       0x57e114B691Db790C35207b2e685D4A43181e6061
sENA:      0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9
USDe:      0x4c9edd5852cd905f086c759e8383e09bff1e68b3
sUSDe:     0x9d39a5de30e57443bff2a8307a4256c8797a3497
Minting:   0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3
DevMulti:  0x3b0aaf6e6fcd4a7ceef8c92c32dfea9e64dc1862
```

### Key Documentation URLs
```
Governance:  https://docs.ethena.fi/solution-overview/governance
ENA Token:   https://docs.ethena.fi/ena
Addresses:   https://docs.ethena.fi/solution-design/key-addresses
Multisigs:   https://docs.ethena.fi/solution-design/key-trust-assumptions/matrix-of-multisig-and-timelocks
Forum:       https://gov.ethenafoundation.com
Snapshot:    https://snapshot.org/#/ethenagovernance.eth
```

### Key Questions This Research Must Answer

1. **Does ENA give holders enforceable onchain control?** (Likely: No)
2. **Does ENA have active value accrual?** (Likely: Not yet / airdrops only)
3. **Can ENA holders prevent adverse actions by Ethena Labs?** (Likely: No)
4. **Is the ENA/Ethena relationship verifiable?** (Likely: Yes, code is open source)
5. **Is ENA voting power meaningfully distributed?** (Likely: No, heavy insider concentration)
