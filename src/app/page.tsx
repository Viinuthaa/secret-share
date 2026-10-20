
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
    <div
      className="w-full border border-[#252522]/20 bg-[#E9E5D9] p-5 sm:p-8"
      role="img"
      aria-label="Illustration of one secret distributed into five separate shares, with three shares required for recovery."
    >
      <div className="flex items-start justify-between border-b border-[#252522]/20 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#702632]">
            Share distribution
          </p>
          <p className="mt-1 text-sm text-[#626158]">
            Illustrative · 3 of 5 required
          </p>
        </div>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] tracking-[0.12em] text-[#77766D]"
        >
          FIG. 01
        </span>
      </div>

      <div aria-hidden="true" className="py-10">
        <div className="mx-auto flex h-24 w-24 items-center justify-center border border-[#702632] bg-[#F3F0E6]">
          <div className="text-center">
            <span className="font-serif text-3xl text-[#702632]">S</span>
            <p className="mt-1 text-[9px] uppercase tracking-[0.15em]">
              Secret
            </p>
          </div>
        </div>

        <div className="mx-auto h-10 w-px bg-[#252522]/40" />
        <div className="mx-auto h-px w-[80%] bg-[#252522]/40" />

        <div className="mx-auto grid w-[80%] grid-cols-5">
          {shares.map((share, index) => (
            <div key={share.id} className="flex flex-col items-center">
              <div className="h-5 w-px bg-[#252522]/40" />
              <div
                className="flex h-9 w-9 items-center justify-center border border-[#252522]/10 font-mono text-xs"
                style={{
                  backgroundColor: share.color,
                  color:
                    index === 1 || index === 2 || index === 3
                      ? "#252522"
                      : "#FFFFFF",
                }}
              >
                {share.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="border-t border-[#252522]/20 pt-4 text-xs leading-6 text-[#626158]">
        Three valid shares are enough to reconstruct the secret in this
        illustration.
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F3F0E6] text-[#252522]">
      <header className="border-b border-[#252522]/20">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"
        >
          <Link
            href="/"
            aria-label="Secret Share home"
            aria-current="page"
            className="text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
          >
            secret<span className="text-[#702632]">/</span>share
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs uppercase tracking-[0.12em] text-[#702632] sm:tracking-[0.16em]">
            <Link
              href="/split"
              className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
            >
              Split a secret
            </Link>
            <Link
              href="/recover"
              className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
            >
              Recover
            </Link>
            <Link
              href="/learn"
              className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
            >
              How it works
            </Link>
          </div>
        </nav>
      </header>

      <section
        aria-labelledby="hero-title"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#702632]">
            Cryptography / Project 001
          </p>

          <h1
            id="hero-title"
            className="mt-5 max-w-2xl font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl"
          >
            One secret.
            <br />
            <span className="text-[#702632]">Many pieces.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#626158]">
            Explore Shamir&apos;s Secret Sharing by splitting a number into
            separate shares and recovering it when enough shares come
            together.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/split"
              className="inline-flex min-h-11 items-center justify-center bg-[#702632] px-6 py-3 text-sm text-[#F3F0E6] transition-colors hover:bg-[#54202A] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#702632] motion-reduce:transition-none"
            >
              Try the demo
              <span aria-hidden="true" className="ml-3">
                →
              </span>
            </Link>

            <Link
              href="/learn"
              className="inline-flex min-h-11 items-center justify-center border border-[#252522]/30 px-6 py-3 text-sm transition-colors hover:bg-[#E9E5D9] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#702632] motion-reduce:transition-none"
            >
              Learn the basics
            </Link>
          </div>

          <p className="mt-6 max-w-lg text-xs leading-6 text-[#626158]">
            Educational demonstration only. Do not use this application to
            protect real passwords, keys, or confidential information.
          </p>
        </div>

        <ShareDiagram />
      </section>

      <section
        aria-labelledby="steps-title"
        className="border-t border-[#252522]/20"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#702632]">
              The process
            </p>
            <h2
              id="steps-title"
              className="mt-3 font-serif text-3xl sm:text-4xl"
            >
              Three steps. One secret.
            </h2>
          </div>

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="border-t border-[#252522]/30 pt-5"
              >
                <p
                  aria-hidden="true"
                  className="font-mono text-sm text-[#702632]"
                >
                  {step.number}
                </p>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#626158]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <Link
              href="/learn"
              className="text-sm text-[#702632] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
            >
              Explore the explanation →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#252522]/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs leading-6 text-[#626158] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Secret Share · An educational cryptography project</p>
          <Link
            href="/learn"
            className="w-fit text-[#702632] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
          >
            Read the security notes
          </Link>
        </div>
      </footer>
    </main>
  );
}
