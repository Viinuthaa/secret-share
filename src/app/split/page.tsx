
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  evaluatePolynomial,
  generateShares,
  type Share,
} from "@/lib/shamir";

const chart = {
  left: 48,
  right: 680,
  top: 24,
  bottom: 270,
  width: 632,
  height: 246,
};

export default function SplitPage() {
  const [secret, setSecret] = useState("42");
  const [shareCount, setShareCount] = useState("5");
  const [threshold, setThreshold] = useState("3");
  const [shares, setShares] = useState<Share[]>([]);
  const [coefficients, setCoefficients] = useState<bigint[]>([]);
  const [generatedThreshold, setGeneratedThreshold] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function generate() {
    setError("");
    setStatus("");
    setShares([]);
    setCoefficients([]);

    try {
      if (!/^\d+$/.test(secret)) {
        throw new Error("Enter a whole number between 0 and 256.");
      }

      if (!/^\d+$/.test(shareCount) || !/^\d+$/.test(threshold)) {
        throw new Error("Enter valid numbers for both share fields.");
      }

      const result = generateShares(
        BigInt(secret),
        Number(threshold),
        Number(shareCount),
      );

      setShares(result.shares);
      setCoefficients(result.coefficients);
      setGeneratedThreshold(Number(threshold));
      setStatus(`${result.shares.length} shares generated successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not generate shares.",
      );
    }
  }

  async function copyShare(share: Share) {
    try {
      await navigator.clipboard.writeText(
        `${share.x.toString()},${share.y.toString()}`,
      );
      setStatus(`Share ${share.x.toString()} copied to clipboard.`);
      setError("");
    } catch {
      setError(
        "Could not copy this share. Select and copy its coordinate manually.",
      );
      setStatus("");
    }
  }

  function downloadShares() {
    if (shares.length === 0) return;

    const content = [
      "Secret Share - Generated Shares",
      `Threshold: ${generatedThreshold}`,
      `Total shares: ${shares.length}`,
      "Secret range: 0-256",
      "",
      "Keep these shares private.",
      "",
      ...shares.map(
        (share, index) =>
          `Share ${index + 1}: ${share.x.toString()},${share.y.toString()}`,
      ),
      "",
      "Educational demo using GF(257). Not suitable for protecting real secrets.",
    ].join("\n");

    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "secret-share.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Your share file download has started.");
  }

  const maxX = Math.max(shares.length, 1);

  const curve = Array.from({ length: shares.length + 1 }, (_, x) => {
    const y = Number(evaluatePolynomial(coefficients, BigInt(x)));
    return `${chart.left + (x / maxX) * chart.width},${chart.bottom - (y / 256) * chart.height}`;
  }).join(" ");

  return (
    <main className="min-h-screen bg-[#F3F0E6] text-[#252522]">
      <header className="border-b border-[#252522]/20">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"
        >
          <Link href="/" className="text-xl font-bold tracking-tight">
            secret<span className="text-[#702632]">/</span>share
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs uppercase tracking-[0.16em] text-[#702632]">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/recover" className="hover:underline">
              Recover
            </Link>
            <Link href="/learn" className="hover:underline">
              How it works
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-[#702632]">
          Cryptography / Project 001
        </p>

        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          Split a secret.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#626158]">
          Choose a number, decide how many shares to create, and set how many
          are needed to recover it.
        </p>

        <form
          className="mt-10 border border-[#252522]/20 bg-[#E9E5D9] p-5 sm:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            generate();
          }}
          aria-describedby="split-help"
        >
          <p id="split-help" className="mb-6 text-sm leading-6 text-[#626158]">
            Use whole numbers only. The secret must be between 0 and 256, and
            the threshold cannot exceed the total number of shares.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            <label className="block text-sm" htmlFor="secret-value">
              <span className="mb-2 block">Secret (0-256)</span>
              <input
                id="secret-value"
                name="secret"
                type="number"
                min="0"
                max="256"
                step="1"
                required
                inputMode="numeric"
                value={secret}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "split-error" : "split-help"}
                onChange={(event) => {
                  setSecret(event.target.value);
                  setError("");
                  setStatus("");
                }}
                className="w-full border border-[#252522]/30 bg-[#F3F0E6] px-3 py-3 focus-visible:border-[#702632]"
              />
            </label>

            <label className="block text-sm" htmlFor="share-count">
              <span className="mb-2 block">Number of shares</span>
              <input
                id="share-count"
                name="shareCount"
                type="number"
                min="1"
                max="256"
                step="1"
                required
                inputMode="numeric"
                value={shareCount}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "split-error" : "split-help"}
                onChange={(event) => {
                  setShareCount(event.target.value);
                  setError("");
                  setStatus("");
                }}
                className="w-full border border-[#252522]/30 bg-[#F3F0E6] px-3 py-3 focus-visible:border-[#702632]"
              />
            </label>

            <label className="block text-sm" htmlFor="share-threshold">
              <span className="mb-2 block">Required to recover</span>
              <input
                id="share-threshold"
                name="threshold"
                type="number"
                min="1"
                max="256"
                step="1"
                required
                inputMode="numeric"
                value={threshold}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "split-error" : "split-help"}
                onChange={(event) => {
                  setThreshold(event.target.value);
                  setError("");
                  setStatus("");
                }}
                className="w-full border border-[#252522]/30 bg-[#F3F0E6] px-3 py-3 focus-visible:border-[#702632]"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-7 min-h-11 bg-[#702632] px-6 py-3 text-sm text-[#F3F0E6] transition hover:bg-[#54202A]"
          >
            Generate shares <span aria-hidden="true" className="ml-2">↗</span>
          </button>

          <p
            id="split-error"
            role="alert"
            aria-live="assertive"
            className={error ? "mt-4 text-sm text-[#702632]" : "sr-only"}
          >
            {error}
          </p>

          <p role="status" aria-live="polite" className="mt-3 text-sm text-[#626158]">
            {status}
          </p>
        </form>

        {shares.length > 0 && (
          <>
            <section className="mt-12" aria-labelledby="visualizer-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#702632]">
                    Polynomial visualizer
                  </p>
                  <h2 id="visualizer-heading" className="mt-2 font-serif text-3xl">
                    See how the shares connect.
                  </h2>
                </div>

                <p className="text-xs text-[#626158]">
                  Degree {generatedThreshold - 1} polynomial
                </p>
              </div>

              <div className="mt-6 border border-[#252522]/20 bg-[#E9E5D9] p-3 sm:p-6">
                <div
                  aria-label="Chart legend"
                  className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#626158]"
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#702632]" />
                    Secret at x = 0
                  </span>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#788B45]" />
                    Generated shares
                  </span>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-0.5 w-5 bg-[#702632]" />
                    Polynomial values
                  </span>
                </div>

                <svg
                  viewBox="0 0 720 320"
                  role="img"
                  aria-labelledby="polynomial-title polynomial-description"
                  className="block h-auto w-full"
                >
                  <title id="polynomial-title">Polynomial and generated shares</title>
                  <desc id="polynomial-description">
                    The chart shows the polynomial values modulo 257 and the
                    generated share coordinates. The secret is the value at x
                    equals zero. Exact share coordinates are listed below.
                  </desc>

                  {[0, 64, 128, 192, 256].map((value) => {
                    const y = chart.bottom - (value / 256) * chart.height;

                    return (
                      <g key={value}>
                        <line
                          x1={chart.left}
                          y1={y}
                          x2={chart.right}
                          y2={y}
                          stroke="#252522"
                          strokeOpacity="0.12"
                          strokeDasharray="4 5"
                        />
                        <text
                          x={chart.left - 10}
                          y={y + 4}
                          textAnchor="end"
                          fill="#626158"
                          fontSize="11"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}

                  {Array.from({ length: shares.length + 1 }, (_, x) => {
                    const plotX = chart.left + (x / maxX) * chart.width;

                    return (
                      <g key={x}>
                        <line
                          x1={plotX}
                          y1={chart.top}
                          x2={plotX}
                          y2={chart.bottom}
                          stroke="#252522"
                          strokeOpacity="0.08"
                        />
                        <text
                          x={plotX}
                          y={chart.bottom + 20}
                          textAnchor="middle"
                          fill="#626158"
                          fontSize="11"
                        >
                          {x}
                        </text>
                      </g>
                    );
                  })}

                  <line
                    x1={chart.left}
                    y1={chart.top}
                    x2={chart.left}
                    y2={chart.bottom}
                    stroke="#252522"
                    strokeOpacity="0.5"
                  />
                  <line
                    x1={chart.left}
                    y1={chart.bottom}
                    x2={chart.right}
                    y2={chart.bottom}
                    stroke="#252522"
                    strokeOpacity="0.5"
                  />

                  <polyline
                    points={curve}
                    fill="none"
                    stroke="#702632"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {shares.map((share) => {
                    const x =
                      chart.left + (Number(share.x) / maxX) * chart.width;
                    const y =
                      chart.bottom - (Number(share.y) / 256) * chart.height;

                    return (
                      <g key={share.x.toString()}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#788B45"
                          stroke="#F3F0E6"
                          strokeWidth="2"
                        />
                        <title>
                          Share ({share.x.toString()}, {share.y.toString()})
                        </title>
                      </g>
                    );
                  })}

                  <circle
                    cx={chart.left}
                    cy={chart.bottom - (Number(coefficients[0]) / 256) * chart.height}
                    r="6"
                    fill="#702632"
                    stroke="#F3F0E6"
                    strokeWidth="2"
                  />

                  <text
                    x={chart.left + 10}
                    y={chart.bottom - (Number(coefficients[0]) / 256) * chart.height - 12}
                    fill="#702632"
                    fontSize="12"
                    fontWeight="600"
                  >
                    Secret: {coefficients[0].toString()}
                  </text>

                  <text
                    x="360"
                    y="312"
                    textAnchor="middle"
                    fill="#626158"
                    fontSize="12"
                  >
                    Share coordinate x
                  </text>
                </svg>

                <p className="mt-3 text-xs leading-6 text-[#626158]">
                  The plotted values are calculated modulo 257. Connecting
                  lines are a visual guide between discrete field values, not
                  continuous finite-field arithmetic.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="border border-[#252522]/20 p-4">
                  <p className="text-xs text-[#626158]">Original secret</p>
                  <p className="mt-2 font-serif text-2xl">
                    {coefficients[0].toString()}
                  </p>
                </div>
                <div className="border border-[#252522]/20 p-4">
                  <p className="text-xs text-[#626158]">Shares generated</p>
                  <p className="mt-2 font-serif text-2xl">{shares.length}</p>
                </div>
                <div className="border border-[#252522]/20 p-4">
                  <p className="text-xs text-[#626158]">Needed to recover</p>
                  <p className="mt-2 font-serif text-2xl">{generatedThreshold}</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[#626158]">
                A threshold of {generatedThreshold} uses a polynomial of degree{" "}
                {generatedThreshold - 1}. The secret is its constant term, which
                is the value at x = 0. Each generated share is a point calculated
                from the same polynomial.
              </p>
            </section>

            <section className="mt-14" aria-labelledby="shares-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#702632]">
                    Generated shares
                  </p>
                  <h2 id="shares-heading" className="mt-2 font-serif text-2xl">
                    {shares.length} separate pieces
                  </h2>
                </div>
                <p className="text-xs text-[#626158]">
                  {generatedThreshold} required for recovery
                </p>
              </div>

              <div className="mt-5 divide-y divide-[#252522]/15 border border-[#252522]/20">
                {shares.map((share) => (
                  <div
                    key={share.x.toString()}
                    className="flex flex-wrap items-center justify-between gap-4 bg-[#E9E5D9] px-4 py-4 sm:px-5"
                  >
                    <span className="text-sm font-medium">
                      Share {share.x.toString()}
                    </span>

                    <code className="break-all text-sm">
                      ({share.x.toString()}, {share.y.toString()})
                    </code>

                    <button
                      type="button"
                      onClick={() => void copyShare(share)}
                      aria-label={`Copy share ${share.x.toString()}`}
                      className="min-h-10 text-sm text-[#702632] underline underline-offset-4 hover:text-[#54202A]"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={downloadShares}
                className="mt-6 min-h-11 border border-[#702632] px-6 py-3 text-sm text-[#702632] transition hover:bg-[#702632] hover:text-[#F3F0E6]"
              >
                Download shares (.txt) <span aria-hidden="true">↓</span>
              </button>

              <p className="mt-4 text-xs leading-5 text-[#626158]">
                Keep downloaded shares private. This learning demo uses GF(257)
                and is not suitable for protecting real secrets.
              </p>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
