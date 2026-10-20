
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { reconstructSecret } from "@/lib/reconstruct";
import { parseShareFile } from "@/lib/share-file";
import type { Share } from "@/lib/shamir";

const MAX_SHARES = 256;

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
    setImportMessage("");
  }

  function selectAllShares() {
    setSelected(shares.map((_, index) => index));
    setResult(null);
    setError("");
    setImportMessage("");
  }

  function clearSelection() {
    setSelected([]);
    setResult(null);
    setError("");
    setImportMessage("");
  }

  function addShare() {
    if (shares.length >= MAX_SHARES) {
      setError(`You can add at most ${MAX_SHARES} shares.`);
      return;
    }

    const index = shares.length;
    setShares((current) => [...current, ""]);
    setSelected((current) => [...current, index]);
    setResult(null);
    setError("");
    setImportMessage("");
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
    setImportMessage("");
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

      if (imported.shares.length > MAX_SHARES) {
        throw new RangeError(`You can import at most ${MAX_SHARES} shares.`);
      }

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
      required > MAX_SHARES
    ) {
      setError(`Threshold must be an integer between 2 and ${MAX_SHARES}.`);
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
      setImportMessage("");
    } catch {
      setError("Could not recover the secret. Check the selected shares.");
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F3F0E6] text-[#28251F]">
      <header className="border-b border-[#28251F]/15">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5 lg:px-12">
          <Link
            href="/"
            className="shrink-0 text-xl font-semibold tracking-tight"
          >
            secret<span className="text-[#702632]">/</span>share
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:gap-5 sm:text-sm">
            <Link
              href="/split"
              className="py-1 underline underline-offset-4"
            >
              Split a secret
            </Link>
            <Link
              href="/learn"
              className="py-1 underline underline-offset-4"
            >
              How it works
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 md:py-24">
        <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-[#702632] sm:mb-5 sm:text-xs sm:tracking-[0.25em]">
          Part 02 / Recovery
        </p>

        <h1 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl md:text-7xl">
          Bring the pieces back together.
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#28251F]/70 sm:mt-6 sm:text-base">
          Import saved shares or enter them manually. Select the shares you
          want to use for reconstruction.
        </p>

        <div className="mt-8 border border-[#252522]/20 bg-[#E9E5D9] p-4 sm:mt-10 sm:p-8">
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
            className="mt-5 block min-h-12 w-full min-w-0 text-sm file:mr-3 file:min-h-11 file:border-0 file:bg-[#702632] file:px-3 file:py-3 file:text-[#F3F0E6] hover:file:bg-[#54202A] sm:file:mr-4 sm:file:px-4"
          />

          {importMessage && (
            <p role="status" className="mt-4 break-words text-sm text-green-800">
              {importMessage}
            </p>
          )}
        </div>

        <div className="mt-8 border-t border-[#28251F]/20 pt-6 sm:mt-10 sm:pt-8">
          <label htmlFor="threshold" className="block text-sm font-medium">
            Required number of shares
          </label>
          <input
            id="threshold"
            type="number"
            min="2"
            max={MAX_SHARES}
            value={threshold}
            onChange={(event) => {
              setThreshold(event.target.value);
              setResult(null);
              setError("");
              setImportMessage("");
            }}
            className="mt-3 min-h-12 w-full max-w-xs border border-[#28251F]/25 bg-transparent px-4 py-3 outline-none focus:border-[#702632]"
          />
        </div>

        <div className="mt-8 sm:mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-2xl">Your shares</h2>
            <span className="text-xs text-[#28251F]/60 sm:text-sm">
              {selected.length} of {shares.length} selected
            </span>
          </div>

          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={selectAllShares}
              disabled={selected.length === shares.length}
              className="min-h-10 text-sm text-[#702632] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearSelection}
              disabled={selected.length === 0}
              className="min-h-10 text-sm text-[#702632] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear selection
            </button>
          </div>

          <div className="space-y-3">
            {shares.map((share, index) => (
              <div
                key={index}
                className="grid min-w-0 grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border border-[#28251F]/15 bg-white/30 px-3 py-3 sm:flex sm:gap-3 sm:px-4"
              >
                <input
                  type="checkbox"
                  aria-label={`Select share ${index + 1}`}
                  checked={selected.includes(index)}
                  onChange={() => toggleShare(index)}
                  className="h-5 w-5 accent-[#702632]"
                />

                <span className="w-8 text-sm text-[#28251F]/50">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <input
                  aria-label={`Share ${index + 1} coordinates`}
                  value={share}
                  onChange={(event) => updateShare(index, event.target.value)}
                  placeholder="Enter share as x, y"
                  className="col-span-3 min-h-11 w-full min-w-0 border-b border-transparent bg-transparent px-1 py-2 text-sm outline-none focus:border-[#702632] sm:col-span-1 sm:flex-1 sm:px-2"
                />

                {shares.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeShare(index)}
                    className="col-span-3 min-h-10 justify-self-start px-1 text-xs text-[#702632] hover:underline sm:col-span-1"
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
            disabled={shares.length >= MAX_SHARES}
            className="mt-5 min-h-10 text-left text-sm underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add another share
          </button>

          <p className="mt-2 text-xs text-[#28251F]/55">
            {shares.length} of {MAX_SHARES} maximum shares
          </p>
        </div>

        <button
          type="button"
          onClick={recoverSecret}
          className="mt-8 min-h-12 w-full bg-[#702632] px-6 py-4 text-sm font-medium text-[#F3F0E6] transition hover:bg-[#57202A] sm:mt-10 sm:w-auto"
        >
          Recover secret →
        </button>

        {error && (
          <p role="alert" className="mt-5 break-words text-sm text-[#702632]">
            {error}
          </p>
        )}

        {result !== null && (
          <div
            aria-live="polite"
            className="mt-8 border border-[#A8B56A] bg-[#A8B56A]/15 p-4 sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em]">
              Recovered secret
            </p>
            <p className="mt-3 break-words font-serif text-4xl">
              {result.toString()}
            </p>
            <p className="mt-3 text-sm text-[#28251F]/70">
              Reconstruction completed using the selected shares.
            </p>
          </div>
        )}

        <p className="mt-10 border-t border-[#28251F]/15 pt-5 text-xs leading-6 text-[#28251F]/55 sm:mt-12">
          This is an educational demonstration using a small finite field.
          Do not use it to protect real secrets.
        </p>
      </section>
    </main>
  );
}
