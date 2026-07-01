// Unit tests for the OTF MCP pure logic (src/logic.ts → dist/logic.js).
// Run with Node's built-in test runner — no test-framework dependency:
//   npm test           (build + node --test)
//   npm run test:coverage
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  editDistance,
  closest,
  criterionIdsIn,
  networksIn,
  filterTokens,
  searchTokens,
  tokenNotFoundGuidance,
  STATUS_VOCAB,
} from "../dist/logic.js";

// A small fixture that mirrors the real index shape (id/name/symbol/network/
// score/criteriaStatuses). Two ethereum tokens + one base token, with a shared
// criterion so status distributions are meaningful.
const ROWS = [
  {
    id: "aave",
    name: "AAVE",
    symbol: "AAVE",
    network: "ethereum",
    score: { percentage: 80 },
    criteriaStatuses: {
      "onchain-ctrl__governance-workflow": "positive",
      "value-accrual__mechanism": "warning",
    },
  },
  {
    id: "ldo",
    name: "LDO",
    symbol: "LDO",
    network: "ethereum",
    score: { percentage: 40 },
    criteriaStatuses: {
      "onchain-ctrl__governance-workflow": "at_risk",
      "value-accrual__mechanism": "positive",
    },
  },
  {
    id: "aero",
    name: "Aerodrome",
    symbol: "AERO",
    network: "base",
    score: { percentage: 55 },
    criteriaStatuses: { "onchain-ctrl__governance-workflow": "positive" },
  },
];
const ids = ROWS.map((r) => r.id);

// --------------------------------------------------------------------------
test("editDistance: identity, empties, and known distances", () => {
  assert.equal(editDistance("ldo", "ldo"), 0);
  assert.equal(editDistance("", "abc"), 3);
  assert.equal(editDistance("abc", ""), 3);
  assert.equal(editDistance("lido", "ldo"), 1); // one deletion
  assert.equal(editDistance("kitten", "sitting"), 3);
  assert.equal(editDistance("aave", "aave"), 0);
});

test("editDistance is symmetric", () => {
  assert.equal(editDistance("lido", "ldo"), editDistance("ldo", "lido"));
});

// --------------------------------------------------------------------------
test("closest: typo resolves to the near id", () => {
  const out = closest("lido", ids);
  assert.ok(out.includes("ldo"), `expected 'ldo' in ${JSON.stringify(out)}`);
});

test("closest: genuinely unrelated query returns nothing", () => {
  assert.deepEqual(closest("bitcoin", ids), []);
});

test("closest: substring hit ranks and empty query is empty", () => {
  assert.deepEqual(closest("aer", ["aave", "aero", "ldo"]), ["aero"]);
  assert.deepEqual(closest("", ["aave"]), []);
});

test("closest: dedups, lowercases, and respects max", () => {
  const out = closest("aa", ["AAVE", "aave", "aardvark", "aaa"], 2);
  assert.equal(out.length, 2);
  assert.equal(new Set(out).size, out.length);
  assert.ok(out.every((s) => s === s.toLowerCase()));
});

// --------------------------------------------------------------------------
test("criterionIdsIn: sorted, deduped union across rows", () => {
  assert.deepEqual(criterionIdsIn(ROWS), [
    "onchain-ctrl__governance-workflow",
    "value-accrual__mechanism",
  ]);
  assert.deepEqual(criterionIdsIn([]), []);
});

test("networksIn: sorted, deduped, lowercased, drops empties", () => {
  assert.deepEqual(networksIn(ROWS), ["base", "ethereum"]);
  assert.deepEqual(networksIn([{ id: "x" }]), []);
});

// --------------------------------------------------------------------------
test("filterTokens: no filters returns all rows, no guidance", () => {
  const { rows, guidance } = filterTokens(ROWS, {});
  assert.equal(rows.length, 3);
  assert.equal(guidance, undefined);
});

test("filterTokens: network hit filters, no guidance", () => {
  const { rows, guidance } = filterTokens(ROWS, { network: "ethereum" });
  assert.deepEqual(rows.map((r) => r.id).sort(), ["aave", "ldo"]);
  assert.equal(guidance, undefined);
});

test("filterTokens: network case-insensitive", () => {
  const { rows } = filterTokens(ROWS, { network: "ETHEREUM" });
  assert.equal(rows.length, 2);
});

