
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Start with a secret",
    description:
      "The secret is stored as the constant term of a polynomial. In this demo, the secret is a whole number between 0 and 256.",
  },
  {
    number: "02",
    title: "Generate shares",
    description:
      "Random coefficients are used to create a polynomial. Each share is a point on that polynomial, represented as (x, y).",
  },
  {
    number: "03",
    title: "Collect enough shares",
    description:
      "The threshold determines how many distinct points are needed. For a threshold of 3, any 3 valid shares from the same polynomial are enough.",
  },
  {
    number: "04",
    title: "Reconstruct the secret",
    description:
      "Lagrange interpolation combines the points to calculate the polynomial's value at x = 0. That value is the original secret.",
  },
];

const exampleShares = ["(1, 8)", "(2, 15)", "(3, 26)"];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#F3F0E6] text-[#28251F]">
      <header className="border-b border-[#28251F]/15">
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12"
        >
          <Link
            href="/"
            aria-label="Secret Share home"
            className="text-xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
          >
            secret<span className="text-[#702632]">/</span>share
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link
              href="/split"
              className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
            >
              Split
            </Link>
            <Link
              href="/recover"
              className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
            >
              Recover
            </Link>
            <Link
              href="/learn"
              aria-current="page"
              className="text-[#702632] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702632]"
            >
              How it works
            </Link>
          </div>
        </nav>
      </header>

      <section
        aria-labelledby="page-title"
        className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[#702632]">
          Part 03 / The mathematics
        </p>

        <h1
          id="page-title"
          className="mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-7xl"
        >
          The math behind the secret.
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-[#28251F]/75">
          Secret Share uses Shamir&apos;s Secret Sharing. Instead of storing a
          secret in one place, it divides the secret into mathematical shares.
          A minimum number of shares is needed to recover the original value.
        </p>

        <ol className="mt-16 border-t border-[#28251F]/20">
          {steps.map((step) => (
            <li
              key={step.number}
              className="grid gap-3 border-b border-[#28251F]/15 py-8 sm:gap-4 md:grid-cols-[80px_1fr_1.5fr]"
            >
              <span
                aria-hidden="true"
                className="text-sm text-[#702632]"
              >
                {step.number}
              </span>
              <h2 className="font-serif text-2xl">{step.title}</h2>
              <p className="text-sm leading-7 text-[#28251F]/75">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <section
          aria-labelledby="interpolation-title"
          className="mt-16 border border-[#28251F]/20 bg-[#E9E5D9] p-5 sm:p-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#702632]">
            Lagrange interpolation
          </p>

          <h2
            id="interpolation-title"
            className="mt-4 font-serif text-3xl"
          >
            Recovering the value at zero.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#28251F]/75">
            Suppose we have a threshold of 3 and three shares:
          </p>

          <ul
            aria-label="Example shares"
            className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {exampleShares.map((point) => (
              <li
                key={point}
                className="border border-[#28251F]/20 bg-[#F3F0E6] px-3 py-5 text-center font-mono text-sm"
              >
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-7 text-[#28251F]/75">
            These points lie on the polynomial f(x) = 2x² + x + 5.
            Lagrange interpolation reconstructs its value at x = 0,
            giving f(0) = 5. The recovered secret is 5.
          </p>

          <div
            className="mt-8 border-l-2 border-[#702632] pl-5"
            aria-label="Recovered secret is 5"
          >
            <p className="font-serif text-2xl">f(0) = 5</p>
            <p className="mt-2 text-xs text-[#28251F]/70">
              Original secret recovered
            </p>
          </div>
        </section>

        <section aria-labelledby="threshold-title" className="mt-14">
          <h2 id="threshold-title" className="font-serif text-3xl">
            Why the threshold matters.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#28251F]/75">
            A polynomial of degree 2 needs three distinct points to determine
            it. That is why a 3-share threshold works. With fewer than three
            shares, the original polynomial is not uniquely determined.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#28251F]/75">
            All calculations in this project take place in GF(257), a finite
            field where arithmetic is performed modulo 257. The small field
            makes the mathematics easy to explore, but this implementation is
            only intended for learning and should not protect real secrets.
          </p>
        </section>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/split"
            className="inline-flex min-h-11 items-center justify-center bg-[#702632] px-6 py-4 text-sm text-[#F3F0E6] transition-colors hover:bg-[#54202A] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#702632] motion-reduce:transition-none"
          >
            Try splitting a secret <span aria-hidden="true" className="ml-2">→</span>
          </Link>

          <Link
            href="/recover"
            className="inline-flex min-h-11 items-center justify-center border border-[#702632] px-6 py-4 text-sm text-[#702632] transition-colors hover:bg-[#702632] hover:text-[#F3F0E6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#702632] motion-reduce:transition-none"
          >
            Recover a secret
          </Link>
        </div>
      </section>
    </main>
  );
}
