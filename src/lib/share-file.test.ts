
import { describe, expect, it } from "vitest";
import { PRIME } from "./field";
import { generateShares } from "./shamir";
import { reconstructSecret } from "./reconstruct";
import { parseShareFile } from "./share-file";

describe("parseShareFile", () => {
  it("imports a valid share file", () => {
    const result = parseShareFile(
      "Threshold: 2\nShare 1: 1, 42\nShare 2: 2, 50",
    );

    expect(result.threshold).toBe(2);
    expect(result.shares).toEqual([
      { x: 1n, y: 42n },
      { x: 2n, y: 50n },
    ]);
  });

  it("rejects files that are too large", () => {
    expect(() => parseShareFile("a".repeat(100_001))).toThrow(
      "too large",
    );
  });

  it("rejects missing thresholds", () => {
    expect(() =>
      parseShareFile("Share 1: 1,42\nShare 2: 2,50"),
    ).toThrow("exactly one threshold");
  });

  it("rejects multiple thresholds", () => {
    expect(() =>
      parseShareFile(
        "Threshold: 2\nThreshold: 3\nShare 1: 1,42\nShare 2: 2,50",
      ),
    ).toThrow("exactly one threshold");
  });

  it("rejects invalid thresholds", () => {
    expect(() =>
      parseShareFile("Threshold: 1\nShare 1: 1,42"),
    ).toThrow("invalid threshold");
  });

  it("rejects thresholds outside the field", () => {
    expect(() =>
      parseShareFile(
        `Threshold: ${Number(PRIME)}\nShare 1: 1,42`,
      ),
    ).toThrow("invalid threshold");
  });

  it("rejects files without supported shares", () => {
    expect(() =>
      parseShareFile("Threshold: 2\nNo share data"),
    ).toThrow("supported shares");
  });

  it("rejects malformed share lines", () => {
    expect(() =>
      parseShareFile(
        "Threshold: 2\nShare 1: abc\nShare 2: 2,42\nShare 3: 3,50",
      ),
    ).toThrow("malformed share line");
  });

  it("rejects coordinates outside the field", () => {
    expect(() =>
      parseShareFile(
        `Threshold: 2\nShare 1: ${Number(PRIME)},42\nShare 2: 2,50`,
      ),
    ).toThrow("invalid share coordinates");
  });

  it("rejects zero x-coordinates", () => {
    expect(() =>
      parseShareFile(
        "Threshold: 2\nShare 1: 0,42\nShare 2: 2,50",
      ),
    ).toThrow("invalid share coordinates");
  });

  it("rejects duplicate x-coordinates", () => {
    expect(() =>
      parseShareFile(
        "Threshold: 2\nShare 1: 1,42\nShare 2: 1,50",
      ),
    ).toThrow("duplicate share coordinates");
  });

  it("rejects fewer shares than the threshold", () => {
    expect(() =>
      parseShareFile("Threshold: 3\nShare 1: 1,42\nShare 2: 2,50"),
    ).toThrow("fewer shares");
  });

  it("rejects too many shares", () => {
    const shares = Array.from(
      { length: Number(PRIME) },
      (_, i) => `Share ${i + 1}: ${i + 1},42`,
    ).join("\n");

    expect(() =>
      parseShareFile(`Threshold: 2\n${shares}`),
    ).toThrow("too many shares");
  });

  it("rejects oversized coordinate values", () => {
    expect(() =>
      parseShareFile(
        "Threshold: 2\nShare 1: 1234,42\nShare 2: 2,50",
      ),
    ).toThrow("invalid share coordinates");
  });

  it("supports splitting, exporting, importing, and reconstruction", () => {
    const secret = 123n;
    const threshold = 3;
    const generated = generateShares(secret, threshold, 5);

    const exported = [
      `Threshold: ${threshold}`,
      ...generated.shares.map(
        (share, index) =>
          `Share ${index + 1}: ${share.x.toString()},${share.y.toString()}`,
      ),
    ].join("\n");

    const imported = parseShareFile(exported);
    const recovered = reconstructSecret(
      imported.shares.slice(0, imported.threshold),
      imported.threshold,
    );

    expect(imported.shares).toHaveLength(5);
    expect(recovered).toBe(secret);
  });
});
