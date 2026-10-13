export const PRIME = 257n;

export function mod(value: bigint): bigint {
  return ((value % PRIME) + PRIME) % PRIME;
}

export function add(a: bigint, b: bigint): bigint {
  return mod(a + b);
}

export function subtract(a: bigint, b: bigint): bigint {
  return mod(a - b);
}

export function multiply(a: bigint, b: bigint): bigint {
  return mod(a * b);
}

export function power(base: bigint, exponent: bigint): bigint {
  if (exponent < 0n) {
    throw new RangeError("Exponent must be non-negative");
  }

  let result = 1n;
  let current = mod(base);
  let remaining = exponent;

  while (remaining > 0n) {
    if (remaining % 2n === 1n) {
      result = multiply(result, current);
    }

    current = multiply(current, current);
    remaining /= 2n;
  }

  return result;
}

export function inverse(value: bigint): bigint {
  const n = mod(value);

  if (n === 0n) {
    throw new RangeError("Cannot invert zero");
  }

  let oldR = n;
  let r = PRIME;
  let oldS = 1n;
  let s = 0n;

  while (r !== 0n) {
    const quotient = oldR / r;

    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  return mod(oldS);
}

export function divide(a: bigint, b: bigint): bigint {
  return multiply(a, inverse(b));
}