import { describe, expect, it } from "vitest";
import { PRIME } from "./field";
import { splitSecret } from "./shamir";

describe("secret splitting", () => {
  it("creates the requested number of shares", () => {
    expect(splitSecret(42n, 3, 5)).toHaveLength(5);
  });

  it("gives every share a different x-coordinate", () => {
    const shares = splitSecret(42n, 3, 5);

    expect(new Set(shares.map((share) => share.x)).size).toBe(5);
  });

  it("keeps share values inside the field", () => {
    const shares = splitSecret(42n, 3, 5);

    for (const share of shares) {
      expect(share.x).toBeGreaterThan(0n);
      expect(share.y).toBeGreaterThanOrEqual(0n);
      expect(share.y).toBeLessThan(PRIME);
    }
  });

  it("works when the secret is zero", () => {
    expect(splitSecret(0n, 2, 3)).toHaveLength(3);
  });

  it("works with a threshold of one", () => {
    const shares = splitSecret(42n, 1, 3);

    expect(shares.every((share) => share.y === 42n)).toBe(true);
  });

  it("rejects secrets outside the field", () => {
    expect(() => splitSecret(-1n, 2, 3)).toThrow(RangeError);
    expect(() => splitSecret(PRIME, 2, 3)).toThrow(RangeError);
  });

  it("rejects invalid thresholds", () => {
    expect(() => splitSecret(42n, 0, 3)).toThrow(RangeError);
    expect(() => splitSecret(42n, 4, 3)).toThrow(RangeError);
    expect(() => splitSecret(42n, -1, 3)).toThrow(RangeError);
  });

  it("rejects invalid share counts", () => {
    expect(() => splitSecret(42n, 1, 0)).toThrow(RangeError);
    expect(() => splitSecret(42n, 1, -1)).toThrow(RangeError);
    expect(() => splitSecret(42n, 1, 257)).toThrow(RangeError);
  });

  it("rejects non-integer inputs", () => {
    expect(() => splitSecret(42n, 1.5, 3)).toThrow(RangeError);
    expect(() => splitSecret(42n, 2, 3.5)).toThrow(RangeError);
  });

  it("allows the largest valid share count", () => {
    expect(splitSecret(42n, 1, 256)).toHaveLength(256);
  });
});