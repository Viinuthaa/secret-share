
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

  function clearMessages() {
    setResult(null);
    setError("");
    setImportMessage("");
  }

  function updateShare(index: number, value: string) {
    setShares((current) =>
      current.map((share, i) => (i === index ? value : share)),
    );
    clearMessages();
  }

  function toggleShare(index: number) {
    setSelected((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
    clearMessages();
  }

  function selectAllShares() {
    setSelected(shares.map((_, index) => index));
    clearMessages();
  }

  function clearSelection() {
    setSelected([]);
    clearMessages();
  }

  function addShare() {
    if (shares.length >= MAX_SHARES) {
      setError(`You can add at most ${MAX_SHARES} shares.`);
      return;
    }

    const index = shares.length;
    setShares((current) => [...current, ""]);
    setSelected((current) => [...current, index]);
    clearMessages();
  }

  function removeShare(index: number) {
    setShares((current) => current.filter((_, i) => i !== index));
    setSelected((current) =>
      current
        .filter((item) => item !== index)
        .map((item) => (item > index ? item - 1 : item)),
    );
    clearMessages();
  }

  async function importShares(file: File | undefined) {
    clearMessages();

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
    setImportMessage("");

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
    } catch {
      setError("Could not recover the secret. Check the selected shares.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F0E6] text-[#28251F]">
      <header className="border-b border-[#28251F]/15">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12"
        >
          <Link href="/" className="text-xl font-semibold tracking-tight">
            secret<span className="text-[#702632]">/</span>share
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link href="/split" className="underline underline-offset-4">
              Split a secret
            </Link>
            <Link
              href="/recover"
              aria-current="page"
              className="font-semibold underline underline-offset-4"
            >
              Recover a secret
            </Link>
            <Link href="/learn" className="underline underline-offset-4">
              How it works
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#702632]">
          Part 02 / Recovery
        </p>

        <h1 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl md:text-7xl">
          Bring the pieces back together.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-[#28251F]/70">
          Import saved shares or enter them manually. Select the shares you
          want to use for reconstruction.
        </p>

        <section
          aria-labelledby="import-heading"
          className="mt-10 border border-[#252522]/20 bg-[#E9E5D9] p-5 sm:p-8"
        >
          <h2 id="import-heading" className="font-serif text-2xl">
            Import saved shares
          </h2>
          <p id="import-help" className="mt-2 text-sm leading-6 text-[#626158]">
            Select a .txt file downloaded from the Split page. Maximum file
            size: 100 KB.
          </p>

          <label htmlFor="share-file" className="sr-only">
            Choose a saved shares text file
          </label>
          <input
            ref={fileInput}
            id="share-file"
            name="shareFile"
            type="file"
            accept=".txt,text/plain"
            aria-describedby="import-help"
            onChange={(event) => void importShares(event.target.files?.[0])}
            className="mt-5 block w-full text-sm file:mr-4 file:border-0 file:bg-[#702632] file:px-4 file:py-3 file:text-[#F3F0E6] hover:file:bg-[#54202A]"
          />

          <p
            role="status"
            aria-live="polite"
            className={importMessage ? "mt-4 text-sm text-green-800" : "sr-only"}
          >
            {importMessage}
          </p>
        </section>

        <section
          aria-labelledby="threshold-heading"
          className="mt-10 border-t border-[#28251F]/20 pt-8"
        >
          <label
            htmlFor="threshold"
            id="threshold-heading"
            className="block text-sm font-medium"
          >
            Required number of shares
          </label>
          <p id="threshold-help" className="mt-2 text-sm text-[#626158]">
            Enter an integer between 2 and {MAX_SHARES}.
          </p>
          <input
            id="threshold"
            name="threshold"
            type="number"
            min="2"
            max={MAX_SHARES}
            step="1"
            required
            inputMode="numeric"
            value={threshold}
            aria-describedby="threshold-help"
            onChange={(event) => {
              setThreshold(event.target.value);
              clearMessages();
            }}
            className="mt-3 w-full max-w-xs border border-[#28251F]/25 bg-transparent px-4 py-3 focus-visible:border-[#702632]"
          />
        </section>

        <section className="mt-10" aria-labelledby="shares-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 id="shares-heading" className="font-serif text-2xl">
              Your shares
            </h2>
            <p className="text-sm text-[#28251F]/70" aria-live="polite">
              {selected.length} of {shares.length} selected
            </p>
          </div>

          <div className="mb-5 flex flex-wrap gap-4">
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
                className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-3 border border-[#28251F]/15 bg-white/30 px-3 py-3 sm:flex sm:px-4"
              >
                <input
                  id={`select-share-${index}`}
                  type="checkbox"
                  checked={selected.includes(index)}
                  onChange={() => toggleShare(index)}
                  className="h-5 w-5 accent-[#702632]"
                />

                <label
                  htmlFor={`select-share-${index}`}
                  className="text-sm text-[#28251F]/70"
                >
                  {`Share ${String(index + 1).padStart(2, "0")}`}
                </label>

                <label htmlFor={`share-value-${index}`} className="sr-only">
                  {`Coordinates for share ${index + 1}, in x, y format`}
                </label>
                <input
                  id={`share-value-${index}`}
                  name={`share-${index + 1}`}
                  value={share}
                  onChange={(event) => updateShare(index, event.target.value)}
                  placeholder="Enter x, y"
                  autoComplete="off"
                  spellCheck={false}
                  className="col-span-3 min-w-0 border-b border-transparent bg-transparent px-2 py-3 focus-visible:border-[#702632] sm:col-span-1 sm:flex-1"
                />

                {shares.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeShare(index)}
                    className="col-span-3 min-h-10 justify-self-start text-sm text-[#702632] underline underline-offset-4 sm:col-span-1"
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
            className="mt-5 min-h-10 text-sm underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add another share
          </button>

          <p className="mt-2 text-xs text-[#28251F]/65">
            {shares.length} of {MAX_SHARES} maximum shares
          </p>
        </section>

        <button
          type="button"
          onClick={recoverSecret}
          className="mt-10 min-h-12 w-full bg-[#702632] px-6 py-4 text-sm font-medium text-[#F3F0E6] transition hover:bg-[#57202A] sm:w-auto"
        >
          Recover secret <span aria-hidden="true">→</span>
        </button>

        <p
          role="alert"
          aria-live="assertive"
          className={error ? "mt-5 text-sm text-[#702632]" : "sr-only"}
        >
          {error}
        </p>

        {result !== null && (
          <section
            aria-labelledby="result-heading"
            aria-live="polite"
            className="mt-8 border border-[#A8B56A] bg-[#A8B56A]/15 p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em]">
              Recovered secret
            </p>
            <h2 id="result-heading" className="sr-only">
              Secret recovered successfully
            </h2>
            <p className="mt-3 font-serif text-4xl">{result.toString()}</p>
            <p className="mt-3 text-sm text-[#28251F]/70">
              Reconstruction completed using the selected shares.
            </p>
          </section>
        )}

        <p className="mt-12 border-t border-[#28251F]/15 pt-5 text-xs leading-6 text-[#28251F]/65">
          This is an educational demonstration using a small finite field.
          Do not use it to protect real secrets.
        </p>
      </section>
    </main>
  );
}
