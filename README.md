<p align="center">
  <img src="https://uploads-ssl.webflow.com/5e997428d0f2eb13a90aec8c/635283b535e03c60d5aafe64_logo_aragon_isotype.png" alt="Aragon Logo" width="80" />
  <br><br>
  <strong>The Ownership Token Framework</strong>
  <br>
  <em>An Evidence-Based Framework to Evaluate Tokens on Fundamentals</em>
  <br><br>
  <a href="https://blog.aragon.org/the-ownership-token-index-a-verifiable-standard-for-tokens-as-an-investable-asset-class/"><img src="https://img.shields.io/badge/Blog-Aragon-blue" alt="Blog"></a>
  <a href="https://aragon.org"><img src="https://img.shields.io/badge/Website-aragon.org-orange" alt="Website"></a>
</p>

## Table of Contents

- [Overview](#overview)
  - [Why This Matters](#why-this-matters)
- [Ownership Metrics](#ownership-metrics)
  - [Metric #1: Onchain Control](#metric-1-onchain-control)
  - [Metric #2: Value Accrual](#metric-2-value-accrual)
  - [Metric #3: Verifiability](#metric-3-verifiability)
  - [Metric #4: Token Distribution](#metric-4-token-distribution)
- [Offchain Dependencies](#offchain-dependencies)
- [Research Methodology](#research-methodology)
  - [Control Mapping](#control-mapping)
  - [Authority Classifications](#authority-classifications)
  - [Workflow](#workflow)
- [Related Reading](#related-reading)

---

## Overview

The Ownership Token Framework is an evidence-based framework for evaluating a token's programmatic economic rights using primary evidence of active onchain deployments and offchain dependencies that may reinforce or undermine those rights. The objective is to make ownership legible, verifiable, and comparable across projects.

---

### Why This Matters

Tokens trade on beliefs about a project's prospects without evidence of what the token can credibly claim. Often, a token's relationship to a protocol's revenues, treasuries, or other economic outcomes is weak, indirect, or purely narrative.

The Ownership Token Framework is built to make that relationship explicit. "Ownership" means having an onchain enforceable claim—directly or via tokenholder-governed execution—over the assets and value flows that determine economic outcomes.

The core innovation of smart-contract platforms is that economically material rights can be encoded into contracts, executed by rule, and verified from primary evidence. But in practice, these rights exist only where deployed contracts use token balances to govern permissions, execution, or economic distributions; they are not intrinsic to the ERC-20 standard. When these control planes are not implemented or are bypassable, economically material outcomes become discretionary: tokenholder exposure becomes contingent on trust and markets typically discount that uncertainty.

We take the view that verifiably enforceable ownership is a prerequisite for tokens to be evaluated on fundamentals. The Framework is designed to make these rights legible, verifiable, and comparable across projects, so that participants can assess them using evidence and reach their own conclusions. The metrics and criteria can also be used in a regulatory context, by grounding assessments of control for network tokens in verifiable evidence.

---

## Ownership Metrics

The metrics below decompose ownership claims into four metrics:

1. Where economically material onchain control sits
2. Whether a live value engine produces observable accrual to the token
3. Whether the relevant code and relationships are independently verifiable
4. Whether ownership and therefore voting power is meaningfully distributed rather than concentrated into common-control blocks

---

### Metric #1: Onchain Control

This metric evaluates whether economically material outcomes are mediated through tokenholder governance, or whether admins, multisigs, security councils, or other privileged roles retain onchain powers that can change the rules or selectively restrict use and exit. Concretely, it maps who can upgrade core logic, change parameters, invoke emergency actions, modify token behavior or supply, freeze/blacklist/seize/force-transfer assets, or limit protocol actions and exit paths.

#### Rationale

Enforceable ownership requires more than whether or not governance exists. Tokenholder rights only hold if tokenholders are the controlling authority over any other actors or governing bodies. If admin keys, multisigs, security councils, operators, or privileged roles can bypass governance, pause or block participation in the system, or freeze/blacklist/seize/force-transfer assets, then the system loses its credible neutrality and tokenholder control is conditional.

#### Criteria

- **On-chain Governance Workflow:** Evaluates whether an onchain process exists that grants tokenholders ultimate authority over protocol decisions.
- **Role Accountability:** Determines whether all privileged or value-impacting roles are governed, revocable, and accountable to tokenholders.
- **Protocol Upgrade Authority:** Determines whether core protocol logic can be upgraded and whether such upgrades are controlled by tokenholders.
- **Token Upgrade Authority:** Assesses whether token behavior can be modified and, if so, whether such changes are controlled by tokenholder governance.
- **Supply Control:** Evaluates whether token supply changes are programmatic or subject exclusively to tokenholder-approved governance processes.
- **Privileged Access Gating:** Assesses whether any bounded actor set can block or selectively restrict economically meaningful protocol actions or exit paths, versus access that is permissionless and symmetric for similarly situated users.
- **Token Censorship:** Examines whether any roles exist that can freeze, blacklist, seize, or otherwise censor token balances or transfers.

---

### Metric #2: Value Accrual

This metric evaluates whether the system's operation produces observable, onchain value flows (or token-scarcity effects) that accrue value to tokenholders under rule-based constraints that do not rely on manual transfers, trusted executors, or other unenforced expectations. It focuses on whether a real value engine exists and is active.

#### Rationale

Tokenholder ownership is only economically meaningful if there is a live, programmatic mechanism that converts system operation into token-level accrual (or token-scarcity accrual). If value flows depend on discretionary transfers, informal commitments, or non-legally binding offchain arrangements, then the "ownership" claim is expectation rather than mechanism. If accrual cannot be verified from primary onchain evidence or backed by legally binding, verifiable offchain agreements, the economic claim is not reliably enforceable.

#### Criteria

- **Accrual Active:** Assesses whether value flows to tokenholders are currently active rather than merely theoretical or proposed.
- **Treasury Ownership:** Determines whether protocol treasury assets are programmatically controlled by tokenholder governance.
- **Accrual Mechanism Control:** Evaluates whether tokenholders can modify parameters governing value capture, such as fees or revenue routing.
- **Offchain Value Accrual:** Is there a legal entity and structure in place that gives tokenholders offchain ownership of new IP?

---

### Metric #3: Verifiability

This metric measures whether a token's economically material code and deployments are independently verifiable from primary evidence without relying on insider assurances. In practice, it answers: what code is running, where it is deployed, and whether the deployed bytecode can be credibly matched to publicly available source (including proxy implementations and build inputs where relevant).

#### Rationale

Verifiability is the precondition for evaluating ownership on fundamentals. If code is not publicly accessible or cannot be bound to onchain deployments, then claims about control rights, governance authority, and value accrual collapse into narrative because the underlying system cannot be independently audited. Licensing and IP terms can also function as an external control surface: they determine who can legally operate, modify, or commercialize key software, and can therefore reinforce or undermine the credibility of tokenholder-aligned ownership claims.

#### Criteria

- **Token Contract Source Verification:** Determines whether the token contract's source code is publicly available and verifiably matches the deployed bytecode.
- **Protocol Component Source Verification:** Determines whether core protocol contracts are publicly accessible and verifiable against their onchain deployments.

---

### Metric #4: Token Distribution

This metric evaluates whether ownership and therefore effective voting power in governance is meaningfully distributed. It measures whether any single actor or coordinated group under common control can form a controlling block large enough to determine or constrain tokenholder-governed outcomes.

#### Rationale

Ownership rights depend on whether ownership is dispersed or controlled. When a common-control bloc holds a dominant share, minority tokenholders may retain formal voting rights but lack practical control: outcomes can be determined by the bloc, and "tokenholder governance" becomes de facto controller governance—even when protocol rules are otherwise transparent.

#### Criteria

- **Ownership Concentration:** Measures whether a single actor or coordinated group controls a majority of the voting supply.
- **Supply Schedule:** Are there known, future events (such as vesting cliffs) that will materially affect the concentration of tokens?

---

## Offchain Dependencies

Economically material assets and obligations often sit offchain—outside the custody and direct enforcement of a token—while still determining which interfaces and domains most users reach, where fees are charged or captured, who can commercialize or restrict the software, and who can sign contracts or move offchain funds.

These include:
- Brand and trademarks
- IP and licensing rights
- Domains and interfaces (front-ends, hosting, key repositories)
- Commercial contracts
- Custody of offchain assets (including bank accounts where applicable)

Because a token cannot hold or sign for these assets, enforceable tokenholder ownership typically requires a tokenholder-representing entity that can hold title and enter obligations on tokenholders' behalf, with authority explicitly anchored to onchain governance outcomes.

### Key Questions

- **Brand/IP:** Are core trademarks and brand assets owned or controlled by a tokenholder-controlled legal entity?
- **Product/IP Rights:** Is core protocol software/IP (and any associated licensing rights, where applicable) owned or controlled by a tokenholder-controlled legal entity?
- **Interfaces and Distribution:** Are primary domains and distribution assets (front-ends, hosting, key repositories, and related interface infrastructure) owned or controlled by a tokenholder-controlled legal entity?

The key question is whether offchain control is enforceably aligned with tokenholder-authorized onchain decisions or remains discretionary. If alignment is weak, economically material decisions can be made outside tokenholder mechanisms even when the onchain system is otherwise immutable or tokenholder-controlled.

---

## Research Methodology

Token balances do not intrinsically confer rights over a protocol. Rights exist only where other deployed systems explicitly bind token balances to economically material outcomes—through governance eligibility, execution authority, permissions, or distributions. Accordingly, evidence of tokenholder ownership must focus on the intermediate contracts and control systems that implement (or fail to implement) those relationships.

We assess control by identifying **ultimate authority** for a given economically material action. Ultimate authority is the ability to reliably determine the outcome either by executing the action, or by preventing its execution under the system's rules. Tokenholder voting or signaling does not constitute control unless tokenholder-governed mechanisms can execute the action or block any non-tokenholder actor from executing it.

The analysis scope is defined per protocol and is restricted to economically material components:
- The token contract
- Core protocol contracts that hold assets, determine risk/economic parameters, or route value
- Upgrade and emergency control modules
- Governance executors/timelocks (or equivalent)
- Treasury custody/execution paths

### Control Mapping

Control is assessed at the function level. For each economically material function (e.g., upgrades, parameter changes, treasury movements, distributions, mint/burn, withdrawal gating), we identify:

- **Execution paths:** owners/admins/roles, governance executors, multisigs/EOAs, operators/keepers
- **Blocking paths:** pause/cancel/revoke/caps, withdrawal halts, role revocations
- **Bypass paths:** emergency routes, alternate upgrade routes, timelock bypasses
- **Constraints:** timelocks, thresholds/quorum, scope limits, separation of roles, and whether authority can be reassigned or altered over time

### Authority Classifications

Each economically material function is classified as having an authority:

| Classification | Description |
|----------------|-------------|
| **Immutable** | No admin/upgrade/parameter path can change the economically material outcome. |
| **Tokenholder-controlled** | Tokenholder-governed execution ultimately authorizes/executes the action and can prevent non-token actors from overriding it. |
| **Discretionary** | EOAs/multisigs/operators/councils can act outside tokenholder mechanisms (even if voting exists). |
| **Unknown** | Cannot be established from primary evidence; we record what is known and why it cannot be verified. |

### Workflow

1. **Scope economically material components:** token contract, core protocol logic, upgrade/emergency controls, governance executors, treasury custody/execution, and value routing paths (if any).
2. **Map control paths** for each economically material function: execution, veto, bypass, and constraints.
3. **Classify authority** per function using the canonical labels (immutable / tokenholder-controlled / discretionary / unknown).
4. **Validate** against active deployments (bytecode/config) and observable behavior (history/traces).
5. **Record external control surfaces** where economically material, using public evidence with explicit confidence/unknown handling.
6. **Aggregate** function-level classifications and evidence bundles into the framework's five metrics, preserving links to underlying evidence and resources.

---

## Related Reading

- [The Ownership Token Index: A Verifiable Standard for Tokens as an Investable Asset Class](https://blog.aragon.org/the-ownership-token-index-a-verifiable-standard-for-tokens-as-an-investable-asset-class/)
- [Making Tokens Investable in 2026 Through Ownership, Automation, and Value Accrual](https://blog.aragon.org/making-tokens-investable-in-2026-through-ownership-automation-and-value-accrual/)
- [Beyond Proposals: Automation and the Art of Not Governing](https://blog.aragon.org/beyond-proposals-pt-i-automation-and-the-art-of-not-governing/)

---

<p align="center">
  <a href="https://aragon.org">aragon.org</a>
</p>
