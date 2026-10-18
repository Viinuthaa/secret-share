
import { PRIME } from "./field";

export type Share = {
  x: bigint;
  y: bigint;
};

function randomFieldElement(): bigint {
  const range = 65536;
  const prime = Number(PRIME);
  const limit = Math.floor(range / prime) * prime;
  const values = new Uint16Array(1);

  while (true) {
    crypto.getRandomValues(values);

    if (values[0] < limit) {
      return BigInt(values[0] % prime);
    }
  }
}

export function splitSecret(
  secret: bigint,
  threshold: number,
  totalShares: number,
): Share[] {
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
    let y = 0n;
    let power = 1n;

    for (const coefficient of coefficients) {
      y = (y + coefficient * power) % PRIME;
      power = (power * BigInt(x)) % PRIME;
    }

    shares.push({ x: BigInt(x), y });
  }

  return shares;
}
