# SKY Token Research Plan

## Aragon Ownership Token Framework Analysis

**Target Token:** SKY (0x56072C95FAA701256059aa122697B133aDEd9279)
**Protocol:** Sky Protocol (formerly MakerDAO)
**Network:** Ethereum Mainnet
**Date:** 2026-02-16

---

## Executive Summary

This research plan maps the SKY token against the Aragon Ownership Token Framework's 5 metrics and 18 criteria. The goal is to determine what SKY tokenholders unilaterally control, what gives the token economic value, and what threatens that value.

**Critical Distinction:** This analysis evaluates the *SKY token itself*, not the Sky/MakerDAO protocol or ecosystem. The question is whether SKY gives holders enforceable, on-chain control and economic claims.

---

## Resource Inventory

### Confirmed Sources (Verified Accessible)

#### Core Contracts on Etherscan

| Contract | Address | Type |
|----------|---------|------|
| SKY Token | `0x56072C95FAA701256059aa122697B133aDEd9279` | ERC-20 |
| USDS Token | `0xdC035D45d973E3EC169d2276DDab16f1e407384F` | ERC-20 (UUPS Proxy) |
| sUSDS Token | `0xa3931d71877C0E7a3148CB7Eb4463524FEc27fBD` | ERC-4626 (Proxy) |
| MKR Token | `0x9f8F72aA9304c8B593d555F12EF6589cC3A579A2` | ERC-20 |
| MCD Vat | `0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B` | Core Accounting |
| MCD Pause Proxy | `0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB` | Governance Executor |
| DSChief (Governance) | `0x0a3f6849f78076aefaDf113F5BED87720274dDC0` | Approval Voting |
| New SKY Chief | `0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9` | SKY-based Voting |
| MKR-to-SKY Converter | `0xA1Ea1bA18E88C381C724a75F23a130420C403f9a` | One-way Conversion |
| Vote Delegate Factory | `0x4Cf3DaeFA2683Cd18df00f7AFF5169C00a9EccD5` | Delegation |
| Protego | `0x5C9c3cb0490938c9234ABddeD37a191576ED8524` | Emergency Cancel |
| PSM-USDC-A | `0x0a59649758aa4d66e25f08dd01271e891fe52199` | Peg Stability |
| USDS Vest | `0xc447a9745aDe9A44Bb9E37B7F6C92f9582544110` | Token Vesting |
| SKY Vest | `0x67eaDb3288cceDe034cE95b0511DCc65cf630bB6` | Token Vesting |

#### GitHub Repositories (sky-ecosystem)

| Repository | URL | Purpose |
|------------|-----|---------|
| sky | https://github.com/sky-ecosystem/sky | SKY token contract |
| usds | https://github.com/sky-ecosystem/usds | USDS stablecoin |
| stusds | https://github.com/sky-ecosystem/stusds | Staked USDS |
| dss | https://github.com/sky-ecosystem/dss | Core DSS System |
| ds-chief | https://github.com/sky-ecosystem/ds-chief | Approval Voting |
| ds-pause | https://github.com/sky-ecosystem/ds-pause | Timelock |
| spells-mainnet | https://github.com/sky-ecosystem/spells-mainnet | Executive Spells |
| dss-exec-lib | https://github.com/sky-ecosystem/dss-exec-lib | Spell Library |
| governance-portal-v2 | https://github.com/sky-ecosystem/governance-portal-v2 | Governance UI |
| sky-governance-portal | https://github.com/sky-ecosystem/sky-governance-portal | New Governance UI |
| vote-delegate | https://github.com/sky-ecosystem/vote-delegate | Delegation |
| dss-emergency-spells | https://github.com/sky-ecosystem/dss-emergency-spells | Emergency Actions |
| sky-oapp-oft | https://github.com/sky-ecosystem/sky-oapp-oft | Cross-chain Bridge |

#### Documentation