test("filterTokens: absent network → guidance lists present networks", () => {
  const { rows, guidance } = filterTokens(ROWS, { network: "solana" });
  assert.equal(rows.length, 0);
  assert.match(guidance, /networks present: base, ethereum/);
});

test("filterTokens: minScorePercentage keeps only qualifying rows", () => {
  const { rows } = filterTokens(ROWS, { minScorePercentage: 50 });
  assert.deepEqual(rows.map((r) => r.id).sort(), ["aave", "aero"]);
});

test("filterTokens: unknown criterion → correctable 'did you mean'", () => {
  const { rows, guidance } = filterTokens(ROWS, {
    criterion: "governance-workflow", // truncated: missing the metric prefix
    status: "positive",
  });
  assert.equal(rows.length, 0);
  assert.match(guidance, /Unknown criterion/);
  assert.match(guidance, /Did you mean: onchain-ctrl__governance-workflow/);
  assert.match(guidance, /retry with a valid id/i);
});

test("filterTokens: valid criterion + status hit returns rows, no guidance", () => {
  const { rows, guidance } = filterTokens(ROWS, {
    criterion: "onchain-ctrl__governance-workflow",
    status: "positive",
  });
  assert.deepEqual(rows.map((r) => r.id).sort(), ["aave", "aero"]);
  assert.equal(guidance, undefined);
});

test("filterTokens: valid criterion, genuinely-empty status → COMPLETE, no loop", () => {
  const { rows, guidance } = filterTokens(ROWS, {
    criterion: "onchain-ctrl__governance-workflow",
    status: "reference", // no token holds this
  });
  assert.equal(rows.length, 0);
  assert.match(guidance, /Complete result \(0 is correct/);
  assert.match(guidance, /do not repeat this query/);
  // surfaces the real distribution so the agent understands the emptiness
  assert.match(guidance, /"positive":2/);
  assert.match(guidance, /"at_risk":1/);
});

test("filterTokens: criterion without status does not filter, nudges to add status", () => {
  const { rows, guidance } = filterTokens(ROWS, {
    criterion: "onchain-ctrl__governance-workflow",
  });
  assert.equal(rows.length, 3);
  assert.match(guidance, /set without status/);
  assert.match(guidance, new RegExp(STATUS_VOCAB.join("\\|")));
});

test("filterTokens: valid multi-filter that is genuinely empty → COMPLETE, not 'relax'", () => {
  const { rows, guidance } = filterTokens(ROWS, {
    network: "base",
    minScorePercentage: 90, // aero (base) is 55 → empty
  });
  assert.equal(rows.length, 0);
  assert.match(guidance, /Complete result \(0 is correct/);
  assert.doesNotMatch(guidance, /did you mean/i);
});

// --------------------------------------------------------------------------
test("searchTokens: substring match on id/name/symbol", () => {
  assert.equal(searchTokens(ROWS, "aave").matches.length, 1);
  assert.equal(searchTokens(ROWS, "aero").matches.length, 1); // symbol
  assert.equal(searchTokens(ROWS, "aerodrome").matches.length, 1); // name
  assert.equal(searchTokens(ROWS, "AAVE").matches.length, 1); // case-insensitive
});

test("searchTokens: typo → close-id guidance (retry), not 'not analyzed'", () => {
  const { matches, guidance } = searchTokens(ROWS, "lido");
  assert.equal(matches.length, 0);
  assert.match(guidance, /close ids exist: ldo/);
  assert.doesNotMatch(guidance, /not analyzed/);
});

test("searchTokens: genuinely-absent token → COMPLETE 'not analyzed', no loop", () => {
  const { matches, guidance } = searchTokens(ROWS, "bitcoin");
  assert.equal(matches.length, 0);
  assert.match(guidance, /Complete result/);
  assert.match(guidance, /not analyzed/);
  assert.match(guidance, /Do not keep searching variants/);
  assert.match(guidance, /aave, ldo, aero/); // lists coverage
});

// --------------------------------------------------------------------------
test("tokenNotFoundGuidance: typo → 'did you mean' (correctable)", () => {
  const g = tokenNotFoundGuidance("lido", ids);
  assert.match(g, /did you mean: ldo/i);
  assert.match(g, /Retry once/);
});

test("tokenNotFoundGuidance: uncovered token → COMPLETE 'not in the dataset'", () => {
  const g = tokenNotFoundGuidance("bitcoin", ids);
  assert.match(g, /not among the 3 covered tokens/);
  assert.match(g, /not in the dataset/);
  assert.match(g, /do not retry with variants/);
});
