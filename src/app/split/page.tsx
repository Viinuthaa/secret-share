
"use client";

import { useState } from "react";
import Link from "next/link";
import { splitSecret, type Share } from "@/lib/shamir";

export default function SplitPage() {
  const [secret, setSecret] = useState("42");
  const [shareCount, setShareCount] = useState("5");
  const [threshold, setThreshold] = useState("3");
  const [shares, setShares] = useState<Share[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generateShares() {
    setError("");
    setShares([]);
    setCopied(false);

    try {
      if (!/^\d+$/.test(secret)) {
        throw new Error("Enter a whole number between 0 and 256.");
      }

      if (!/^\d+$/.test(shareCount) || !/^\d+$/.test(threshold)) {
        throw new Error("Enter valid numbers for both fields.");
      }

      const value = BigInt(secret);
      const count = Number(shareCount);
      const required = Number(threshold);

      const generated = splitSecret(value, required, count);
      setShares(generated);
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
      `Threshold: ${threshold}`,
      `Total shares: ${shares.length}`,
      `Secret range: 0-256`,
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
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
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
            onClick={generateShares}
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
          <section className="mt-10">
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
                {threshold} required for recovery
              </p>
            </div>

            <div className="mt-5 divide-y divide-[#252522]/15 border border-[#252522]/20">
              {shares.map((share) => (
                <div
                  key={share.x.toString()}
                  className="flex items-center justify-between gap-4 bg-[#E9E5D9] px-5 py-4"
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
        )}
      </section>
    </main>
  );
}
