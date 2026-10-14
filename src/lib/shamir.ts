import { PRIME, add, multiply, mod } from "./field";

export type Share = {
  x: bigint;
  y: bigint;
};

function randomFieldElement(): bigint {
  const values = new Uint16Array(1);

  while (true) {
    globalThis.crypto.getRandomValues(values);

    if (values[0] < 65535) {
      return BigInt(values[0] % Number(PRIME));
    }
  }
}

function evaluatePolynomial(coefficients: bigint[], x: bigint): bigint {
  let result = 0n;

  for (let i = coefficients.length - 1; i >= 0; i--) {
    result = add(multiply(result, x), coefficients[i]);
  }

  return mod(result);
}

export function splitSecret(
  secret: bigint,
  threshold: number,
  shareCount: number,
): Share[] {
  if (secret < 0n || secret >= PRIME) {
    throw new RangeError("Secret is outside the field");
  }

  if (!Number.isInteger(threshold) || !Number.isInteger(shareCount)) {
    throw new RangeError("Threshold and share count must be integers");
  }

  if (threshold < 1 || threshold > shareCount) {
    throw new RangeError("Invalid threshold");
  }

  if (shareCount >= Number(PRIME)) {
    throw new RangeError("Too many shares");
  }

  const coefficients = [secret];

  for (let i = 1; i < threshold; i++) {
    coefficients.push(randomFieldElement());
  }

  return Array.from({ length: shareCount }, (_, index) => {
    const x = BigInt(index + 1);

    return {
      x,
      y: evaluatePolynomial(coefficients, x),
    };
  });
}