| Resource | URL |
|----------|-----|
| Sky Protocol Docs | https://developers.sky.money |
| Maker Protocol Docs | https://docs.makerdao.com |
| Vat Documentation | https://docs.makerdao.com/smart-contract-modules/core-module/vat-detailed-documentation |
| Vow Documentation | https://docs.makerdao.com/smart-contract-modules/system-stabilizer-module/vow-detailed-documentation |
| Pot Documentation | https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation |

#### Governance Resources

| Resource | URL |
|----------|-----|
| Governance Portal | https://vote.makerdao.com |
| Sky Forum | https://forum.sky.money |

#### Legal/Trademark

| Resource | URL |
|----------|-----|
| DAI Foundation | https://daifoundation.org |
| MAKERDAO Trademark (USPTO) | https://trademarks.justia.com/878/77/makerdao-87877844.html |

---

## Criteria-by-Criteria Research Plan

### Metric 1: Onchain Control

#### 1.1 Onchain Governance Workflow

**Question:** Does an onchain process exist that grants SKY tokenholders ultimate authority over protocol decisions?

**Investigation Approach:**
1. Examine DSChief contract (`0x0a3f6849...`) for approval voting mechanics
2. Verify new SKY Chief contract (`0x929d9A14...`) authorizes SKY-based voting
3. Trace execution path: SKY -> Chief -> Pause -> Protocol
4. Verify MKR-to-SKY conversion (24,000:1 ratio) and governance equivalence

**Sources:**
- DSChief contract on Etherscan
- ds-chief repository README
- New SKY Chief contract code
- MKR-to-SKY converter contract

**Evidence Sufficiency:**
- Must show SKY can be locked for voting weight
- Must show "hat" (winning spell) execution path to Pause Proxy
- Must show 48-hour GSM Pause Delay enforcement
- Must verify no bypass routes exist

**Risks/Gaps:**
- Transition from MKR-based to SKY-based voting may be incomplete
- Need to verify both old and new Chief contracts

#### 1.2 Role Accountability

**Question:** Are all privileged or value-impacting roles governed, revocable, and accountable to tokenholders?

**Investigation Approach:**
1. Map all `wards` (authorized addresses) in core DSS contracts
2. Verify Pause Proxy is ultimate owner of all system contracts
3. Check for multisig dependencies outside governance
4. Examine Protego emergency cancel mechanism

**Sources:**
- Vat contract `wards` mapping
- DSS contract ownership chains
- dss-exec-lib for role management patterns
- Protego contract on Etherscan

**Evidence Sufficiency:**
- Complete list of privileged roles with addresses
- Each role must trace back to governance control
- Emergency roles must have limited, auditable scope

**Risks/Gaps:**
- Complex auth system may have obscure pathways
- "Arrangers" for real-world assets introduce offchain dependencies

#### 1.3 Protocol Upgrade Authority

**Question:** Can core protocol logic be upgraded, and is this controlled by tokenholders?

**Investigation Approach:**
1. Check DSS core contracts (Vat, Vow, Jug, etc.) for upgradeability
2. Examine spell mechanism for system modifications
3. Verify all upgrades flow through Chief -> Pause -> Proxy

**Sources:**
- DSS contract bytecode analysis
- spells-mainnet repository for upgrade examples
- Recent executive spells on governance portal

**Evidence Sufficiency:**
- List all upgradeable vs immutable components
- For upgradeable: show governance-only upgrade path
- For immutable: confirm no admin backdoors

**Risks/Gaps:**
- Some contracts may have undocumented upgrade paths
- New USDS contracts use UUPS pattern - need careful review

#### 1.4 Token Upgrade Authority

**Question:** Can the SKY token behavior be modified? If so, by whom?

**Investigation Approach:**
1. Analyze SKY token contract for proxy patterns
2. Check for mint/burn capabilities and who controls them
3. Verify MkrSky converter governance controls

**Sources:**
- SKY token contract source (sky repository)
- SKY token on Etherscan
- MkrSky converter contract

