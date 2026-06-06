/**
 * OTF data contract — VENDORED COPY.
 *
 * Source of truth: https://github.com/aragon/otf-cms (schemas/). Do not edit
 * here; change in otf-cms and re-vendor. A CI drift check pins the two
 * (plan task T-SCHEMA-DRIFT).
 *
 * Write-model schemas describe otf-cms content/ atoms; read-model schemas
 * describe the composed docs this app serves (src/data/generated/, later
 * Blob/Edge Config). This module must not import app code.
 */
export * from "./atoms"
export * from "./common"
export * from "./read-models"
