import { PRIME, mod } from "./field";

export type Share = {
  x: bigint;
  y: bigint;
};

export type GeneratedShares = {
  shares: Share[];
  coefficients: bigint[];
};

function randomFieldElement(): bigint {
  if (
    typeof globalThis.crypto === "undefined" ||
    typeof globalThis.crypto.getRandomValues !== "function"
  ) {
    throw new Error(
      "Secure randomness is unavailable. Use a supported browser with HTTPS or localhost.",
    );
  }

  const range = 65536;
  const prime = Number(PRIME);
  const limit = Math.floor(range / prime) * prime;
  const values = new Uint16Array(1);

  while (true) {
    globalThis.crypto.getRandomValues(values);

    if (values[0] < limit) {
      return BigInt(values[0] % prime);
    }
  }
}

export function evaluatePolynomial(
  coefficients: bigint[],
  x: bigint,
): bigint {
  let result = 0n;

  for (let i = coefficients.length - 1; i >= 0; i--) {
    result = mod(result * x + coefficients[i]);
  }

  return result;
}

export function generateShares(
  secret: bigint,
  threshold: number,
  totalShares: number,
): GeneratedShares {
  if (secret < 0n || secret >= PRIME) {
    throw new RangeError(`Secret must be between 0 and ${PRIME - 1n}.`);
  }

  if (
    !Number.isInteger(threshold) ||
    !Number.isInteger(totalShares) ||
    threshold < 1 ||
    totalShares < threshold ||
    totalShares >= Number(PRIME)
  ) {
    throw new RangeError("Invalid threshold or number of shares.");
  }

  const coefficients = [secret];

  for (let i = 1; i < threshold; i++) {
    coefficients.push(randomFieldElement());
  }

  const shares: Share[] = [];

  for (let x = 1; x <= totalShares; x++) {
    shares.push({
      x: BigInt(x),
      y: evaluatePolynomial(coefficients, BigInt(x)),
    });
  }

  return { shares, coefficients };
}

export function splitSecret(
  secret: bigint,
  threshold: number,
  totalShares: number,
): Share[] {
  return generateShares(secret, threshold, totalShares).shares;
}