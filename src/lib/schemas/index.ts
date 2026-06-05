/**
 * OTF data contract — Zod schemas for the write model (content/ atoms) and
 * the read models (src/data/generated/ composed docs).
 *
 * This module must not import app code: it is designed to extract cleanly
 * into a shared package if content moves to a separate repo (otf-cms).
 */
export * from "./atoms"
export * from "./common"
export * from "./read-models"
