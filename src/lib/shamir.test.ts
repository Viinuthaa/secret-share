import { describe, expect, it } from "vitest";
import { PRIME } from "./field";
import { splitSecret } from "./shamir";

describe("Shamir secret splitting", () => {
  it("generates the requested number of shares", () => {
    const shares = splitSecret(42n, 3, 5);

    expect(shares).toHaveLength(5);
  });

  it("assigns each share a unique x-coordinate", () => {
    const shares = splitSecret(42n, 3, 5);
    const coordinates = shares.map((share) => share.x);

    expect(new Set(coordinates).size).toBe(5);
  });

  it("keeps share values within the finite field", () => {
    const shares = splitSecret(42n, 3, 5);

    for (const share of shares) {
      expect(share.x).toBeGreaterThan(0n);
      expect(share.y).toBeGreaterThanOrEqual(0n);
      expect(share.y).toBeLessThan(PRIME);
    }
  });

  it("produces shares equal to the secret for threshold one", () => {
    const shares = splitSecret(42n, 1, 4);

    expect(shares).toHaveLength(4);

    for (const share of shares) {
      expect(share.y).toBe(42n);
    }
  });

  it("supports a secret equal to zero", () => {
    const shares = splitSecret(0n, 2, 3);

    expect(shares).toHaveLength(3);
  });

  it("rejects secrets outside the field", () => {
    expect(() => splitSecret(-1n, 2, 3)).toThrow(RangeError);
    expect(() => splitSecret(PRIME, 2, 3)).toThrow(RangeError);
  });

  it("rejects invalid thresholds", () => {
    expect(() => splitSecret(42n, 0, 3)).toThrow(RangeError);
    expect(() => splitSecret(42n, 4, 3)).toThrow(RangeError);
  });

  it("rejects invalid share counts", () => {
    expect(() => splitSecret(42n, 1, 0)).toThrow(RangeError);
    expect(() => splitSecret(42n, 1, 257)).toThrow(RangeError);
  });

  it("rejects non-integer thresholds and share counts", () => {
    expect(() => splitSecret(42n, 1.5, 3)).toThrow(RangeError);
    expect(() => splitSecret(42n, 2, 3.5)).toThrow(RangeError);
  });
});