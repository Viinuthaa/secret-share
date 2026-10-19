import { describe, expect, it } from "vitest";
import { PRIME } from "./field";
import { splitSecret } from "./shamir";
import { reconstructSecret } from "./reconstruct";

describe("secret reconstruction", () => {
  it("recovers the original secret", () => {
    const shares = splitSecret(42n, 3, 5);
    expect(reconstructSecret(shares, 3)).toBe(42n);
  });

  it("works with different shares", () => {
    const shares = splitSecret(123n, 3, 5);

    expect(reconstructSecret(shares.slice(0, 3), 3)).toBe(123n);
    expect(reconstructSecret(shares.slice(2, 5), 3)).toBe(123n);
  });

  it("works when the secret is zero", () => {
    const shares = splitSecret(0n, 2, 4);
    expect(reconstructSecret(shares, 2)).toBe(0n);
  });

  it("works with one required share", () => {
    const shares = splitSecret(75n, 1, 3);
    expect(reconstructSecret(shares, 1)).toBe(75n);
  });

  it("rejects too few shares", () => {
    const shares = splitSecret(42n, 3, 5);

    expect(() => reconstructSecret(shares.slice(0, 2), 3)).toThrow(
      "Not enough shares",
    );
  });

  it("rejects duplicate coordinates", () => {
    const shares = splitSecret(42n, 2, 3);

    expect(() => reconstructSecret([shares[0], shares[0]], 2)).toThrow(
      "Duplicate share coordinates",
    );
  });

  it("rejects invalid share values", () => {
    expect(() =>
      reconstructSecret([{ x: 0n, y: 42n }], 1),
    ).toThrow("Invalid share values");
  });

  it("rejects an invalid threshold", () => {
    const shares = splitSecret(42n, 2, 3);

    expect(() => reconstructSecret(shares, 0)).toThrow(RangeError);
    expect(() => reconstructSecret(shares, 257)).toThrow(RangeError);
  });

  it("rejects invalid shares even when they are beyond the threshold", () => {
    const shares = splitSecret(42n, 2, 3);
    const invalidShares = [
      ...shares.slice(0, 2),
      { x: 4n, y: PRIME },
    ];

    expect(() => reconstructSecret(invalidShares, 2)).toThrow(
      "Invalid share values",
    );
  });

  it("rejects duplicate coordinates beyond the threshold", () => {
    const shares = splitSecret(42n, 2, 3);

    expect(() =>
      reconstructSecret([shares[0], shares[1], shares[0]], 2),
    ).toThrow("Duplicate share coordinates");
  });
});