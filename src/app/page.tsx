
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Set the threshold",
    description:
      "Choose how many shares to create and how many will be needed for recovery.",
  },
  {
    number: "02",
    title: "Generate shares",
    description:
      "A polynomial distributes the secret across separate points in a finite field.",
  },
  {
    number: "03",
    title: "Recover the secret",
    description:
      "Combine enough valid shares to reconstruct the original secret.",
  },
];

const shares = [
  { id: "A", color: "#702632" },
  { id: "B", color: "#A8B56A" },
  { id: "C", color: "#C7A58B" },
  { id: "D", color: "#8D9780" },
  { id: "E", color: "#702632" },
];

function ShareDiagram() {
  return (
    <div className="w-full min-w-0 border border-[#252522]/20 bg-[#E9E5D9] p-4 sm:p-8">
      <div className="flex items-start justify-between gap-3 border-b border-[#252522]/20 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#702632] sm:text-xs sm:tracking-[0.16em]">
            Share distribution
          </p>
          <p className="mt-1 text-xs text-[#626158] sm:text-sm">
            Illustrative · 3 of 5 required
          </p>
        </div>
        <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-[#77766D]">
          FIG. 01
        </span>
      </div>

      <div className="py-8 sm:py-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center border border-[#702632] bg-[#F3F0E6] sm:h-24 sm:w-24">
          <div className="text-center">
            <span className="font-serif text-3xl text-[#702632]">S</span>
            <p className="mt-1 text-[9px] uppercase tracking-[0.15em]">
              Secret
            </p>
          </div>
        </div>

        <div className="mx-auto h-8 w-px bg-[#252522]/40 sm:h-10" />
        <div className="mx-auto h-px w-[90%] bg-[#252522]/40" />

        <div className="mx-auto grid w-[90%] grid-cols-5">
          {shares.map((share, index) => (
            <div key={share.id} className="flex min-w-0 flex-col items-center">
              <div className="h-4 w-px bg-[#252522]/40 sm:h-5" />
              <div
                className="flex h-8 w-8 items-center justify-center border border-[#252522]/10 font-mono text-xs sm:h-9 sm:w-9"
                style={{
                  backgroundColor: share.color,
                  color:
                    index === 1 || index === 2 || index === 3
                      ? "#252522"
                      : "#F3F0E6",
                }}
              >
                {share.id}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-center gap-1.5 sm:mt-8 sm:gap-2">
          {shares.map((share, index) => (
            <span
              key={share.id}
              className={`h-1.5 flex-1 max-w-8 ${
                index < 3 ? "bg-[#702632]" : "bg-[#C9C5B8]"
              }`}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-[10px] leading-5 text-[#626158] sm:text-xs">
          Any 3 valid shares can reconstruct the secret.
        </p>
      </div>

      <div className="flex flex-wrap justify-between gap-2 border-t border-[#252522]/20 pt-4 font-mono text-[9px] uppercase tracking-[0.08em] text-[#77766D] sm:text-[10px] sm:tracking-[0.12em]">
        <span>Threshold scheme</span>
        <span>SSS / 001</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F3F0E6] text-[#252522]">
      <header className="border-b border-[#252522]/20">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5 lg:px-10">
          <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
            secret<span className="text-[#702632]">/</span>share
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.08em] text-[#55554D] sm:gap-x-6 sm:text-xs sm:tracking-[0.12em]">
            <a href="#method" className="py-1 transition hover:text-[#702632]">
              Method
            </a>
            <a href="#about" className="py-1 transition hover:text-[#702632]">
              About
            </a>
            <Link href="/split" className="py-1 transition hover:text-[#702632]">
              Split
            </Link>
            <Link href="/recover" className="py-1 transition hover:text-[#702632]">
              Recover
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:gap-12 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-10 lg:py-24">
        <div className="flex min-w-0 flex-col items-start">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#702632] sm:text-xs sm:tracking-[0.2em]">
            Cryptography / Project 001
          </p>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-[-0.05em] sm:mt-8 sm:text-6xl">
            A secret can be
            <br />
            <span className="font-serif font-normal italic text-[#702632]">
              shared in parts.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-[#626158] sm:mt-7 sm:text-base">
            An exploration of threshold cryptography through Shamir&apos;s
            Secret Sharing. Divide a value into separate pieces and require a
            chosen number of them to reconstruct it.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-9">
            <Link
              href="/split"
              className="inline-flex min-h-12 items-center justify-center bg-[#702632] px-5 py-3 text-sm text-[#F3F0E6] transition hover:bg-[#54202A]"
            >
              Split a secret <span className="ml-3">↗</span>
            </Link>
            <Link
              href="/recover"
              className="inline-flex min-h-12 items-center justify-center border border-[#702632]/50 px-5 py-3 text-sm text-[#702632] transition hover:bg-[#E9E5D9]"
            >
              Recover a secret <span className="ml-2">↗</span>
            </Link>
          </div>

          <p className="mt-4 text-xs text-[#77766D]">
            No account required.
          </p>

          <div className="mt-10 grid w-full max-w-lg grid-cols-2 border-y border-[#252522]/20 py-5 sm:mt-14">
            <div>
              <p className="font-serif text-2xl sm:text-3xl">K / N</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#77766D] sm:text-[10px] sm:tracking-[0.12em]">
                Threshold
              </p>
            </div>

            <div className="border-l border-[#252522]/20 pl-5">
              <p className="font-serif text-2xl sm:text-3xl">GF(p)</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#77766D] sm:text-[10px] sm:tracking-[0.12em]">
                Finite field
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <ShareDiagram />
        </div>
      </section>

      <section id="method" className="scroll-mt-6 border-t border-[#252522]/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#702632]">
                The process
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                Three steps. One threshold.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#626158]">
              Built to make the mathematics easier to understand, not hide it
              behind a button.
            </p>
          </div>

          <div className="grid border-l border-t border-[#252522]/20 sm:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="border-b border-r border-[#252522]/20 p-5 transition-colors hover:bg-[#E9E5D9] sm:p-8"
              >
                <p className="font-mono text-xs text-[#702632]">
                  / {step.number}
                </p>
                <h3 className="mt-6 text-lg font-semibold sm:mt-8">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#626158]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-7 flex flex-col items-start gap-4 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-8">
            <Link
              href="/split"
              className="text-sm text-[#702632] underline underline-offset-4 hover:text-[#54202A]"
            >
              Start splitting ↗
            </Link>
            <Link
              href="/recover"
              className="text-sm text-[#702632] underline underline-offset-4 hover:text-[#54202A]"
            >
              Recover a secret ↗
            </Link>
            <Link
              href="/learn"
              className="text-sm text-[#702632] underline underline-offset-4 hover:text-[#54202A]"
            >
              Learn how it works ↗
            </Link>
          </div>
        </div>
      </section>

      <footer id="about" className="scroll-mt-6 bg-[#252522] text-[#F3F0E6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8 lg:px-10">
          <div>
            <Link href="/" className="text-lg font-semibold">
              secret<span className="text-[#A8B56A]">/</span>share
            </Link>
            <p className="mt-2 text-sm text-[#B9B7AC]">
              Made with curiosity and a little cryptography.
            </p>
          </div>

          <a
            href="https://github.com/Viinuthaa/secret-share"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start border border-[#F3F0E6]/25 px-4 py-3 text-sm transition hover:border-[#A8B56A] hover:text-[#A8B56A] sm:self-center"
          >
            Star this project on GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
