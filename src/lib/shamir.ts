import { PRIME, add, multiply, mod } from "./field";

export type Share = {
  x: bigint;
  y: bigint;
};

function randomFieldElement(): bigint {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues) {
    throw new Error("Secure random number generation is unavailable");
  }

  const values = new Uint16Array(1);

  while (true) {
    cryptoApi.getRandomValues(values);

    // Reject the extra value so each field element is equally likely.
    if (values[0] < 65535) {
      return BigInt(values[0] % Number(PRIME));
    }
  }
}

function evaluatePolynomial(
  coefficients: bigint[],
  x: bigint,
): bigint {
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
    throw new RangeError(`Secret must be between 0 and ${PRIME - 1n}`);
  }

  if (!Number.isInteger(threshold) || !Number.isInteger(shareCount)) {
    throw new RangeError("Threshold and share count must be integers");
  }

  if (threshold < 1 || threshold > shareCount) {
    throw new RangeError(
      "Threshold must be between 1 and the share count",
    );
  }

  if (shareCount >= Number(PRIME)) {
    throw new RangeError(
      `Share count must not exceed ${PRIME - 1n}`,
    );
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