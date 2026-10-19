
import { PRIME } from "./field";
import type { Share } from "./shamir";

export type ImportedShareFile = {
  threshold: number;
  shares: Share[];
};

const MAX_FILE_LENGTH = 100_000;
const MAX_SHARES = Number(PRIME) - 1;

export function parseShareFile(content: string): ImportedShareFile {
  if (content.length > MAX_FILE_LENGTH) {
    throw new RangeError("The file is too large to import.");
  }

  const thresholdMatches = [
    ...content.matchAll(/^Threshold:\s*(\d+)\s*$/gim),
  ];

  if (thresholdMatches.length !== 1) {
    throw new Error("The file must contain exactly one threshold.");
  }

  const thresholdText = thresholdMatches[0][1];

  if (thresholdText.length > 3) {
    throw new Error("The file contains an invalid threshold.");
  }

  const threshold = Number(thresholdText);

  if (
    !Number.isInteger(threshold) ||
    threshold < 2 ||
    threshold >= Number(PRIME)
  ) {
    throw new RangeError("The file contains an invalid threshold.");
  }

  const lines = content.split(/\r?\n/);
  const shareLines = lines.filter((line) => /^\s*Share\b/i.test(line));

  if (shareLines.length === 0) {
    throw new Error("This file does not contain any supported shares.");
  }

  if (shareLines.length > MAX_SHARES) {
    throw new RangeError("The file contains too many shares.");
  }

  const shares: Share[] = [];
  const seenCoordinates = new Set<string>();

  for (const line of shareLines) {
    const match = line.match(
      /^\s*Share\s+\d+:\s*(\d+)\s*,\s*(\d+)\s*$/i,
    );

    if (!match) {
      throw new Error("The file contains a malformed share line.");
    }

    const xText = match[1];
    const yText = match[2];

    if (xText.length > 3 || yText.length > 3) {
      throw new RangeError("The file contains invalid share coordinates.");
    }

    const x = BigInt(xText);
    const y = BigInt(yText);

    if (x < 1n || x >= PRIME || y < 0n || y >= PRIME) {
      throw new RangeError("The file contains invalid share coordinates.");
    }

    if (seenCoordinates.has(x.toString())) {
      throw new Error("The file contains duplicate share coordinates.");
    }

    seenCoordinates.add(x.toString());
    shares.push({ x, y });
  }

  if (shares.length < threshold) {
    throw new Error("The file contains fewer shares than its threshold.");
  }

  return { threshold, shares };
}
