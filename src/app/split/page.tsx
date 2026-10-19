
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

  function generate() {
    setError("");
    setShares([]);
    setCoefficients([]);

    try {
      if (!/^\d+$/.test(secret)) {
        throw new Error("Enter a whole number between 0 and 256.");
      }

      if (!/^\d+$/.test(shareCount) || !/^\d+$/.test(threshold)) {
        throw new Error("Enter valid numbers for both fields.");
      }

      const result = generateShares(
        BigInt(secret),
        Number(threshold),
        Number(shareCount),
      );

      setShares(result.shares);
      setCoefficients(result.coefficients);
      setGeneratedThreshold(Number(threshold));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not generate shares.",
      );
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
  }

  const maxX = Math.max(shares.length, 1);

  const curve = Array.from({ length: shares.length + 1 }, (_, x) => {
    const y = Number(evaluatePolynomial(coefficients, BigInt(x)));
    return `${chart.left + (x / maxX) * chart.width},${chart.bottom - (y / 256) * chart.height}`;
  }).join(" ");

  return (
    <main className="min-h-screen bg-[#F3F0E6] text-[#252522]">
      <header className="border-b border-[#252522]/20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            secret<span className="text-[#702632]">/</span>share
          </Link>

          <div className="flex gap-5 text-xs uppercase tracking-[0.16em] text-[#702632]">
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

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
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

        <div className="mt-10 border border-[#252522]/20 bg-[#E9E5D9] p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-2 block">Secret (0–256)</span>
              <input
                type="number"
                min="0"
                max="256"
                step="1"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
                className="w-full border border-[#252522]/30 bg-[#F3F0E6] px-3 py-3 outline-none focus:border-[#702632]"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 block">Number of shares</span>
              <input
                type="number"
                min="1"
                max="256"
                step="1"
                value={shareCount}
                onChange={(event) => setShareCount(event.target.value)}
                className="w-full border border-[#252522]/30 bg-[#F3F0E6] px-3 py-3 outline-none focus:border-[#702632]"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 block">Required to recover</span>
              <input
                type="number"
                min="1"
                max="256"
                step="1"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
                className="w-full border border-[#252522]/30 bg-[#F3F0E6] px-3 py-3 outline-none focus:border-[#702632]"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={generate}
            className="mt-7 bg-[#702632] px-6 py-3 text-sm text-[#F3F0E6] transition hover:bg-[#54202A]"
          >
            Generate shares <span className="ml-2">↗</span>
          </button>

          {error && (
            <p role="alert" className="mt-4 text-sm text-[#702632]">
              {error}
            </p>
          )}
        </div>

        {shares.length > 0 && (
          <>
            <section className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#702632]">
                    Polynomial visualizer
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    See how the shares connect.
                  </h2>
                </div>

                <p className="text-xs text-[#626158]">
                  Degree {generatedThreshold - 1} polynomial
                </p>
              </div>

              <div className="mt-6 border border-[#252522]/20 bg-[#E9E5D9] p-3 sm:p-6">
                <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#626158]">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#702632]" />
                    Secret at x = 0
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#788B45]" />
                    Generated shares
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-0.5 w-5 bg-[#702632]" />
                    Polynomial values
                  </span>
                </div>

                <svg
                  viewBox="0 0 720 320"
                  role="img"
                  aria-label="Polynomial values and generated share points in the finite field"
                  className="w-full"
                >
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
                      chart.left +
                      (Number(share.x) / maxX) * chart.width;
                    const y =
                      chart.bottom -
                      (Number(share.y) / 256) * chart.height;

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
                    cy={
                      chart.bottom -
                      (Number(shares.length > 0 ? coefficients[0] : 0n) /
                        256) *
                        chart.height
                    }
                    r="6"
                    fill="#702632"
                    stroke="#F3F0E6"
                    strokeWidth="2"
                  />

                  <text
                    x={chart.left + 10}
                    y={
                      chart.bottom -
                      (Number(coefficients[0]) / 256) * chart.height -
                      12
                    }
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
                  <p className="mt-2 font-serif text-2xl">
                    {generatedThreshold}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[#626158]">
                A threshold of {generatedThreshold} uses a polynomial of degree{" "}
                {generatedThreshold - 1}. The secret is its constant term,
                which is the value at x = 0. Each generated share is a point
                calculated from the same polynomial.
              </p>
            </section>

            <section className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#702632]">
                    Generated shares
                  </p>
                  <h2 className="mt-2 font-serif text-2xl">
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
                    className="flex flex-wrap items-center justify-between gap-4 bg-[#E9E5D9] px-5 py-4"
                  >
                    <span className="text-sm font-medium">
                      Share {share.x.toString()}
                    </span>

                    <code className="text-sm">
                      ({share.x.toString()}, {share.y.toString()})
                    </code>

                    <button
                      type="button"
                      onClick={() =>
                        void navigator.clipboard.writeText(
                          `${share.x.toString()},${share.y.toString()}`,
                        )
                      }
                      className="text-xs text-[#702632] hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={downloadShares}
                className="mt-6 border border-[#702632] px-6 py-3 text-sm text-[#702632] transition hover:bg-[#702632] hover:text-[#F3F0E6]"
              >
                Download shares (.txt) ↓
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
