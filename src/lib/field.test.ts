
import { describe, expect, it } from "vitest";
import {
  PRIME,
  add,
  divide,
  inverse,
  mod,
  multiply,
  power,
  subtract,
} from "./field";

describe("field arithmetic", () => {
  it("handles negative values", () => {
    expect(mod(-1n)).toBe(256n);
    expect(mod(-258n)).toBe(256n);
  });

  it("adds values modulo the prime", () => {
    expect(add(250n, 10n)).toBe(3n);
    expect(add(4n, 5n)).toBe(9n);
  });

  it("subtracts values modulo the prime", () => {
    expect(subtract(3n, 5n)).toBe(255n);
    expect(subtract(10n, 4n)).toBe(6n);
  });

  it("multiplies values modulo the prime", () => {
    expect(multiply(20n, 15n)).toBe(43n);
    expect(multiply(2n, 3n)).toBe(6n);
  });

  it("calculates powers", () => {
    expect(power(2n, 0n)).toBe(1n);
    expect(power(2n, 3n)).toBe(8n);
    expect(power(2n, 8n)).toBe(256n);
  });

  it("finds multiplicative inverses", () => {
    for (const value of [1n, 2n, 3n, 17n, 256n]) {
      expect(multiply(value, inverse(value))).toBe(1n);
    }
  });

  it("divides values in the field", () => {
    expect(divide(10n, 2n)).toBe(5n);
    expect(divide(3n, 2n)).toBe(130n);
  });

  it("rejects division by zero", () => {
    expect(() => inverse(0n)).toThrow(RangeError);
    expect(() => divide(5n, 0n)).toThrow(RangeError);
  });

  it("rejects negative exponents", () => {
    expect(() => power(2n, -1n)).toThrow(RangeError);
  });

  it("keeps arithmetic within the field", () => {
    expect(add(256n, 1n)).toBe(0n);
    expect(multiply(256n, 256n)).toBe(1n);
    expect(PRIME).toBe(257n);
  });
});
