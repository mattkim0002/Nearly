"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Hammer, CircleDot, Paintbrush, Home } from "lucide-react";
import { HeroSearch } from "./hero-search";

const PROFESSIONS = [
  "Woodworker",
  "Ceramicist",
  "Photographer",
  "Illustrator",
  "Interior Designer",
];

const CATEGORIES = [
  { label: "Photography",     slug: "photography",     Icon: Camera },
  { label: "Woodworking",     slug: "woodworking",     Icon: Hammer },
  { label: "Ceramics",        slug: "ceramics",        Icon: CircleDot },
  { label: "Illustration",    slug: "illustration",    Icon: Paintbrush },
  { label: "Interior Design", slug: "interior-design", Icon: Home },
];

const CYCLE_MS   = 2800;
const TRAVEL_MS  = 2200; // dots arrive this far into the cycle
const FLASH_MS   = 400;
const SEGMENTS   = 60;   // sample count — high density makes sine wave look smooth

interface CurveParams {
  amp:   number; // max amplitude in px  (30–62)
  freq:  number; // π multiplier         (3–7 → 1.5–3.5 sine cycles)
  phase: number; // starting phase offset (0–2π)
}

function randomCurveParams(): CurveParams {
  return {
    amp:   30 + Math.random() * 32,
    freq:  3  + Math.random() * 4,
    phase: Math.random() * Math.PI * 2,
  };
}

/** Build a smooth sine-wave path from startX → endX, converging on centerY. */
function buildPath(
  startX: number,
  endX: number,
  centerY: number,
  flipPhase: boolean,
  p: CurveParams,
): [number, number][] {
  const pts: [number, number][] = [];
  const sign = flipPhase ? -1 : 1;
  for (let i = 0; i <= SEGMENTS; i++) {
    const u   = i / SEGMENTS;
    const x   = startX + (endX - startX) * u;
    const amp = p.amp * (1 - u);           // amplitude shrinks to 0 at center
    const y   = centerY + sign * amp * Math.sin(u * Math.PI * p.freq + p.phase);
    pts.push([x, y]);
  }
  return pts;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function HeroSection() {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);
  const [flash,   setFlash]   = useState(false);

  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const professionRef  = useRef<HTMLSpanElement>(null);
  const curveParamsRef = useRef<{ left: CurveParams; right: CurveParams }>({
    left:  randomCurveParams(),
    right: randomCurveParams(),
  });

  // ── Profession cycling ────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PROFESSIONS.length);
        setVisible(true);
      }, 350);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  // ── Canvas animation ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Keep canvas pixel size in sync with layout size
    const syncSize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    syncSize();
    const obs = new ResizeObserver(syncSize);
    obs.observe(canvas);

    const ctx = canvas.getContext("2d")!;
    const startTime = performance.now();
    let rafId: number;
    let flashTriggered = false;

    function draw(ts: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);

      const elapsed = (ts - startTime) % CYCLE_MS;
      const t       = Math.min(elapsed / TRAVEL_MS, 1);
      const eased   = easeInOut(t);

      // Target: center of the profession text element
      let centerY = h * 0.30;
      if (professionRef.current) {
        const textRect   = professionRef.current.getBoundingClientRect();
        const canvasRect = canvas!.getBoundingClientRect();
        centerY = textRect.top - canvasRect.top + textRect.height / 2;
      }
      const centerX = w / 2;

      const leftPath  = buildPath(0, centerX, centerY, false, curveParamsRef.current.left);
      const rightPath = buildPath(w, centerX, centerY, true,  curveParamsRef.current.right);

      // Dots fade out in the last 15% of travel
      const dotAlpha = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;

      function drawTrail(pts: [number, number][]) {
        const totalSegs = pts.length - 1;
        const progress  = eased * totalSegs;
        const fullSegs  = Math.floor(progress);
        const partial   = progress - fullSegs;

        // ── Trail line ──
        ctx.beginPath();
        ctx.strokeStyle = "rgba(244,162,97,0.45)";
        ctx.lineWidth   = 2.5;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i <= Math.min(fullSegs, totalSegs); i++) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        }
        if (fullSegs < totalSegs) {
          const [ax, ay] = pts[fullSegs];
          const [bx, by] = pts[fullSegs + 1];
          ctx.lineTo(ax + (bx - ax) * partial, ay + (by - ay) * partial);
        }
        ctx.stroke();

        // ── Dot at leading edge (fades out near center) ──
        if (dotAlpha <= 0) return;
        let dx: number, dy: number;
        if (fullSegs >= totalSegs) {
          [dx, dy] = pts[totalSegs];
        } else {
          const [ax, ay] = pts[fullSegs];
          const [bx, by] = pts[fullSegs + 1];
          dx = ax + (bx - ax) * partial;
          dy = ay + (by - ay) * partial;
        }

        // Outer glow
        ctx.beginPath();
        ctx.arc(dx, dy, 9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,162,97,${0.18 * dotAlpha})`;
        ctx.fill();
        // Core dot
        ctx.beginPath();
        ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,162,97,${0.9 * dotAlpha})`;
        ctx.fill();
      }

      drawTrail(leftPath);
      drawTrail(rightPath);


      // ── Trigger text flash once per cycle ──
      if (t >= 0.99 && !flashTriggered) {
        flashTriggered = true;
        setFlash(true);
        setTimeout(() => setFlash(false), FLASH_MS);
      }
      if (elapsed < 100) {
        flashTriggered = false;
        curveParamsRef.current = { left: randomCurveParams(), right: randomCurveParams() };
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#faf8f5] py-16 md:py-24 px-6 flex flex-col items-center">

      {/* Connection animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[860px] w-full text-center">

        {/* Kinetic headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          <span className="block text-foreground">Find a</span>
          <span
            ref={professionRef}
            className="block text-primary"
            style={{
              opacity:    visible ? 1 : 0,
              filter:     flash ? "brightness(1.25)" : "brightness(1)",
              transform:  flash ? "scale(1.07)"      : "scale(1)",
              transition: "opacity 300ms ease, filter 120ms ease, transform 120ms ease-out",
            }}
          >
            {PROFESSIONS[index]}
          </span>
          <span className="block text-foreground">near you.</span>
        </h1>

        {/* Subtext */}
        <p className="text-muted-foreground text-lg mb-10 whitespace-nowrap">
          Connect with skilled local craftspeople who can bring your project to life.
        </p>

        {/* Search bar */}
        <div className="w-full flex justify-center mb-8">
          <HeroSearch />
        </div>

        {/* Category shortcut chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(({ label, slug, Icon }) => (
            <Link
              key={slug}
              href={`/search?category=${slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-sm font-medium hover:border-foreground transition-colors"
            >
              <Icon className="size-3.5 text-primary" />
              {label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