**Evidence Sufficiency:**
- SKY contract upgradeability status (immutable or proxy)
- If upgradeable: governance-only admin
- If immutable: confirm no mutation paths

**Risks/Gaps:**
- SKY is relatively new - need to verify deployment patterns

#### 1.5 Supply Control

**Question:** Are token supply changes programmatic or tokenholder-approved?

**Investigation Approach:**
1. Check SKY token for mint/burn functions
2. Verify MkrSky converter is only mint source
3. Examine conversion ratio enforcement (1 MKR = 24,000 SKY)

**Sources:**
- SKY token mint/burn functions
- MkrSky converter contract
- Total supply tracking on Etherscan

**Evidence Sufficiency:**
- List all mint/burn pathways
- Each pathway must be governance-controlled or programmatic
- No arbitrary inflation possible

**Risks/Gaps:**
- Conversion from MKR effectively sets supply
- Need to verify no additional mint capabilities exist

#### 1.6 Privileged Access Gating

**Question:** Can any bounded actor set block or selectively restrict protocol actions or exit paths?

**Investigation Approach:**
1. Check for pause/freeze functions in DSS contracts
2. Examine PSM for gating mechanisms
3. Review emergency shutdown (End) module controls

**Sources:**
- MCD Pause contract
- End module documentation
- PSM contracts

**Evidence Sufficiency:**
- List all pause/freeze capabilities
- Verify each is governance-controlled
- Confirm exit paths (redeem DAI/USDS) remain open

**Risks/Gaps:**
- Emergency shutdown could affect all users
- PSM may have capacity limits

#### 1.7 Token Censorship

**Question:** Can any roles freeze, blacklist, seize, or censor SKY token balances/transfers?

**Investigation Approach:**
1. Analyze SKY token for blacklist/freeze functions
2. Check for admin transfer capabilities
3. Review ERC-20 implementation completeness

**Sources:**
- SKY token contract source
- SKY token bytecode on Etherscan

**Evidence Sufficiency:**
- Confirm absence of blacklist mapping
- Confirm absence of pause functionality
- Confirm standard transfer functions only

**Risks/Gaps:**
- Low risk - MKR historically had no censorship mechanisms

---

### Metric 2: Value Accrual

#### 2.1 Accrual Active

**Question:** Are value flows to SKY tokenholders currently active?

**Investigation Approach:**
1. Trace protocol revenue from stability fees
2. Examine surplus buffer (Vow.hump) mechanics
3. Check for active flap (surplus) auctions
4. Review any SKY staking or reward mechanisms

**Sources:**
- Vow contract surplus tracking
- Flapper contract for surplus auctions
- Governance proposals mentioning revenue distribution
- sUSDS/stUSDS for staking yields

**Evidence Sufficiency:**
- Observable protocol revenue in ETH/DAI/USDS
- Mechanism linking revenue to SKY value (burn, buyback, distribution)
- Active operation (not just theoretical)

**Risks/Gaps:**
- Traditional MKR burn from surplus auctions - verify SKY equivalent
- Revenue may flow to treasury without direct token accrual

#### 2.2 Treasury Ownership

**Question:** Are protocol treasury assets programmatically controlled by SKY governance?

**Investigation Approach:**
1. Identify all treasury addresses
2. Verify Pause Proxy control over treasury
3. Examine vest contracts for payment flows

**Sources:**
- MCD Pause Proxy holdings
- Vat surplus tracking
- USDS Vest and SKY Vest contracts

**Evidence Sufficiency:**
- All material treasury balances identified
- Each controlled by governance-executable contracts
- No offchain custody dependencies for onchain assets

**Risks/Gaps:**
- Real-world asset (RWA) collateral has offchain components
- Multiple treasury addresses may exist

#### 2.3 Accrual Mechanism Control

**Question:** Can only tokenholders modify parameters governing value capture?

**Investigation Approach:**
1. Map stability fee setting mechanism
2. Verify DSR (Dai Savings Rate) control
3. Check surplus buffer (hump) parameter governance

