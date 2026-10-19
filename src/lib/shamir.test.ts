import { describe, expect, it } from "vitest";
import { PRIME } from "./field";
import {
  evaluatePolynomial,
  generateShares,
  splitSecret,
} from "./shamir";

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

describe("polynomial visualization", () => {
  it("evaluates the example polynomial correctly", () => {
    const coefficients = [5n, 1n, 2n];

    expect(evaluatePolynomial(coefficients, 0n)).toBe(5n);
    expect(evaluatePolynomial(coefficients, 1n)).toBe(8n);
    expect(evaluatePolynomial(coefficients, 2n)).toBe(15n);
    expect(evaluatePolynomial(coefficients, 3n)).toBe(26n);
  });

  it("keeps polynomial values inside the finite field", () => {
    const result = evaluatePolynomial([256n, 256n, 256n], 256n);

    expect(result).toBeGreaterThanOrEqual(0n);
    expect(result).toBeLessThan(PRIME);
  });

  it("preserves the secret as the constant coefficient", () => {
    const result = generateShares(42n, 3, 5);

    expect(result.coefficients).toHaveLength(3);
    expect(result.coefficients[0]).toBe(42n);
    expect(evaluatePolynomial(result.coefficients, 0n)).toBe(42n);
  });

  it("generates shares that match the polynomial", () => {
    const result = generateShares(42n, 3, 5);

    for (const share of result.shares) {
      expect(
        evaluatePolynomial(result.coefficients, share.x),
      ).toBe(share.y);
    }
  });

  it("returns the same shares through the existing API", () => {
    const result = splitSecret(42n, 3, 5);

    expect(result).toHaveLength(5);
    expect(result.every((share) => share.x > 0n)).toBe(true);
  });
});