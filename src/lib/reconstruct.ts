import { PRIME, add, subtract, multiply, divide } from "./field";
import type { Share } from "./shamir";

export function reconstructSecret(
  shares: Share[],
  threshold: number,
): bigint {
  if (!Number.isInteger(threshold) || threshold < 1) {
    throw new RangeError("Invalid threshold");
  }

  if (shares.length < threshold) {
    throw new RangeError("Not enough shares");
  }

  const selected = shares.slice(0, threshold);

  for (const share of selected) {
    if (
      share.x <= 0n ||
      share.x >= PRIME ||
      share.y < 0n ||
      share.y >= PRIME
    ) {
      throw new RangeError("Invalid share values");
    }
  }

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      if (selected[i].x === selected[j].x) {
        throw new RangeError("Duplicate share coordinates");
      }
    }
  }

  let secret = 0n;

  for (let i = 0; i < selected.length; i++) {
    let numerator = 1n;
    let denominator = 1n;

    for (let j = 0; j < selected.length; j++) {
      if (i === j) continue;

      numerator = multiply(
        numerator,
        subtract(0n, selected[j].x),
      );

      denominator = multiply(
        denominator,
        subtract(selected[i].x, selected[j].x),
      );
    }

    secret = add(
      secret,
      multiply(
        selected[i].y,
        divide(numerator, denominator),
      ),
    );
  }

  return secret;
}