**Sources:**
- Jug contract for stability fees
- Pot contract for DSR
- Vow contract for surplus parameters

**Evidence Sufficiency:**
- Each value-capture parameter traced to governance
- No admin overrides outside governance
- Changes require spell execution through Pause

**Risks/Gaps:**
- Parameter changes may be delegated to committees
- Need to verify no immediate-effect changes possible

#### 2.4 Offchain Value Accrual

**Question:** Are there offchain value accrual flows benefiting SKY tokenholders?

**Investigation Approach:**
1. Research any legal structures directing value to token
2. Check for protocol-owned entities distributing value
3. Examine RWA revenue routing

**Sources:**
- DAI Foundation documentation
- Forum discussions on revenue
- Legal wrapper documentation (if any)

**Evidence Sufficiency:**
- Documented legal mechanisms (if any)
- Verifiable flows from offchain to onchain

**Risks/Gaps:**
- Limited offchain value capture typical for DAOs
- May be TBD/unverified

---

### Metric 3: Verifiability

#### 3.1 Token Contract Source Verification

**Question:** Is SKY source code publicly available and verified against deployed bytecode?

**Investigation Approach:**
1. Confirm Etherscan verification status
2. Match GitHub source to deployed bytecode
3. Check compiler settings and optimization

**Sources:**
- SKY token on Etherscan (verified tab)
- sky repository source code

**Evidence Sufficiency:**
- Etherscan shows "Contract Source Code Verified"
- GitHub source matches verified code
- Build reproducible with documented settings

**Risks/Gaps:**
- Low risk - standard verification expected

#### 3.2 Protocol Component Source Verification

**Question:** Are core protocol contracts publicly accessible and verifiable?

**Investigation Approach:**
1. Verify all material DSS contracts on Etherscan
2. Cross-reference with GitHub repositories
3. Check any proxy implementations

**Sources:**
- dss repository
- Individual contract Etherscan pages
- USDS/sUSDS implementation contracts

**Evidence Sufficiency:**
- All contracts in scope verified on Etherscan
- Source matches deployed bytecode
- Proxy implementations verified separately

**Risks/Gaps:**
- Large codebase requires systematic verification
- New Sky contracts (USDS, sUSDS) need particular attention

---

### Metric 4: Token Distribution

#### 4.1 Ownership Concentration

**Question:** Does any single actor or coordinated group control a majority of voting supply?

**Investigation Approach:**
1. Analyze top SKY holders on Etherscan
2. Check MKR-to-SKY conversion concentrations
3. Examine delegate voting power distribution
4. Research known team/foundation holdings

**Sources:**
- Etherscan token holders
- Chief contract locked balances
- Governance portal delegate stats

**Evidence Sufficiency:**
- Top 10 holder analysis with % of supply
- Identification of related addresses if possible
- Conclusion on whether majority control exists

**Risks/Gaps:**
- Address attribution is difficult
- Delegation may concentrate power
- Recent report: "Just four entities account for nearly all the votes"

#### 4.2 Future Token Unlocks

**Question:** Are there vesting cliffs or events that will materially affect concentration?

**Investigation Approach:**
1. Examine SKY Vest contract
2. Review USDS Vest contract
3. Check for team/investor vesting schedules

**Sources:**
- SKY Vest contract (`0x67eaDb32...`)
- Vest schedules in governance proposals
- Forum discussions on token distribution

**Evidence Sufficiency:**
- List of known vesting schedules
- Amounts and unlock dates
- Impact assessment on voting power

**Risks/Gaps:**
- Vesting may be opaque
- Historical MKR vesting carried over to SKY

---

### Offchain Dependencies

#### Trademark

**Question:** Are core trademarks controlled by a tokenholder-controlled entity?

**Investigation Approach:**
1. Research DAI Foundation trademark holdings
2. Verify MAKERDAO, DAI, SKY trademark ownership
3. Assess governance control over DAI Foundation

