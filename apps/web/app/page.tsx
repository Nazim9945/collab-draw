"use client";

import { motion } from "motion/react";
import { LoginButton } from "../components/LoginButton";

const collaborators = [
  { initials: "AM", color: "#ff6b4a", name: "Amina" },
  { initials: "JR", color: "#1f9e89", name: "Jules" },
  { initials: "TK", color: "#3867d6", name: "Theo" },
];

const features = [
  ["01", "Think out loud", "Shapes, notes, and arrows in one place."],
  ["02", "Make space", "Bring the whole team onto one canvas."],
  ["03", "Move together", "See every edit as it happens."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#20211e]">
      <nav className="mx-auto flex w-full max-w-330 items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <a
          href="#top"
          className="flex items-center gap-3 text-lg font-bold tracking-[-0.04em]"
        >
          <span className="grid size-9 place-items-center rounded-[10px] bg-[#20211e] text-sm text-[#f8d84a]">
            cd
          </span>
          collab<span className="text-[#ed684c]">.</span>draw
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#6d6e68] md:flex">
          <a className="transition-colors hover:text-[#20211e]" href="#why">
            Why collab.draw
          </a>
          <a
            className="transition-colors hover:text-[#20211e]"
            href="#workflow"
          >
            How it works
          </a>
        </div>
       <LoginButton/>
      </nav>

      <section
        id="top"
        className="mx-auto grid w-full max-w-330 gap-14 px-6 pb-20 pt-12 sm:px-10 md:pt-20 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-8 lg:px-14 lg:pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ed684c]">
            <span className="h-px w-8 bg-[#ed684c]" />
            For the messy middle
          </div>
          <h1 className="max-w-162.5 text-[clamp(3.8rem,8vw,7.8rem)] font-bold leading-[0.88] tracking-[-0.09em]">
            Sketch it
            <br />
            out{" "}
            <span className="relative inline-block text-[#ed684c]">
              together
              <span className="absolute -bottom-2 left-0 h-2 w-full -rotate-2 bg-[#f8d84a]" />
            </span>
            .
          </h1>
          <p className="mt-9 max-w-105 text-lg leading-8 text-[#6d6e68] sm:text-xl">
            Start with a blank board. Add a thought, move it around, and let the
            team make it better.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/signin"
              className="rounded-full bg-[#20211e] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#ed684c]"
            >
              Start drawing <span aria-hidden="true">→</span>
            </a>
            <a
              href="#workflow"
              className="px-3 py-3 text-sm font-bold underline decoration-[#ed684c] decoration-2 underline-offset-4"
            >
              See the magic
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotate: 1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
          className="relative lg:ml-auto lg:w-full lg:max-w-175"
        >
          <div className="relative aspect-[1.18/1] overflow-hidden rounded-[18px] border-2 border-[#20211e] bg-white shadow-[5px_5px_0_#20211e]">
            <div className="flex h-12 items-center justify-between border-b-2 border-[#20211e] bg-[#fffdf8] px-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#ed684c]" />
                <span className="size-3 rounded-full bg-[#f8d84a]" />
                <span className="size-3 rounded-full bg-[#1f9e89]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8c8c84]">
                launch map / monday
              </span>
              <div className="flex -space-x-2">
                {collaborators.map((person) => (
                  <span
                    key={person.initials}
                    title={person.name}
                    className="grid size-7 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.initials}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative h-[calc(100%-3rem)] overflow-hidden bg-[radial-gradient(#d7d8d1_1px,transparent_1px)] bg-size-[18px_18px]">
              <div className="absolute left-[10%] top-[20%] h-24 w-28 rotate-[-7deg] border-2 border-[#20211e] bg-[#f8d84a] p-3 text-xs font-bold">
                What if it felt a bit more...
              </div>
              <div className="absolute left-[42%] top-[13%] flex h-24 w-40 rotate-3 items-center justify-center border-2 border-[#20211e] bg-[#ed684c] text-center text-sm font-bold text-white">
                LIKE US?
              </div>
              <div className="absolute bottom-[15%] left-[18%] grid size-28 rotate-[4deg] place-items-center rounded-full border-2 border-[#20211e] bg-[#dcebe4] text-center text-xs font-bold">
                listen
                <br />
                <span className="font-normal">
                  → make
                  <br />→ share
                </span>
              </div>
              <div className="absolute bottom-[18%] right-[14%] h-24 w-32 rotate-[-5deg] border-2 border-[#20211e] bg-[#f3f0e8] p-3 text-xs leading-5">
                keep it simple
                <br />
                ship the first one
                <br />
                <span className="text-[#ed684c]">→</span>
              </div>
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 600 350"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M175 105C220 85 240 85 270 85"
                  stroke="#20211e"
                  strokeWidth="2"
                  strokeDasharray="5 6"
                />
                <path
                  d="M350 135C380 180 410 195 450 210"
                  stroke="#20211e"
                  strokeWidth="2"
                  strokeDasharray="5 6"
                />
                <path
                  d="M235 270C275 300 340 300 385 265"
                  stroke="#20211e"
                  strokeWidth="2"
                  strokeDasharray="5 6"
                />
              </svg>
              <motion.div
                animate={{ x: [0, 14, 0], y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[29%] right-[33%] text-[#3867d6] drop-shadow-sm"
              >
                <span className="text-3xl">↖</span>
                <span className="ml-1 rounded bg-[#3867d6] px-2 py-1 text-[10px] font-bold text-white">
                  Jules
                </span>
              </motion.div>
              <div className="absolute bottom-3 left-3 rounded-md border border-[#20211e] bg-white px-2 py-1 font-mono text-[9px] text-[#6d6e68]">
                ⌘ K tools
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="why"
        className="border-y-2 border-[#20211e] bg-[#20211e] text-[#f7f5ef]"
      >
        <div className="mx-auto grid max-w-330 gap-0 px-6 sm:px-10 md:grid-cols-3 lg:px-14">
          {features.map(([number, title, description], index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-white/15 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <span className="font-mono text-xs text-[#f8d84a]">{number}</span>
              <h2 className="mt-5 text-2xl font-bold tracking-[-0.04em]">
                {title}
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto max-w-330 px-6 py-20 sm:px-10 lg:px-14 lg:py-28"
      >
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1f9e89]">
              No polishing required
            </p>
            <h2 className="mt-4 max-w-155 text-4xl font-bold leading-[0.95] tracking-[-0.07em] sm:text-6xl">
              Put the rough version on the wall.
            </h2>
          </div>
          <a
            href="/signin"
            className="shrink-0 rounded-full border-2 border-[#20211e] px-6 py-3 text-sm font-bold transition hover:bg-[#f8d84a]"
          >
            Start drawing →
          </a>
        </div>
      </section>
    </main>
  );
}
