
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
    <div className="w-full border border-[#252522]/20 bg-[#E9E5D9] p-5 sm:p-8">
      <div className="flex items-start justify-between border-b border-[#252522]/20 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#702632]">
            Share distribution
          </p>
          <p className="mt-1 text-sm text-[#626158]">
            Illustrative · 3 of 5 required
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-[0.12em] text-[#77766D]">
          FIG. 01
        </span>
      </div>

      <div className="py-10">
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
                      : "#F3F0E6",
                }}
              >
                {share.id}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {shares.map((share, index) => (
            <span
              key={share.id}
              className={`h-1.5 w-8 ${
                index < 3 ? "bg-[#702632]" : "bg-[#C9C5B8]"
              }`}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-[#626158]">
          Any 3 valid shares can reconstruct the secret.
        </p>
      </div>

      <div className="flex justify-between border-t border-[#252522]/20 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#77766D]">
        <span>Threshold scheme</span>
        <span>SSS / 001</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F3F0E6] text-[#252522]">
      <header className="border-b border-[#252522]/20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <a href="/" className="shrink-0 text-xl font-bold tracking-tight">
            secret<span className="text-[#702632]">/</span>share
          </a>

          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.16em] text-[#55554D] sm:flex">
            <a href="#method" className="transition hover:text-[#702632]">
              Method
            </a>
            <a href="#about" className="transition hover:text-[#702632]">
              About
            </a>
          </div>

          <span className="shrink-0 border border-[#702632]/40 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-[#702632] sm:px-3 sm:text-[10px]">
            In development
          </span>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-10 lg:py-24">
        <div className="flex min-w-0 flex-col items-start">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#702632] sm:text-xs sm:tracking-[0.2em]">
            Cryptography / Project 001
          </p>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.08] tracking-[-0.05em] sm:mt-8 sm:text-6xl">
            A secret can be
            <br />
            <span className="font-serif font-normal italic text-[#702632]">
              shared in parts.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-[#626158] sm:mt-7 sm:text-base">
            An exploration of threshold cryptography through Shamir&apos;s
            Secret Sharing. Divide a value into separate pieces and require a
            chosen number of them to reconstruct it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-9">
            <a
              href="#method"
              className="bg-[#702632] px-5 py-3 text-sm text-[#F3F0E6] transition hover:bg-[#54202A]"
            >
              Explore the method <span className="ml-3">↗</span>
            </a>
            <span className="text-xs text-[#77766D]">No account required</span>
          </div>

          <div className="mt-12 grid w-full max-w-lg grid-cols-3 border-y border-[#252522]/20 py-5 sm:mt-14">
            <div>
              <p className="font-serif text-2xl sm:text-3xl">K / N</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#77766D] sm:text-[10px] sm:tracking-[0.12em]">
                Threshold
              </p>
            </div>
            <div className="border-l border-[#252522]/20 pl-3 sm:pl-5">
              <p className="font-serif text-2xl sm:text-3xl">GF(p)</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#77766D] sm:text-[10px] sm:tracking-[0.12em]">
                Finite field
              </p>
            </div>
            <div className="border-l border-[#252522]/20 pl-3 sm:pl-5">
              <p className="font-serif text-2xl sm:text-3xl">0×01</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#77766D] sm:text-[10px] sm:tracking-[0.12em]">
                Build status
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <ShareDiagram />
        </div>
      </section>

      <section id="method" className="border-t border-[#252522]/20">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
                className="border-b border-r border-[#252522]/20 p-6 transition-colors hover:bg-[#E9E5D9] sm:p-8"
              >
                <p className="font-mono text-xs text-[#702632]">
                  / {step.number}
                </p>
                <h3 className="mt-8 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#626158]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#252522] text-[#F3F0E6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="text-lg font-semibold">
              secret<span className="text-[#A8B56A]">/</span>share
            </p>
            <p className="mt-1 text-sm text-[#B9B7AC]">
              An educational cryptography project.
            </p>
          </div>
          <p className="max-w-md text-xs leading-5 text-[#B9B7AC]">
            Under development. This interface is a prototype; do not use it to
            protect production secrets until the implementation has been
            independently reviewed.
          </p>
        </div>
      </section>
    </main>
  );
}

