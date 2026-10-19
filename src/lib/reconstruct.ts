import { PRIME, add, subtract, multiply, divide } from "./field";
import type { Share } from "./shamir";

export function reconstructSecret(
  shares: Share[],
  threshold: number,
): bigint {
  if (
    !Number.isInteger(threshold) ||
    threshold < 1 ||
    threshold >= Number(PRIME)
  ) {
    throw new RangeError("Invalid threshold");
  }

  if (shares.length < threshold) {
    throw new RangeError("Not enough shares");
  }

  if (shares.length >= Number(PRIME)) {
    throw new RangeError("Too many shares");
  }

  const seenCoordinates = new Set<string>();

  for (const share of shares) {
    if (
      share.x <= 0n ||
      share.x >= PRIME ||
      share.y < 0n ||
      share.y >= PRIME
    ) {
      throw new RangeError("Invalid share values");
    }

    const coordinate = share.x.toString();

    if (seenCoordinates.has(coordinate)) {
      throw new RangeError("Duplicate share coordinates");
    }

    seenCoordinates.add(coordinate);
  }

  const selected = shares.slice(0, threshold);
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