"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { reconstructSecret } from "@/lib/reconstruct";
import { parseShareFile } from "@/lib/share-file";
import type { Share } from "@/lib/shamir";

export default function RecoverPage() {
  const [threshold, setThreshold] = useState("3");
  const [shares, setShares] = useState(["", "", ""]);
  const [selected, setSelected] = useState<number[]>([0, 1, 2]);
  const [result, setResult] = useState<bigint | null>(null);
  const [error, setError] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  function updateShare(index: number, value: string) {
    setShares((current) =>
      current.map((share, i) => (i === index ? value : share)),
    );
    setResult(null);
    setError("");
    setImportMessage("");
  }

  function toggleShare(index: number) {
    setSelected((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
    setResult(null);
    setError("");
  }

  function addShare() {
    const index = shares.length;
    setShares((current) => [...current, ""]);
    setSelected((current) => [...current, index]);
  }

  function removeShare(index: number) {
    setShares((current) => current.filter((_, i) => i !== index));
    setSelected((current) =>
      current
        .filter((item) => item !== index)
        .map((item) => (item > index ? item - 1 : item)),
    );
    setResult(null);
    setError("");
  }

  async function importShares(file: File | undefined) {
    setError("");
    setImportMessage("");
    setResult(null);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Please select a .txt file.");
      return;
    }

    if (file.size > 100_000) {
      setError("The file is too large to import.");
      return;
    }

    try {
      const content = await file.text();
      const imported = parseShareFile(content);
      const importedShares = imported.shares.map(
        (share) => `${share.x.toString()},${share.y.toString()}`,
      );

      setThreshold(String(imported.threshold));
      setShares(importedShares);
      setSelected(importedShares.map((_, index) => index));
      setImportMessage(
        `${importedShares.length} shares imported successfully.`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not import this file.",
      );
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function recoverSecret() {
    setResult(null);
    setError("");

    const required = Number(threshold);

    if (
      !threshold.trim() ||
      !Number.isInteger(required) ||
      required < 2 ||
      required > 256
    ) {
      setError("Threshold must be an integer between 2 and 256.");
      return;
    }

    const chosen = shares.filter((_, index) => selected.includes(index));

    if (chosen.length < required) {
      setError(`Select at least ${required} shares to recover the secret.`);
      return;
    }

    const parsed: Share[] = [];

    for (const share of chosen) {
      const match = share.trim().match(/^(\d{1,3})\s*,\s*(\d{1,3})$/);

      if (!match) {
        setError("Each selected share must use x, y format.");
        return;
      }

      const x = BigInt(match[1]);
      const y = BigInt(match[2]);

      if (x < 1n || x > 256n || y < 0n || y > 256n) {
        setError("Share coordinates must be within the valid field range.");
        return;
      }

      if (parsed.some((item) => item.x === x)) {
        setError("Selected shares must have unique x-coordinates.");
        return;
      }

      parsed.push({ x, y });
    }

    try {
      setResult(reconstructSecret(parsed, required));
    } catch {
      setError("Could not recover the secret. Check the selected shares.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F0E6] text-[#28251F]">
      <nav className="flex items-center justify-between border-b border-[#28251F]/15 px-6 py-5 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          secret<span className="text-[#702632]">/</span>share
        </Link>

        <div className="flex gap-5 text-sm">
          <Link href="/split" className="underline underline-offset-4">
            Split a secret
          </Link>
          <Link href="/recover" className="underline underline-offset-4">
            Recover a secret
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#702632]">
          Part 02 / Recovery
        </p>

        <h1 className="max-w-2xl font-serif text-5xl leading-tight tracking-tight md:text-7xl">
          Bring the pieces back together.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-[#28251F]/70">
          Import saved shares or enter them manually. Select the shares you
          want to use for reconstruction.
        </p>

        <div className="mt-10 border border-[#252522]/20 bg-[#E9E5D9] p-6 sm:p-8">
          <h2 className="font-serif text-2xl">Import saved shares</h2>
          <p className="mt-2 text-sm leading-6 text-[#626158]">
            Select a .txt file downloaded from the Split page.
          </p>

          <input
            ref={fileInput}
            type="file"
            accept=".txt,text/plain"
            aria-label="Import saved shares text file"
            onChange={(event) => void importShares(event.target.files?.[0])}
            className="mt-5 block w-full text-sm file:mr-4 file:border-0 file:bg-[#702632] file:px-4 file:py-3 file:text-[#F3F0E6] hover:file:bg-[#54202A]"
          />

          {importMessage && (
            <p role="status" className="mt-4 text-sm text-green-800">
              {importMessage}
            </p>
          )}
        </div>

        <div className="mt-10 border-t border-[#28251F]/20 pt-8">
          <label htmlFor="threshold" className="block text-sm font-medium">
            Required number of shares
          </label>
          <input
            id="threshold"
            type="number"
            min="2"
            max="256"
            value={threshold}
            onChange={(event) => {
              setThreshold(event.target.value);
              setResult(null);
              setError("");
            }}
            className="mt-3 w-full max-w-xs border border-[#28251F]/25 bg-transparent px-4 py-3 outline-none focus:border-[#702632]"
          />
        </div>

        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-2xl">Your shares</h2>
            <span className="text-sm text-[#28251F]/60">
              {selected.length} of {shares.length} selected
            </span>
          </div>

          <div className="space-y-3">
            {shares.map((share, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border border-[#28251F]/15 bg-white/30 px-4 py-3"
              >
                <input
                  type="checkbox"
                  aria-label={`Select share ${index + 1}`}
                  checked={selected.includes(index)}
                  onChange={() => toggleShare(index)}
                  className="h-4 w-4 accent-[#702632]"
                />

                <span className="w-8 text-sm text-[#28251F]/50">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <input
                  aria-label={`Share ${index + 1} coordinates`}
                  value={share}
                  onChange={(event) => updateShare(index, event.target.value)}
                  placeholder="Enter share as x, y"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none focus:border-b focus:border-[#702632]"
                />

                {shares.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeShare(index)}
                    className="text-xs text-[#702632] hover:underline"
                    aria-label={`Remove share ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addShare}
            className="mt-5 text-sm underline underline-offset-4"
          >
            + Add another share
          </button>
        </div>

        <button
          type="button"
          onClick={recoverSecret}
          className="mt-10 w-full bg-[#702632] px-6 py-4 text-sm font-medium text-[#F3F0E6] transition hover:bg-[#57202A] sm:w-auto"
        >
          Recover secret →
        </button>

        {error && (
          <p role="alert" className="mt-5 text-sm text-[#702632]">
            {error}
          </p>
        )}

        {result !== null && (
          <div
            aria-live="polite"
            className="mt-8 border border-[#A8B56A] bg-[#A8B56A]/15 p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em]">
              Recovered secret
            </p>
            <p className="mt-3 font-serif text-4xl">{result.toString()}</p>
            <p className="mt-3 text-sm text-[#28251F]/70">
              Reconstruction completed using the selected shares.
            </p>
          </div>
        )}

        <p className="mt-12 border-t border-[#28251F]/15 pt-5 text-xs leading-6 text-[#28251F]/55">
          This is an educational demonstration using a small finite field.
          Do not use it to protect real secrets.
        </p>
      </section>
    </main>
  );
}