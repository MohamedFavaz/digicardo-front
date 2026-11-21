"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/** Landing palette — calm off-white canvas, ink type, Digicardo violet + lime accents. */
export const V = {
  bg: "#F6F6F3",
  ink: "#121018",
  muted: "#6B6779",
  line: "#E7E5DF",
  violet: "#5B3FE4",
  lime: "#DAF56B",
  pink: "#F6B6E6",
  card: "#FFFFFF",
} as const;

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Big display heading style used across the page (medium weight, tight tracking). */
export const heading = "font-medium tracking-[-0.045em] leading-[1.02]";

/**
 * Scroll progress (0→1) of an element as a plain motion value. Framer can otherwise hand
 * scroll-linked opacity to the browser's native scroll timeline, which tracks the whole page
 * instead of the element — values then drift out of sync with the section.
 */
export function useSectionProgress(ref: React.RefObject<HTMLElement | null>, offset: NonNullable<Parameters<typeof useScroll>[0]>["offset"]) {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));
  React.useEffect(() => {
    p.set(scrollYProgress.get());
  }, [p, scrollYProgress]);
  return p;
}

/** matchMedia hook; `initial` is used for the server render and first paint. */
export function useMedia(query: string, initial = true) {
  const [match, setMatch] = React.useState(initial);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

type Accent = Record<string, string>;

function splitWords(text: string) {
  // "\n" forces a line break; keeps punctuation on the word.
  return text.split("\n").map((line) => line.split(" ").filter(Boolean));
}

const clean = (w: string) => w.replace(/[.,!?:;]/g, "").toLowerCase();

/**
 * Word-by-word reveal when the heading enters the view: each word rises out of a soft blur,
 * one after another — the "type settling in" feel of the reference site.
 */
export function WordReveal({
  text,
  as: Tag = "h2",
  className,
  accent,
  delay = 0,
  stagger = 0.06,
  id,
  show,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** word (lower-case, no punctuation) → colour */
  accent?: Accent;
  delay?: number;
  stagger?: number;
  id?: string;
  /** Drive the reveal from outside (e.g. a pinned scene) instead of on scroll-into-view. */
  show?: boolean;
}) {
  const reduce = useReducedMotion();
  const lines = splitWords(text);
  const hidden = { y: "0.55em", opacity: 0, filter: "blur(8px)" };
  const visible = { y: 0, opacity: 1, filter: "blur(0px)" };
  let i = 0;
  return (
    <Tag id={id} className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((words, li) => (
        <span key={li} aria-hidden="true" className="block">
          {words.map((w, wi) => {
            const n = i++;
            const color = accent?.[clean(w)];
            return (
              <React.Fragment key={wi}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <motion.span
                    className="inline-block will-change-transform"
                    style={color ? { color } : undefined}
                    initial={reduce ? false : hidden}
                    {...(show === undefined
                      ? { whileInView: visible, viewport: { once: true, margin: "0px 0px -12% 0px" } }
                      : { animate: show || reduce ? visible : hidden })}
                    transition={{ duration: 0.8, ease: EASE, delay: show === false ? 0 : delay + n * stagger }}
                  >
                    {w}
                  </motion.span>
                </span>
                {wi < words.length - 1 && " "}
              </React.Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

function ScrollWord({ children, progress, range, color }: { children: React.ReactNode; progress: MotionValue<number>; range: [number, number]; color?: string }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity, color }} className="inline">
      {children}
    </motion.span>
  );
}

/**
 * Paragraph whose words light up from grey to ink as it scrolls through the screen.
 * Pass `progress` to drive it from a parent (e.g. a sticky section); otherwise it tracks itself.
 */
export function ScrollWords({
  text,
  className,
  accent,
  progress,
  range = [0, 1],
  inline,
}: {
  text: string;
  className?: string;
  accent?: Accent;
  progress?: MotionValue<number>;
  range?: [number, number];
  /** Extra nodes after given words, e.g. small icons: word → node */
  inline?: Record<string, React.ReactNode>;
}) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const own = useSectionProgress(ref, ["start 0.9", "end 0.45"]);
  const p = progress ?? own;
  const words = text.split(" ");
  const span = range[1] - range[0];
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const a = range[0] + (span * i) / words.length;
        const b = range[0] + (span * (i + 1)) / words.length;
        const key = clean(w);
        return (
          <React.Fragment key={i}>
            <ScrollWord progress={p} range={[a, b]} color={accent?.[key]}>
              {w}
              {inline?.[key] && <span className="ml-[0.2em] inline-flex align-middle">{inline[key]}</span>}
            </ScrollWord>{" "}
          </React.Fragment>
        );
      })}
    </p>
  );
}

/** Endless horizontal strip; children are rendered twice so the loop is seamless. */
export function Marquee({
  children,
  reverse,
  seconds = 40,
  className,
  fade = true,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  seconds?: number;
  className?: string;
  fade?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", fade && "[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]", className)}>
      <div
        className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]"
        style={{ animationDuration: `${seconds}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

const BUBBLE: Record<string, { bg: string; fg: string }> = {
  violet: { bg: V.violet, fg: "#fff" },
  ink: { bg: V.ink, fg: "#fff" },
  lime: { bg: V.lime, fg: V.ink },
  pink: { bg: V.pink, fg: V.ink },
  green: { bg: "#1FAF73", fg: "#fff" },
};

/** "@handle" chat bubble that bobs gently — the people behind the cards. */
export function Handle({
  name,
  tone = "violet",
  className,
  tail = "left",
  float = true,
  delay = 0,
}: {
  name: string;
  tone?: keyof typeof BUBBLE;
  className?: string;
  tail?: "left" | "right";
  float?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const c = BUBBLE[tone];
  return (
    <motion.span
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-20 select-none", className)}
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
    >
      <span className={cn("relative block", float && "animate-float motion-reduce:animate-none")} style={{ animationDuration: "4s", animationDelay: `${delay}s` }}>
        <span className="block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-[0_8px_24px_-10px_rgba(18,16,24,0.45)]" style={{ background: c.bg, color: c.fg }}>
          @{name}
        </span>
        <svg viewBox="0 0 12 10" className={cn("absolute -bottom-[7px] h-2.5 w-3", tail === "left" ? "left-3" : "right-3 -scale-x-100")} aria-hidden="true">
          <path d="M0 0h12L2 10z" fill={c.bg} />
        </svg>
      </span>
    </motion.span>
  );
}

/** Small uppercase eyebrow with one coloured word, e.g. "GET MORE CLOSER". */
export function Eyebrow({ children, accent, className }: { children: string; accent?: string; className?: string }) {
  return (
    <p className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", className)} style={{ color: V.ink }}>
      {children}
      {accent && <span style={{ color: V.violet }}> {accent}</span>}
    </p>
  );
}

/** Dark pill button / link. */
export function PillLink({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "white" | "lime" | "violet";
  className?: string;
}) {
  const tones = {
    ink: "bg-[#121018] text-white hover:bg-[#2A2635]",
    white: "bg-white text-[#121018] hover:bg-[#F1F0EC]",
    lime: "bg-[#DAF56B] text-[#121018] hover:bg-[#CDEB55]",
    violet: "bg-[#5B3FE4] text-white hover:bg-[#4C32D0]",
  } as const;
  const cls = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:translate-y-0",
    tones[tone],
    className,
  );
  if (href.startsWith("#") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