**Sources:**
- USPTO trademark filings
- DAI Foundation terms of service
- Foundation governance documentation

**Evidence Sufficiency:**
- Trademark registration ownership confirmed
- Legal relationship to token governance assessed
- Control mechanism documented

**Risks/Gaps:**
- DAI Foundation is independent, not directly token-controlled
- New SKY branding trademark status unclear

#### Distribution

**Question:** Are primary domains controlled by tokenholder-aligned entity?

**Investigation Approach:**
1. Identify primary domains (sky.money, vote.makerdao.com)
2. Research domain ownership/control
3. Check for alternative interfaces

**Sources:**
- WHOIS data (if available)
- Forum discussions on interface control
- Alternative front-end documentation

**Evidence Sufficiency:**
- Domain ownership identified
- Relationship to governance assessed
- User exit paths if interface controlled

**Risks/Gaps:**
- Domain control may be opaque
- Multiple interfaces reduce single-point risk

#### Licensing

**Question:** Is protocol software/IP owned or controlled by tokenholder-aligned entity?

**Investigation Approach:**
1. Check license types on GitHub repositories
2. Research IP transfers to DAI Foundation
3. Assess commercialization rights

**Sources:**
- Repository LICENSE files
- DAI Foundation IP documentation
- Maker Foundation dissolution announcements

**Evidence Sufficiency:**
- License type documented (likely AGPL or similar)
- IP ownership traced to specific entity
- Commercialization restrictions assessed

**Risks/Gaps:**
- Open-source licenses reduce IP risk
- Some code may have different licensing

---

## Gaps and Concerns

### High Priority

1. **SKY Governance Transition Status**: Need to verify the current state of transition from MKR-based to SKY-based voting. The new SKY Chief contract exists but may not be fully activated.

2. **Voting Concentration**: Reports indicate "just four entities account for nearly all votes" - this is a significant centralization concern that needs quantification.

3. **Real-World Asset Dependencies**: RWA collateral involves offchain legal structures that may not be governed by SKY tokens.

### Medium Priority

4. **USDS/sUSDS Upgradeability**: New Sky contracts use UUPS proxy pattern - need to verify upgrade authority is exclusively governance-controlled.

5. **Value Accrual Mechanism**: Traditional MKR burn from surplus auctions needs to be mapped to SKY equivalent. May be indirect.

6. **Arranger Legal Structures**: Complex legal structures for RWA may introduce dependencies outside token governance.

### Lower Priority

7. **Cross-chain Bridge Controls**: sky-oapp-oft repository suggests cross-chain functionality - need to assess governance controls.

8. **New SKY Trademark**: Brand transition from Maker/DAI to Sky may have incomplete trademark coverage.

---

## Success Criteria

For each criterion, "done" means:

1. **Primary source evidence** - Contract addresses, code links, or governance proposal IDs
2. **Classification** - Immutable / Tokenholder-controlled / Discretionary / Unknown
3. **Confidence level** - High (verified bytecode) / Medium (documentation) / Low (inferred)
4. **Status** - Positive / Neutral / At Risk

The final research report must enable a reader to independently verify every claim through the provided primary sources.

---

## Methodology Notes

### Authority Classification Definitions

| Classification | Description |
|----------------|-------------|
| Immutable | No admin/upgrade path can change the outcome |
| Tokenholder-controlled | Token governance ultimately authorizes/executes and can prevent overrides |
| Discretionary | EOAs/multisigs/operators can act outside governance |
| Unknown | Cannot be established from primary evidence |

### Evidence Hierarchy

1. Verified contract bytecode on block explorer
2. Verified source code matching bytecode
3. Official documentation
4. Governance proposals/forum posts
5. Third-party analysis (lowest confidence)

---

## Next Steps

1. Execute research plan systematically by metric
2. Document findings in sky-research.md with full source citations
3. Populate sky-metrics.json and sky-tokens.json
4. Review against existing token entries for format consistency
5. Deploy to Vercel for visual verification
